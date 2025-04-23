import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlanoFormStepper } from "./PlanoFormStepper";
import { PlanoFormHeader } from "./PlanoFormHeader";
import { InfoStep } from "./steps/InfoStep";
import { ObjetivosStep } from "./steps/ObjetivosStep";
import { ConteudoStep } from "./steps/ConteudoStep";
import { EstruturaStep } from "./steps/EstruturaStep";
import { AvaliacaoStep } from "./steps/AvaliacaoStep";
import { RecursosStep } from "./steps/RecursosStep";
import { SubscriptionPlanType } from "@/types/profile";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { incrementUserActivity } from "@/integrations/supabase/rpc";

const planoFormSchema = z.object({
  titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  disciplina: z.string().min(1, "Selecione uma disciplina"),
  nivelEnsino: z.string().min(1, "Selecione um nível de ensino"),
  anoSerie: z.string().min(1, "Selecione o ano/série"),
  duracao: z.string().min(1, "Informe a duração da aula"),
  
  objetivosAprendizagem: z.string().min(10, "Defina os objetivos de aprendizagem"),
  habilidadesBncc: z.array(z.string()).optional(),
  
  temaCentral: z.string().min(3, "Informe o tema central"),
  topicos: z.string().min(10, "Liste os tópicos a serem abordados"),
  abordagemPedagogica: z.string().min(1, "Selecione uma abordagem pedagógica"),
  
  introducao: z.string().min(10, "Descreva a introdução da aula"),
  desenvolvimento: z.string().min(20, "Descreva o desenvolvimento da aula"),
  fechamento: z.string().min(10, "Descreva o fechamento da aula"),
  diferenciacaoAlunos: z.string().optional(),
  
  metodoAvaliacao: z.string().min(1, "Selecione um método de avaliação"),
  atividadesSala: z.string().min(10, "Descreva as atividades em sala"),
  atividadesCasa: z.string().optional(),
  rubricas: z.string().optional(),
  
  recursos: z.string().min(5, "Liste os recursos necessários"),
  materiaisComplementares: z.array(z.string()).optional(),
});

type PlanoFormValues = z.infer<typeof planoFormSchema>;

const defaultValues: Partial<PlanoFormValues> = {
  topicos: "",
  habilidadesBncc: [],
  diferenciacaoAlunos: "",
  atividadesCasa: "",
  rubricas: "",
  materiaisComplementares: [],
};

interface PlanoDeAulaFormProps {
  plano: SubscriptionPlanType;
  usageCount: number;
  usageLimit: number | null;
}

export function PlanoDeAulaForm({ plano, usageCount, usageLimit }: PlanoDeAulaFormProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 6; // Total number of steps in the form
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<PlanoFormValues>({
    resolver: zodResolver(planoFormSchema),
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
  
  const currentStepIsValid = () => {
    const currentFields = getCurrentStepFields();
    
    if (currentFields.length === 0) {
      return true;
    }

    console.log("Current step:", step);
    console.log("Current fields:", currentFields);
    console.log("Form values:", form.getValues());
    console.log("Form errors:", form.formState.errors);
    
    return currentFields.every((field) => {
      const fieldState = form.getFieldState(field as any);
      const value = form.getValues(field as any);
      
      if (field === 'diferenciacaoAlunos' || 
          field === 'atividadesCasa' || 
          field === 'rubricas' || 
          field === 'habilidadesBncc' ||
          field === 'materiaisComplementares') {
        return true;
      }
      
      if (fieldState.error) {
        console.log(`Field ${field} has error:`, fieldState.error);
        return false;
      }
      
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        console.log(`Field ${field} is empty`);
        return false;
      }
      
      return true;
    });
  };

  const getCurrentStepFields = () => {
    switch (step) {
      case 1:
        return ['titulo', 'disciplina', 'nivelEnsino', 'anoSerie', 'duracao'];
      case 2:
        return ['objetivosAprendizagem', 'habilidadesBncc'];
      case 3:
        return ['temaCentral', 'topicos', 'abordagemPedagogica'];
      case 4:
        return ['introducao', 'desenvolvimento', 'fechamento', 'diferenciacaoAlunos'];
      case 5:
        return ['metodoAvaliacao', 'atividadesSala', 'atividadesCasa', 'rubricas'];
      case 6:
        return ['recursos', 'materiaisComplementares'];
      default:
        return [];
    }
  };
  
  const onSubmit = async (values: PlanoFormValues) => {
    try {
      const planoContent = {
        info: {
          titulo: values.titulo,
          disciplina: values.disciplina,
          nivelEnsino: values.nivelEnsino,
          anoSerie: values.anoSerie,
          duracao: values.duracao,
        },
        objetivos: {
          objetivosAprendizagem: values.objetivosAprendizagem,
          habilidadesBncc: values.habilidadesBncc || [],
        },
        conteudo: {
          temaCentral: values.temaCentral,
          topicos: values.topicos,
          abordagemPedagogica: values.abordagemPedagogica,
        },
        estrutura: {
          introducao: values.introducao,
          desenvolvimento: values.desenvolvimento,
          fechamento: values.fechamento,
          diferenciacaoAlunos: values.diferenciacaoAlunos || "",
        },
        avaliacao: {
          metodoAvaliacao: values.metodoAvaliacao,
          atividadesSala: values.atividadesSala,
          atividadesCasa: values.atividadesCasa || "",
          rubricas: values.rubricas || "",
        },
        recursos: {
          recursos: values.recursos,
          materiaisComplementares: values.materiaisComplementares || [],
        }
      };
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { data, error } = await supabase
        .from('lesson_plans')
        .insert({
          title: values.titulo,
          subject: values.disciplina,
          grade_level: values.nivelEnsino,
          description: values.temaCentral,
          content: planoContent,
          user_id: user.id,
          is_public: false,
        });
        
      if (error) {
        throw error;
      }
      
      const { error: activityError } = await incrementUserActivity(user.id, 'planos_de_aula');
      
      if (activityError) {
        console.error('Error updating activity count:', activityError);
      }
      
      toast({
        title: "Plano de aula criado com sucesso!",
        description: "Seu plano foi salvo e está disponível na sua biblioteca.",
      });
      
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error('Error saving lesson plan:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao criar plano de aula",
        description: error.message || "Ocorreu um erro ao salvar seu plano de aula. Tente novamente.",
      });
    }
  };
  
  const renderStepContent = () => {
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
      default:
        return null;
    }
  };
  
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
            {renderStepContent()}
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
