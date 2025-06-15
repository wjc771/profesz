
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { OnboardingWelcome } from '@/components/onboarding/OnboardingWelcome';
import { UserTypeSelector } from '@/components/onboarding/UserTypeSelector';
import { ProfileQuestionnaire } from '@/components/onboarding/ProfileQuestionnaire';
import { InteractiveTutorial } from '@/components/onboarding/InteractiveTutorial';
import { OnboardingComplete } from '@/components/onboarding/OnboardingComplete';
import { UserType } from '@/types/profile';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfilePreferences, UserPreferences } from '@/hooks/useProfilePreferences';

export default function NewOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const { 
    preferences, 
    loading: preferencesLoading, 
    markOnboardingComplete, 
    checkOnboardingStatus 
  } = useProfilePreferences();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<UserType | undefined>();
  const [questionnaireData, setQuestionnaireData] = useState<UserPreferences>({});
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  
  // Verify user authentication and onboarding status
  useEffect(() => {
    console.log('NewOnboarding: Component mounted', { 
      user: !!user, 
      loading, 
      userEmail: user?.email,
      emailConfirmed: user?.email_confirmed_at 
    });
    
    if (!loading && !preferencesLoading) {
      if (!user) {
        console.log('NewOnboarding: No user, redirecting to login');
        navigate('/login');
        return;
      }
      
      // Verificar se o email foi confirmado ou se a verificação foi pulada
      const emailVerificationSkipped = localStorage.getItem('email_verification_skipped') === 'true';
      
      if (!user.email_confirmed_at && !emailVerificationSkipped) {
        console.log('NewOnboarding: Email not confirmed and not skipped, redirecting to verification');
        navigate('/verification-pending');
        return;
      }
      
      // Check onboarding status from database
      checkOnboardingStatus().then(completed => {
        console.log('NewOnboarding: Onboarding status from DB', { completed });
        
        if (completed) {
          console.log('NewOnboarding: Onboarding already completed, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }
        
        // Se não completou onboarding, carregar preferências existentes se houver
        setQuestionnaireData(preferences);
        setOnboardingChecked(true);
        console.log('NewOnboarding: User authenticated and onboarding not completed - proceeding');
      });
    }
  }, [user, loading, preferencesLoading, navigate, checkOnboardingStatus, preferences]);
  
  const isFirstLogin = location.state?.firstLogin ?? true;
  const userName = location.state?.name || user?.user_metadata?.name || user?.email?.split('@')[0];
  const preselectedUserType = location.state?.userType;
  
  // Set userType if preselected
  useEffect(() => {
    if (preselectedUserType && !userType) {
      console.log('NewOnboarding: Setting preselected user type', { preselectedUserType });
      setUserType(preselectedUserType);
    }
  }, [preselectedUserType, userType]);
  
  const steps = ['Boas-vindas', 'Perfil', 'Preferências', 'Tutorial', 'Concluído'];
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type);
  };

  const handleQuestionnaireDataChange = (data: UserPreferences) => {
    setQuestionnaireData(data);
  };

  const handleFinish = async () => {
    console.log('NewOnboarding: Finishing onboarding', { userType, questionnaireData });
    
    // Marcar onboarding como completo no banco de dados
    const success = await markOnboardingComplete();
    
    if (success) {
      // Limpar localStorage legado
      localStorage.removeItem('onboarding_completed');
      localStorage.removeItem('user_type');
      localStorage.removeItem('questionnaire_data');
      localStorage.removeItem('email_verification_skipped');
      
      toast({
        title: 'Onboarding concluído!',
        description: 'Sua conta foi configurada com sucesso. Bem-vindo ao ProfesZ!',
      });
      
      console.log('NewOnboarding: Redirecting to dashboard');
      navigate('/dashboard');
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível concluir o onboarding. Tente novamente.',
      });
    }
  };

  if (loading || preferencesLoading || !onboardingChecked) {
    console.log('NewOnboarding: Still loading...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log('NewOnboarding: No user found');
    return null;
  }

  const emailVerificationSkipped = localStorage.getItem('email_verification_skipped') === 'true';
  
  if (!user.email_confirmed_at && !emailVerificationSkipped) {
    console.log('NewOnboarding: Email not confirmed and not skipped');
    return null;
  }

  console.log('NewOnboarding: Rendering step', { currentStep });

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingWelcome 
            userName={userName}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <UserTypeSelector
            selectedType={userType}
            onSelect={handleUserTypeSelect}
            onNext={handleNext}
          />
        );
      case 3:
        return userType ? (
          <ProfileQuestionnaire
            userType={userType}
            data={questionnaireData}
            onDataChange={handleQuestionnaireDataChange}
            onNext={handleNext}
            onBack={handleBack}
          />
        ) : null;
      case 4:
        return userType ? (
          <InteractiveTutorial
            userType={userType}
            onComplete={handleNext}
            onBack={handleBack}
          />
        ) : null;
      case 5:
        return (
          <OnboardingComplete
            userType={userType!}
            userName={userName}
            onFinish={handleFinish}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {currentStep > 1 && currentStep < totalSteps && (
        <div className="pt-8">
          <OnboardingProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            steps={steps}
          />
        </div>
      )}
      
      <div className="flex-1">
        {renderCurrentStep()}
      </div>
    </div>
  );
}
