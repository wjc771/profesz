
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AvaliacaoFormHeader } from "./AvaliacaoFormHeader";
import { SubscriptionPlanType } from "@/types/profile";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { incrementUserActivity } from "@/integrations/supabase/rpc";
import { ConfiguracaoStep } from "./steps/ConfiguracaoStep";
import { EstruturaStep } from "./steps/EstruturaStep";
import { QuestoesStep } from "./steps/QuestoesStep";
import { PersonalizacaoStep } from "./steps/PersonalizacaoStep";
import { ModelosCompeticaoStep } from "./steps/ModelosCompeticaoStep";
import { DistribuicaoStep } from "./steps/DistribuicaoStep";
import { ResumoFinalAvaliacaoStep } from "./steps/ResumoFinalAvaliacaoStep";
import { AvaliacaoFormStepper } from "./AvaliacaoFormStepper";

// Schema simplificado e reestruturado
const avaliacaoFormSchema = z.object({
  // Step 1: Configuração Básica
  tipoAvaliacao: z.string().min(1, "Selecione um tipo de avaliação"),
  objetivoAvaliacao: z.string().min(1, "Selecione um objetivo"),
  
  // Step 2: Estrutura Curricular
  area: z.string().optional(),
  materia: z.string().min(1, "Selecione uma matéria"),
  anoEscolar: z.string().optional(),
  unidade: z.string().optional(),
  capitulos: z.array(z.string()).min(1, "Selecione pelo menos uma unidade temática"),
  temas: z.array(z.string()).min(1, "Selecione pelo menos um objeto de conhecimento"),
  incluirBncc: z.boolean().optional(),
  
  // Step 3: Configuração das Questões
  numeroQuestoes: z.number().min(1, "Mínimo de 1 questão").max(50, "Máximo de 50 questões"),
  tipoQuestoes: z.string().min(1, "Selecione um tipo de questão"),
  proporcaoMultiplaEscolha: z.number().min(0).max(100).optional(),
  nivelDificuldade: z.number().min(1).max(10),
  
  // Opções das questões
  incluirFormulas: z.boolean().optional(),
  incluirImagens: z.boolean().optional(),
  incluirTabelas: z.boolean().optional(),
  incluirContexto: z.boolean().optional(),
  incluirInterdisciplinar: z.boolean().optional(),
  permitirCalculadora: z.boolean().optional(),
  incluirGabarito: z.boolean().optional(),
  questoesAdaptativas: z.boolean().optional(),
  
  // Step 4: Personalização Avançada
  estiloQuestoes: z.string().optional(),
  formatoApresentacao: z.string().optional(),
  duracaoSugerida: z.number().optional(),
  tempoPorQuestao: z.number().optional(),
  incluirCronometro: z.boolean().optional(),
  logo: z.string().optional(),
  cabecalhoPersonalizado: z.string().optional(),
  rodapePersonalizado: z.string().optional(),
  estiloFonte: z.string().optional(),
  
  // Step 5: Modelos de Competição
  tipoCompeticao: z.string().optional(),
  modelosCompeticao: z.array(z.string()).optional(),
  
  // Step 6: Distribuição
  formatoSaida: z.array(z.string()).min(1, "Selecione pelo menos um formato"),
  opcaoCompartilhamento: z.array(z.string()).optional(),
});

type AvaliacaoFormValues = z.infer<typeof avaliacaoFormSchema>;

const defaultValues: Partial<AvaliacaoFormValues> = {
  tipoAvaliacao: "",
  objetivoAvaliacao: "",
  materia: "",
  capitulos: [],
  temas: [],
  incluirBncc: false,
  numeroQuestoes: 10,
  tipoQuestoes: "",
  proporcaoMultiplaEscolha: 50,
  nivelDificuldade: 5,
  incluirFormulas: false,
  incluirImagens: false,
  incluirTabelas: false,
  incluirContexto: false,
  incluirInterdisciplinar: false,
  permitirCalculadora: false,
  incluirGabarito: false,
  questoesAdaptativas: false,
  estiloQuestoes: "conceitual",
  formatoApresentacao: "padrao",
  duracaoSugerida: 60,
  tempoPorQuestao: 3,
  incluirCronometro: false,
  tipoCompeticao: "",
  modelosCompeticao: [],
  formatoSaida: ["pdf"],
  opcaoCompartilhamento: [],
};

interface AvaliacaoFormProps {
  plano: SubscriptionPlanType;
  usageCount: number;
  usageLimit: number | null;
}

export function AvaliacaoForm({ plano, usageCount, usageLimit }: AvaliacaoFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 6; // Reduzido de 7 para 6 steps
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<AvaliacaoFormValues>({
    resolver: zodResolver(avaliacaoFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const validateStep = (stepNumber: number): boolean => {
    const values = form.getValues();
    
    console.log("Validating step", stepNumber, "with values:", values);
    
    switch (stepNumber) {
      case 1:
        const step1Valid = !!(values.tipoAvaliacao && values.objetivoAvaliacao);
        console.log("Step 1 validation:", step1Valid, { tipoAvaliacao: values.tipoAvaliacao, objetivoAvaliacao: values.objetivoAvaliacao });
        return step1Valid;
      case 2:
        // Validação mais flexível: requer matéria e pelo menos uma unidade temática
        // Temas são opcionais se não houver objetos de conhecimento disponíveis
        const step2Valid = !!(values.materia && values.capitulos?.length > 0);
        console.log("Step 2 validation (flexible):", step2Valid, { 
          materia: values.materia, 
          capitulos: values.capitulos?.length, 
          temas: values.temas?.length 
        });
        return step2Valid;
      case 3:
        const step3Valid = !!(values.numeroQuestoes && values.numeroQuestoes > 0 && values.tipoQuestoes);
        console.log("Step 3 validation:", step3Valid, { numeroQuestoes: values.numeroQuestoes, tipoQuestoes: values.tipoQuestoes });
        return step3Valid;
      case 4:
      case 5:
        return true; // Steps opcionais
      case 6:
        const step6Valid = !!(values.formatoSaida?.length > 0);
        console.log("Step 6 validation:", step6Valid, { formatoSaida: values.formatoSaida?.length });
        return step6Valid;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    const isValid = validateStep(step);
    
    console.log("HandleNextStep - Step:", step, "IsValid:", isValid);
    
    if (!isValid) {
      let errorMessage = '';
      
      switch (step) {
        case 1:
          errorMessage = 'Preencha o tipo e objetivo da avaliação';
          break;
        case 2:
          errorMessage = 'Selecione a matéria e pelo menos uma unidade temática';
          break;
        case 3:
          errorMessage = 'Configure o número e tipo de questões';
          break;
        case 6:
          errorMessage = 'Selecione pelo menos um formato de saída';
          break;
        default:
          errorMessage = 'Preencha os campos obrigatórios';
      }
      
      toast({
        title: "Campos obrigatórios",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    nextStep();
  };
  
  const onSubmit = async (values: AvaliacaoFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      if (usageLimit !== null && usageCount >= usageLimit) {
        toast({
          variant: "destructive",
          title: "Limite de avaliações atingido",
          description: "Você atingiu seu limite mensal de avaliações. Considere atualizar seu plano.",
        });
        return;
      }
      
      const avaliacaoData = {
        tipo: values.tipoAvaliacao,
        objetivo: values.objetivoAvaliacao,
        configuracao: {
          materia: values.materia,
          capitulos: values.capitulos,
          temas: values.temas,
          incluirBncc: values.incluirBncc,
          numeroQuestoes: values.numeroQuestoes,
          tipoQuestoes: values.tipoQuestoes,
          proporcaoMultiplaEscolha: values.proporcaoMultiplaEscolha,
          nivelDificuldade: values.nivelDificuldade,
          opcoesAdicionais: {
            incluirFormulas: values.incluirFormulas,
            incluirImagens: values.incluirImagens,
            incluirTabelas: values.incluirTabelas,
            incluirContexto: values.incluirContexto,
            incluirInterdisciplinar: values.incluirInterdisciplinar,
            permitirCalculadora: values.permitirCalculadora,
            incluirGabarito: values.incluirGabarito,
            questoesAdaptativas: values.questoesAdaptativas,
          }
        },
        personalizacao: {
          estiloQuestoes: values.estiloQuestoes,
          formatoApresentacao: values.formatoApresentacao,
          visual: {
            logo: values.logo,
            cabecalho: values.cabecalhoPersonalizado,
            rodape: values.rodapePersonalizado,
            estiloFonte: values.estiloFonte,
          },
          tempo: {
            duracaoSugerida: values.duracaoSugerida,
            tempoPorQuestao: values.tempoPorQuestao,
            incluirCronometro: values.incluirCronometro,
          }
        },
        modelosCompeticao: {
          tipo: values.tipoCompeticao,
          modelos: values.modelosCompeticao,
        },
        distribuicao: {
          formatoSaida: values.formatoSaida,
          opcaoCompartilhamento: values.opcaoCompartilhamento,
        }
      };
      
      const { error: activityError } = await incrementUserActivity(user.id, 'avaliacoes');
      
      if (activityError) {
        console.error('Error updating activity count:', activityError);
      }
      
      toast({
        title: "Avaliação gerada com sucesso!",
        description: `${values.numeroQuestoes} questões foram geradas conforme suas especificações.`,
      });
      
      navigate('/dashboard/avaliacoes');
      
    } catch (error: any) {
      console.error('Error generating evaluation:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao gerar avaliação",
        description: error.message || "Ocorreu um erro ao gerar sua avaliação. Tente novamente.",
      });
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <ConfiguracaoStep form={form} plano={plano} />;
      case 2:
        return <EstruturaStep form={form} plano={plano} />;
      case 3:
        return <QuestoesStep form={form} plano={plano} usageLimit={usageLimit} />;
      case 4:
        return <PersonalizacaoStep form={form} plano={plano} />;
      case 5:
        return <ModelosCompeticaoStep form={form} plano={plano} />;
      case 6:
        return <DistribuicaoStep form={form} plano={plano} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <AvaliacaoFormHeader 
        plano={plano}
        usageCount={usageCount}
        usageLimit={usageLimit}
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="overflow-hidden">
            {renderStepContent()}
          </Card>
          
          <AvaliacaoFormStepper
            currentStep={step}
            totalSteps={totalSteps}
            onBack={prevStep}
            onNext={step === totalSteps ? form.handleSubmit(onSubmit) : handleNextStep}
            canAdvance={validateStep(step)}
            isLastStep={step === totalSteps}
          />
        </form>
      </Form>
    </div>
  );
}
