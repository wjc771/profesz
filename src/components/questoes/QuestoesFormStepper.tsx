
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { motion } from "framer-motion";

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
    <div className="border-t bg-card/30 p-6">
      <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:justify-between md:items-center">
        {/* Progress indicators */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0.7 }}
                animate={{ 
                  scale: index + 1 === currentStep ? 1 : 0.8,
                  opacity: index + 1 === currentStep ? 1 : 0.7
                }}
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors
                  ${index + 1 === currentStep
                    ? "border-primary bg-primary text-primary-foreground"
                    : index + 1 < currentStep
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-muted bg-muted/30 text-muted-foreground"
                  }`}
              >
                {index + 1 < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </motion.div>
            ))}
          </div>

          <span className="text-sm text-muted-foreground">
            {getStepName(currentStep)} (Passo {currentStep} de {totalSteps})
          </span>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={onBack}
            disabled={currentStep === 1}
            variant="outline"
            type="button"
            className="flex-1 md:flex-none"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
          <Button
            onClick={onNext}
            disabled={!canAdvance}
            type={isLastStep ? "submit" : "button"}
            className="flex-1 md:flex-none"
          >
            {isLastStep ? "Gerar Questões" : "Próximo"}
            {!isLastStep && <ChevronRight className="ml-1 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper function to get step name
function getStepName(step: number): string {
  switch (step) {
    case 1:
      return "Configuração";
    case 2:
      return "Estrutura";
    case 3:
      return "Questões";
    default:
      return "Passo";
  }
}
