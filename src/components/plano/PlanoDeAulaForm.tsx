
import { Card } from "@/components/ui/card";
import { PlanoFormStepper } from "./PlanoFormStepper";
import { PlanoFormHeader } from "./PlanoFormHeader";
import { FormStepWrapper } from "./FormStepWrapper";
import { SubscriptionPlanType } from "@/types/profile";
import { Form } from "@/components/ui/form";
import { usePlanoForm } from "@/hooks/usePlanoForm";
import { isStepValid } from "@/utils/planoValidation";

interface PlanoDeAulaFormProps {
  plano: SubscriptionPlanType;
  usageCount: number;
  usageLimit: number | null;
}

export function PlanoDeAulaForm({ plano, usageCount, usageLimit }: PlanoDeAulaFormProps) {
  const {
    form,
    step,
    totalSteps,
    nextStep,
    prevStep,
    onSubmit,
  } = usePlanoForm();
  
  const currentStepIsValid = () => isStepValid(step, form);
  
  return (
    <div className="max-w-3xl mx-auto">
      <PlanoFormHeader 
        plano={plano}
        usageCount={usageCount}
        usageLimit={usageLimit}
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="overflow-hidden">
            <FormStepWrapper step={step} form={form} plano={plano} />
          </Card>
          
          <PlanoFormStepper
            currentStep={step}
            totalSteps={totalSteps}
            onBack={prevStep}
            onNext={step === totalSteps ? form.handleSubmit(onSubmit) : nextStep}
            canAdvance={currentStepIsValid()}
            isLastStep={step === totalSteps}
          />
        </form>
      </Form>
    </div>
  );
}
