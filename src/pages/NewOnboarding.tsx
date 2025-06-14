import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { OnboardingProgress } from '@/components/onboarding/OnboardingProgress';
import { OnboardingWelcome } from '@/components/onboarding/OnboardingWelcome';
import { UserTypeSelector } from '@/components/onboarding/UserTypeSelector';
import { ProfileQuestionnaire } from '@/components/onboarding/ProfileQuestionnaire';
import { InteractiveTutorial } from '@/components/onboarding/InteractiveTutorial';
import { OnboardingComplete } from '@/components/onboarding/OnboardingComplete';
import { UserType } from '@/types/profile';
import { useToast } from '@/components/ui/use-toast';

interface QuestionnaireData {
  subjects?: string[];
  gradeLevel?: string;
  institutionType?: string;
  experience?: string;
  goals?: string[];
  frequency?: string;
  childName?: string;
  childGrade?: string;
}

export default function NewOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<UserType | undefined>();
  const [questionnaireData, setQuestionnaireData] = useState<QuestionnaireData>({});
  
  const isFirstLogin = location.state?.firstLogin;
  const userName = location.state?.name;
  
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

  const handleQuestionnaireDataChange = (data: QuestionnaireData) => {
    setQuestionnaireData(data);
  };

  const handleFinish = () => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('user_type', userType || '');
    localStorage.setItem('questionnaire_data', JSON.stringify(questionnaireData));
    
    toast({
      title: 'Onboarding concluído!',
      description: 'Sua conta foi configurada com sucesso. Bem-vindo ao Profzi!',
    });
    
    navigate('/dashboard');
  };

  if (!isFirstLogin) {
    navigate('/dashboard');
    return null;
  }

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
