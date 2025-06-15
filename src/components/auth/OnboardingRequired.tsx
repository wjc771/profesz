
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfilePreferences } from '@/hooks/useProfilePreferences';

interface OnboardingRequiredProps {
  children: React.ReactNode;
}

export const OnboardingRequired = ({ children }: OnboardingRequiredProps) => {
  const { user, loading } = useAuth();
  const { checkOnboardingStatus } = useProfilePreferences();
  const navigate = useNavigate();
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    console.log('OnboardingRequired: checking...', { 
      user: !!user, 
      loading, 
      userEmail: user?.email,
      emailConfirmed: user?.email_confirmed_at 
    });
    
    if (!loading) {
      // If no user, redirect to login
      if (!user) {
        console.log('OnboardingRequired: No user found, redirecting to login');
        navigate('/login');
        return;
      }
      
      // Verificar se o email foi confirmado ou se a verificação foi pulada
      const emailVerificationSkipped = localStorage.getItem('email_verification_skipped') === 'true';
      
      if (!user.email_confirmed_at && !emailVerificationSkipped) {
        console.log('OnboardingRequired: Email not confirmed and not skipped, redirecting to verification');
        navigate('/verification-pending');
        return;
      }
      
      // Check onboarding completion from database
      checkOnboardingStatus().then(completed => {
        console.log('OnboardingRequired: onboarding status from DB', { completed });
        
        if (!completed) {
          // Redirect to onboarding if not completed
          console.log('OnboardingRequired: Redirecting to onboarding');
          navigate('/onboarding', { 
            state: { 
              firstLogin: true, 
              name: user.user_metadata?.name || user.email?.split('@')[0] 
            } 
          });
        } else {
          console.log('OnboardingRequired: Onboarding completed, allowing access');
          
          // Limpar dados legados do localStorage se ainda existirem
          const legacyOnboarding = localStorage.getItem('onboarding_completed');
          if (legacyOnboarding) {
            localStorage.removeItem('onboarding_completed');
            localStorage.removeItem('user_type');
            localStorage.removeItem('questionnaire_data');
          }
          
          setOnboardingChecked(true);
        }
      });
    }
  }, [user, loading, navigate, checkOnboardingStatus]);

  if (loading || !onboardingChecked) {
    console.log('OnboardingRequired: Still loading or checking onboarding');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
