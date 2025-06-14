
import { ReactNode } from "react";
import { InfoStep } from "./steps/InfoStep";
import { ObjetivosStep } from "./steps/ObjetivosStep";
import { ConteudoStep } from "./steps/ConteudoStep";
import { EstruturaStep } from "./steps/EstruturaStep";
import { AvaliacaoStep } from "./steps/AvaliacaoStep";
import { RecursosStep } from "./steps/RecursosStep";
import { ModelosCompeticaoStep } from "./steps/ModelosCompeticaoStep";
import { PersonalizacaoAvancadaStep } from "./steps/PersonalizacaoAvancadaStep";
import { ResumoFinalStep } from "./steps/ResumoFinalStep";
import { UseFormReturn } from "react-hook-form";
import { SubscriptionPlanType } from "@/types/profile";
import { PlanoFormValues } from "@/hooks/usePlanoForm";

interface FormStepWrapperProps {
  step: number;
  form: UseFormReturn<PlanoFormValues>;
  plano: SubscriptionPlanType;
}

export function FormStepWrapper({ step, form, plano }: FormStepWrapperProps) {
  const renderStepContent = (): ReactNode => {
    switch (step) {
      case 1:
        return <InfoStep form={form} plano={plano} />;
      case 2:
        return <ObjetivosStep form={form} plano={plano} />;
      case 3:
        return <ConteudoStep form={form} plano={plano} />;
      case 4:
        return <EstruturaStep form={form} plano={plano} />;
      case 5:
        return <AvaliacaoStep form={form} plano={plano} />;
      case 6:
        return <RecursosStep form={form} plano={plano} />;
      case 7:
        return <ModelosCompeticaoStep form={form} plano={plano} />;
      case 8:
        return <PersonalizacaoAvancadaStep form={form} plano={plano} />;
      case 9:
        return <ResumoFinalStep form={form} />;
      default:
        return null;
    }
  };

  return <>{renderStepContent()}</>;
}
