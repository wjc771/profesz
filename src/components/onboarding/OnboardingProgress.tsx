
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function OnboardingProgress({ currentStep, totalSteps, steps }: OnboardingProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">
          Passo {currentStep} de {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(progress)}%
        </span>
      </div>
      
      <Progress value={progress} className="h-2 mb-4" />
      
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
              index + 1 <= currentStep 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {index + 1 < currentStep ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </div>
            <span className="text-xs text-center text-muted-foreground max-w-16">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
