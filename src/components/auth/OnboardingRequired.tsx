
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface OnboardingRequiredProps {
  children: React.ReactNode;
}

export const OnboardingRequired = ({ children }: OnboardingRequiredProps) => {
  const { user, loading } = useAuth();
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
      
      // If user exists but email not confirmed, redirect to verification
      if (!user.email_confirmed_at) {
        console.log('OnboardingRequired: Email not confirmed, redirecting to verification');
        navigate('/verification-pending');
        return;
      }
      
      // Check onboarding completion
      const onboardingCompleted = localStorage.getItem('onboarding_completed');
      
      console.log('OnboardingRequired: onboarding status', { onboardingCompleted });
      
      if (!onboardingCompleted) {
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
        setOnboardingChecked(true);
      }
    }
  }, [user, loading, navigate]);

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
