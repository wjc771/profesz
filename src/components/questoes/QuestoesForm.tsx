
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SubscriptionPlanType } from "@/types/profile";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { incrementUserActivity } from "@/integrations/supabase/rpc";
import { QuestoesFormHeader } from "./QuestoesFormHeader";
import { QuestoesFormStepper } from "./QuestoesFormStepper";
import { QuestoesStep } from "./steps/QuestoesStep";
import { EstruturaStep } from "@/components/avaliacao/steps/EstruturaStep";
import { ConfiguracaoStep } from "@/components/avaliacao/steps/ConfiguracaoStep";

const questoesFormSchema = z.object({
  tipoAvaliacao: z.string().min(1, "Selecione um tipo de avaliação"),
  objetivoAvaliacao: z.string().min(1, "Selecione um objetivo"),
  modeloCriacao: z.string().min(1, "Selecione um modelo de criação"),
  
  materia: z.string().min(1, "Selecione uma matéria"),
  unidade: z.string().min(1, "Selecione uma unidade"),
  capitulos: z.array(z.string()).min(1, "Selecione pelo menos um capítulo"),
  temas: z.array(z.string()).min(1, "Selecione pelo menos um tema"),
  incluirBncc: z.boolean().optional(),
  modelosVestibular: z.array(z.object({
    nome: z.string(),
    quantidade: z.number().min(0).max(20)
  })).optional(),
  
  numeroQuestoes: z.number().min(1, "Mínimo de 1 questão").max(20, "Máximo de 20 questões"),
  tipoQuestoes: z.string().min(1, "Selecione um tipo de questão"),
  proporcaoMultiplaEscolha: z.number().min(0).max(100).optional(),
  nivelDificuldade: z.number().min(0).max(10),
  
  incluirFormulas: z.boolean().optional(),
  incluirImagens: z.boolean().optional(),
  incluirTabelas: z.boolean().optional(),
  incluirContexto: z.boolean().optional(),
  incluirInterdisciplinar: z.boolean().optional(),
  permitirCalculadora: z.boolean().optional(),
  incluirGabarito: z.boolean().optional(),
  questoesAdaptativas: z.boolean().optional(),
});

type QuestoesFormValues = z.infer<typeof questoesFormSchema>;

const defaultValues: Partial<QuestoesFormValues> = {
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
};

interface QuestoesFormProps {
  plano: SubscriptionPlanType;
  usageCount: number;
  usageLimit: number | null;
}

export function QuestoesForm({ plano, usageCount, usageLimit }: QuestoesFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<QuestoesFormValues>({
    resolver: zodResolver(questoesFormSchema),
    defaultValues: {
      ...defaultValues,
      modelosVestibular: [
        { nome: "ENEM", quantidade: 0 },
        { nome: "USP", quantidade: 0 },
        { nome: "UNICAMP", quantidade: 0 },
        { nome: "ITA", quantidade: 0 },
        { nome: "FGV", quantidade: 0 }
      ]
    },
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
  
  const currentStepIsValid = () => {
    const currentFields = getCurrentStepFields();
    
    if (currentFields.length === 0) {
      return true;
    }
    
    return currentFields.every((field) => {
      const fieldState = form.getFieldState(field as any);
      const value = form.getValues(field as any);
      
      if (isOptionalField(field)) {
        return true;
      }
      
      if (fieldState.error) {
        return false;
      }
      
      if (isEmptyValue(value)) {
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
      'incluirGabarito', 'questoesAdaptativas'
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
      case 1:
        return ['tipoAvaliacao', 'objetivoAvaliacao', 'modeloCriacao'];
      case 2:
        return ['materia', 'unidade', 'capitulos', 'temas', 'incluirBncc'];
      case 3:
        return [
          'numeroQuestoes', 'tipoQuestoes', 'proporcaoMultiplaEscolha', 
          'nivelDificuldade', 'incluirFormulas', 'incluirImagens', 
          'incluirTabelas', 'incluirContexto', 'incluirInterdisciplinar', 
          'permitirCalculadora', 'incluirGabarito', 'questoesAdaptativas'
        ];
      default:
        return [];
    }
  };
  
  const onSubmit = async (values: QuestoesFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      if (usageLimit !== null && usageCount >= usageLimit) {
        toast({
          variant: "destructive",
          title: "Limite de questões atingido",
          description: "Você atingiu seu limite mensal de questões. Considere atualizar seu plano.",
        });
        return;
      }
      
      const questoesData = {
        tipo: values.tipoAvaliacao,
        objetivo: values.objetivoAvaliacao,
        configuracao: {
          materia: values.materia,
          unidade: values.unidade,
          capitulos: values.capitulos,
          temas: values.temas,
          incluirBncc: values.incluirBncc,
          modelosVestibular: values.modelosVestibular,
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
        }
      };
      
      const { error: activityError } = await incrementUserActivity(user.id, 'questoes');
      
      if (activityError) {
        console.error('Error updating activity count:', activityError);
      }
      
      toast({
        title: "Questões geradas com sucesso!",
        description: `${values.numeroQuestoes} questões foram geradas conforme suas especificações.`,
      });
      
      // Corrigido o caminho da rota para /questoes ao invés de /dashboard/questoes
      navigate('/questoes');
      
    } catch (error: any) {
      console.error('Error generating questions:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao gerar questões",
        description: error.message || "Ocorreu um erro ao gerar suas questões. Tente novamente.",
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
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <QuestoesFormHeader 
        plano={plano}
        usageCount={usageCount}
        usageLimit={usageLimit}
      />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {renderStepContent()}
          
          <QuestoesFormStepper
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
