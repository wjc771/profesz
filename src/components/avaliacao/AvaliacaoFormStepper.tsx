
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AvaliacaoFormStepperProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  canAdvance: boolean;
  isLastStep: boolean;
}

export function AvaliacaoFormStepper({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  canAdvance,
  isLastStep,
}: AvaliacaoFormStepperProps) {
  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row items-center justify-between mt-6">
      <div className="flex items-center space-x-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-2 w-8 rounded-full ${
              i < currentStep ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <Button
          type="button"
          onClick={onNext}
          disabled={!canAdvance}
        >
          {isLastStep ? (
            "Gerar Avaliação"
          ) : (
            <>
              Avançar
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
