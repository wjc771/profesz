
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEstruturaStepLogic } from "./hooks/useEstruturaStepLogic";
import { ValidationStatus } from "./components/ValidationStatus";
import { AreaSelector } from "./components/AreaSelector";
import { ComponenteSelector } from "./components/ComponenteSelector";
import { AnoEscolarSelector } from "./components/AnoEscolarSelector";
import { UnidadeTematicaSelector } from "./components/UnidadeTematicaSelector";
import { ObjetoConhecimentoSelector } from "./components/ObjetoConhecimentoSelector";
import { BnccAlignmentOption } from "./components/BnccAlignmentOption";

interface EstruturaStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function EstruturaStep({ form, plano }: EstruturaStepProps) {
  const {
    areas,
    componentesFiltrados,
    anosEscolaresFiltrados,
    unidadesTematicas,
    objetosConhecimento,
    loading,
    preferences,
    selectedArea,
    selectedComponente,
    selectedAno,
    selectedUnidades,
    selectedTemas,
    materia,
    capitulos,
    temas,
    handleAreaChange,
    handleComponenteChange,
    handleAnoChange,
    handleUnidadeToggle,
    handleTemaToggle
  } = useEstruturaStepLogic(form);

  // Verificar se há objetos de conhecimento disponíveis
  const hasObjetosConhecimento = objetosConhecimento.length > 0;
  const hasSelectedUnidades = selectedUnidades.length > 0;

  return (
    <TooltipProvider>
      <>
        <CardHeader>
          <CardTitle>Estrutura Curricular</CardTitle>
          <CardDescription>
            Selecione os componentes curriculares baseados no seu perfil e na BNCC
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ValidationStatus
            plano={plano}
            materia={materia}
            capitulos={capitulos}
            temas={temas}
            hasObjetosConhecimento={hasObjetosConhecimento}
          />

          <AreaSelector
            form={form}
            areas={areas}
            selectedArea={selectedArea}
            onAreaChange={handleAreaChange}
          />

          <ComponenteSelector
            form={form}
            componentes={componentesFiltrados}
            selectedComponente={selectedComponente}
            selectedArea={selectedArea}
            hasSubjectsInProfile={!!preferences?.subjects?.length}
            onComponenteChange={handleComponenteChange}
          />

          <AnoEscolarSelector
            form={form}
            anosEscolares={anosEscolaresFiltrados}
            selectedAno={selectedAno}
            hasGradeLevelInProfile={!!preferences?.grade_level}
            onAnoChange={handleAnoChange}
          />

          <UnidadeTematicaSelector
            form={form}
            unidadesTematicas={unidadesTematicas}
            selectedUnidades={selectedUnidades}
            loading={loading}
            onUnidadeToggle={handleUnidadeToggle}
          />

          {hasSelectedUnidades && !hasObjetosConhecimento && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Os objetos de conhecimento para as unidades selecionadas ainda não estão disponíveis no sistema. 
                Você pode prosseguir com apenas as unidades temáticas selecionadas.
              </AlertDescription>
            </Alert>
          )}

          <ObjetoConhecimentoSelector
            form={form}
            objetosConhecimento={objetosConhecimento}
            selectedTemas={selectedTemas}
            loading={loading}
            onTemaToggle={handleTemaToggle}
          />

          <BnccAlignmentOption form={form} plano={plano} />
        </CardContent>
      </>
    </TooltipProvider>
  );
}
