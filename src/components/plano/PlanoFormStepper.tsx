
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface PlanoFormStepperProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  canAdvance: boolean;
  isLastStep: boolean;
}

export function PlanoFormStepper({ 
  currentStep, 
  totalSteps, 
  onBack, 
  onNext,
  canAdvance,
  isLastStep
}: PlanoFormStepperProps) {
  return (
    <Card className="p-4 sticky bottom-4 border shadow-lg bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Passo {currentStep} de {totalSteps}</div>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button variant="outline" size="sm" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
          )}
          
          <Button 
            disabled={!canAdvance}
            size="sm" 
            onClick={onNext}
          >
            {isLastStep ? 'Finalizar' : 'Avançar'}
            {!isLastStep && <ChevronRight className="h-4 w-4 ml-1" />}
          </Button>
        </div>
      </div>
    </Card>
  );
}
