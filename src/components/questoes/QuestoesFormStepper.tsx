
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestoesFormStepperProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  canAdvance: boolean;
  isLastStep: boolean;
}

export function QuestoesFormStepper({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  canAdvance,
  isLastStep
}: QuestoesFormStepperProps) {
  return (
    <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-center pt-6">
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-2.5 h-2.5 rounded-full ${
              index + 1 === currentStep
                ? "bg-primary"
                : index + 1 < currentStep
                ? "bg-primary/70"
                : "bg-gray-300"
            }`}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-2">
          Passo {currentStep} de {totalSteps}
        </span>
      </div>
      <div className="flex space-x-2">
        <Button
          onClick={onBack}
          disabled={currentStep === 1}
          variant="outline"
          type="button"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={!canAdvance}
          type={isLastStep ? "submit" : "button"}
        >
          {isLastStep ? "Gerar Questões" : "Próximo"}
          {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
