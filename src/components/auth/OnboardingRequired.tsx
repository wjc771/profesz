
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
    if (!loading && user) {
      // Verificar se o onboarding foi completado
      const onboardingCompleted = localStorage.getItem('onboarding_completed');
      
      if (!onboardingCompleted) {
        // Redirecionar para onboarding se não foi completado
        navigate('/onboarding', { 
          state: { 
            firstLogin: true, 
            name: user.user_metadata?.name || user.email?.split('@')[0] 
          } 
        });
      } else {
        setOnboardingChecked(true);
      }
    }
  }, [user, loading, navigate]);

  if (loading || !onboardingChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};
