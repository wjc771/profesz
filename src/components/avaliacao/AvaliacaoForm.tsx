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
import { ModelosCompeticaoStep } from "./steps/ModelosCompeticaoStep";
import { QuestoesStep } from "./steps/QuestoesStep";
import { PersonalizacaoStep } from "./steps/PersonalizacaoStep";
import { DistribuicaoStep } from "./steps/DistribuicaoStep";
import { ResumoFinalAvaliacaoStep } from "./steps/ResumoFinalAvaliacaoStep";
import { AvaliacaoFormStepper } from "./AvaliacaoFormStepper";

const avaliacaoFormSchema = z.object({
  // Configuração Inicial
  tipoAvaliacao: z.string().min(1, "Selecione um tipo de avaliação"),
  objetivoAvaliacao: z.string().min(1, "Selecione um objetivo"),
  modeloCriacao: z.string().min(1, "Selecione um modelo de criação"),
  
  // Estrutura Curricular
  materia: z.string().min(1, "Selecione uma matéria"),
  unidade: z.string().min(1, "Selecione uma unidade"),
  capitulos: z.array(z.string()).min(1, "Selecione pelo menos um capítulo"),
  temas: z.array(z.string()).min(1, "Selecione pelo menos um tema"),
  incluirBncc: z.boolean().optional(),
  
  // Configuração das Questões
  numeroQuestoes: z.number().min(1, "Mínimo de 1 questão").max(20, "Máximo de 20 questões"),
  tipoQuestoes: z.string().min(1, "Selecione um tipo de questão"),
  proporcaoMultiplaEscolha: z.number().min(0).max(100).optional(),
  nivelDificuldade: z.number().min(0).max(10),
  
  // Opções Adicionais
  incluirFormulas: z.boolean().optional(),
  incluirImagens: z.boolean().optional(),
  incluirTabelas: z.boolean().optional(),
  incluirContexto: z.boolean().optional(),
  incluirInterdisciplinar: z.boolean().optional(),
  permitirCalculadora: z.boolean().optional(),
  incluirGabarito: z.boolean().optional(),
  questoesAdaptativas: z.boolean().optional(),
  
  // Personalização Avançada
  estiloQuestoes: z.string().optional(),
  formatoApresentacao: z.string().optional(),
  // Visual avançado
  logo: z.string().optional(),
  cabecalhoPersonalizado: z.string().optional(),
  rodapePersonalizado: z.string().optional(),
  estiloFonte: z.string().optional(),
  // Tempo
  duracaoSugerida: z.number().optional(),
  tempoPorQuestao: z.number().optional(),
  incluirCronometro: z.boolean().optional(),
  
  // Modelos de Competição
  tipoCompeticao: z.string().optional(),
  modelosCompeticao: z.array(z.string()).optional(),
  
  // Distribuição
  formatoSaida: z.array(z.string()).min(1, "Selecione pelo menos um formato"),
  opcaoCompartilhamento: z.array(z.string()).optional(),
});

type AvaliacaoFormValues = z.infer<typeof avaliacaoFormSchema>;

const defaultValues: Partial<AvaliacaoFormValues> = {
  tipoAvaliacao: "",
  objetivoAvaliacao: "",
  modeloCriacao: "zero",
  materia: "",
  unidade: "",
  capitulos: [],
  temas: [],
  incluirBncc: false,
  numeroQuestoes: 10,
  tipoQuestoes: "multipla",
  proporcaoMultiplaEscolha: 100,
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
  const totalSteps = 7;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<AvaliacaoFormValues>({
    resolver: zodResolver(avaliacaoFormSchema),
    defaultValues,
    mode: "onChange",
  });
  
  const handleNextStep = async () => {
    const currentFields = getCurrentStepFields() as Array<keyof AvaliacaoFormValues>;
    const isValidStep = await form.trigger(currentFields);

    if (isValidStep && step < totalSteps) {
      setStep(step + 1);
    } else if (!isValidStep) {
      console.log("Validation failed for step:", step, "Fields:", currentFields);
      // Optionally, show a toast message for failed validation
      // toast({
      //   title: "Campos inválidos",
      //   description: "Por favor, corrija os campos destacados antes de prosseguir.",
      //   variant: "destructive",
      // });
    }
  };

  const nextStep = () => { // This function seems to be unused after the change, but let's keep it for now.
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const currentStepIsValid = () => {
    const currentFields = getCurrentStepFields();
    
    if (currentFields.length === 0) {
      return true;
    }
    
    console.log("Current step:", step);
    console.log("Current fields:", currentFields);
    console.log("Form values:", form.getValues());
    console.log("Form errors:", form.formState.errors);
    
    // Check required fields based on the step
    return currentFields.every((field) => {
      const fieldState = form.getFieldState(field as any);
      const value = form.getValues(field as any);
      
      // Skip validation for optional fields
      if (isOptionalField(field)) {
        return true;
      }
      
      // Check for errors
      if (fieldState.error) {
        console.log(`Field ${field} has error:`, fieldState.error);
        return false;
      }
      
      // Check if field is empty
      if (isEmptyValue(value)) {
        console.log(`Field ${field} is empty`);
        return false;
      }
      
      return true;
    });
  };
  
  const isOptionalField = (field: string) => {
    const optionalFields = [
      'incluirBncc', 'proporcaoMultiplaEscolha', 
      'incluirFormulas', 'incluirImagens', 'incluirTabelas', 
      'incluirContexto', 'incluirInterdisciplinar', 'permitirCalculadora', 
      'incluirGabarito', 'questoesAdaptativas', 'estiloQuestoes',
      'formatoApresentacao', 'logo', 'cabecalhoPersonalizado',
      'rodapePersonalizado', 'estiloFonte', 'duracaoSugerida',
      'tempoPorQuestao', 'incluirCronometro', 'opcaoCompartilhamento',
      'tipoCompeticao', 'modelosCompeticao'
    ];
    
    return optionalFields.includes(field);
  };
  
  const isEmptyValue = (value: any) => {
    if (value === undefined || value === null) {
      return true;
    }
    
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    
    if (typeof value === 'string') {
      return value.trim() === '';
    }
    
    return false;
  };

  const getCurrentStepFields = () => {
    switch (step) {
      case 1: // Configuração Inicial
        return ['tipoAvaliacao', 'objetivoAvaliacao', 'modeloCriacao'];
      case 2: // Estrutura Curricular
        return ['materia', 'unidade', 'capitulos', 'temas', 'incluirBncc'];
      case 3: // Modelos de Competição
        return ['tipoCompeticao', 'modelosCompeticao'];
      case 4: // Configuração das Questões
        return [
          'numeroQuestoes', 'tipoQuestoes', 'proporcaoMultiplaEscolha', 
          'nivelDificuldade', 'incluirFormulas', 'incluirImagens', 
          'incluirTabelas', 'incluirContexto', 'incluirInterdisciplinar', 
          'permitirCalculadora', 'incluirGabarito', 'questoesAdaptativas'
        ];
      case 5: // Personalização Avançada
        return [
          'estiloQuestoes', 'formatoApresentacao', 'logo', 
          'cabecalhoPersonalizado', 'rodapePersonalizado', 'estiloFonte',
          'duracaoSugerida', 'tempoPorQuestao', 'incluirCronometro'
        ];
      case 6: // Distribuição
        return ['formatoSaida', 'opcaoCompartilhamento'];
      case 7: // Resumo Final
        return [];
      default:
        return [];
    }
  };
  
  const onSubmit = async (values: AvaliacaoFormValues) => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      // Check if user has reached their limit
      if (usageLimit !== null && usageCount >= usageLimit) {
        toast({
          variant: "destructive",
          title: "Limite de questões atingido",
          description: "Você atingiu seu limite mensal de questões. Considere atualizar seu plano.",
        });
        return;
      }
      
      // Create a structured data object for the evaluation
      const avaliacaoData = {
        tipo: values.tipoAvaliacao,
        objetivo: values.objetivoAvaliacao,
        configuracao: {
          materia: values.materia,
          unidade: values.unidade,
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
      
      // Call the API to generate the evaluation
      // This is a placeholder for the actual API call
      // TODO: Replace with actual API call to generate questions
      
      // Log the activity
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
        return <ModelosCompeticaoStep form={form} plano={plano} />;
      case 4:
        return <QuestoesStep form={form} plano={plano} usageLimit={usageLimit} />;
      case 5:
        return <PersonalizacaoStep form={form} plano={plano} />;
      case 6:
        return <DistribuicaoStep form={form} plano={plano} />;
      case 7:
        return <ResumoFinalAvaliacaoStep form={form} />;
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
            canAdvance={currentStepIsValid()}
            isLastStep={step === totalSteps}
          />
        </form>
      </Form>
    </div>
  );
}
