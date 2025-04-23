import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SubscriptionPlanType } from "@/types/profile";
import { PlanoFormHeader } from "./PlanoFormHeader";
import { PlanoFormStepper } from "./PlanoFormStepper";
import { InfoStep } from "./steps/InfoStep";
import { ObjetivosStep } from "./steps/ObjetivosStep";
import { ConteudoStep } from "./steps/ConteudoStep";
import { EstruturaStep } from "./steps/EstruturaStep";
import { AvaliacaoStep } from "./steps/AvaliacaoStep";
import { RecursosStep } from "./steps/RecursosStep";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  titulo: z.string().min(3, { message: "Título deve ter pelo menos 3 caracteres" }),
  disciplina: z.string().min(2, { message: "Selecione uma disciplina" }),
  nivelEnsino: z.string().min(2, { message: "Selecione um nível de ensino" }),
  serieAno: z.string().min(1, { message: "Selecione uma série/ano" }),
  duracaoAula: z.string().min(1, { message: "Informe a duração da aula" }),
  
  objetivos: z.array(z.string()).min(1, { message: "Adicione pelo menos um objetivo" }),
  habilidadesBNCC: z.array(z.string()).optional(),
  
  tema: z.string().min(3, { message: "Informe o tema central" }),
  topicos: z.array(z.string()).min(1, { message: "Adicione pelo menos um tópico" }),
  abordagem: z.string().min(2, { message: "Selecione uma abordagem pedagógica" }),
  recursos: z.array(z.string()).min(1, { message: "Adicione pelo menos um recurso" }),
  
  introducao: z.string().min(10, { message: "Descreva a introdução da aula" }),
  desenvolvimento: z.string().min(10, { message: "Descreva o desenvolvimento da aula" }),
  fechamento: z.string().min(10, { message: "Descreva o fechamento da aula" }),
  diferenciacaoAlunos: z.string().optional(),
  
  metodoAvaliacao: z.string().min(2, { message: "Selecione um método de avaliação" }),
  atividadesSala: z.string().min(10, { message: "Descreva as atividades em sala" }),
  atividadesCasa: z.string().optional(),
  rubricas: z.string().optional(),
  
  materiaisComplementares: z.array(z.string()).optional(),
});

type PlanoFormValues = z.infer<typeof formSchema>;

interface PlanoDeAulaFormProps {
  plano: SubscriptionPlanType;
  usageCount: number;
  usageLimit: number;
}

export function PlanoDeAulaForm({ plano, usageCount, usageLimit }: PlanoDeAulaFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const totalSteps = 6;
  
  const form = useForm<PlanoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      disciplina: "",
      nivelEnsino: "",
      serieAno: "",
      duracaoAula: "50",
      objetivos: [],
      habilidadesBNCC: [],
      tema: "",
      topicos: [],
      abordagem: "",
      recursos: [],
      introducao: "",
      desenvolvimento: "",
      fechamento: "",
      diferenciacaoAlunos: "",
      metodoAvaliacao: "",
      atividadesSala: "",
      atividadesCasa: "",
      rubricas: "",
      materiaisComplementares: [],
    },
  });
  
  const currentStepIsValid = () => {
    switch (step) {
      case 1:
        return form.getValues("titulo") && 
               form.getValues("disciplina") && 
               form.getValues("nivelEnsino") && 
               form.getValues("serieAno") && 
               form.getValues("duracaoAula");
      case 2:
        return form.getValues("objetivos").length > 0;
      case 3:
        return form.getValues("tema") && 
               form.getValues("topicos").length > 0 && 
               form.getValues("abordagem") && 
               form.getValues("recursos").length > 0;
      case 4:
        return form.getValues("introducao") && 
               form.getValues("desenvolvimento") && 
               form.getValues("fechamento");
      case 5:
        return form.getValues("metodoAvaliacao") && 
               form.getValues("atividadesSala");
      case 6:
        return true; // Optional step
      default:
        return false;
    }
  };
  
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
  
  const onSubmit = async (values: PlanoFormValues) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para criar um plano de aula",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const lessonPlanData = {
        title: values.titulo,
        description: values.tema,
        content: {
          disciplina: values.disciplina,
          nivelEnsino: values.nivelEnsino,
          serieAno: values.serieAno,
          duracaoAula: values.duracaoAula,
          objetivos: values.objetivos,
          habilidadesBNCC: values.habilidadesBNCC || [],
          tema: values.tema,
          topicos: values.topicos,
          abordagem: values.abordagem,
          recursos: values.recursos,
          estrutura: {
            introducao: values.introducao,
            desenvolvimento: values.desenvolvimento,
            fechamento: values.fechamento,
            diferenciacaoAlunos: values.diferenciacaoAlunos || "",
          },
          avaliacao: {
            metodo: values.metodoAvaliacao,
            atividadesSala: values.atividadesSala,
            atividadesCasa: values.atividadesCasa || "",
            rubricas: values.rubricas || "",
          },
          materiaisComplementares: values.materiaisComplementares || [],
        },
        subject: values.disciplina,
        grade_level: values.nivelEnsino,
        user_id: user.id,
        is_public: false,
      };
      
      const { data, error } = await supabase
        .from('lesson_plans')
        .insert(lessonPlanData)
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      const { data: activityData, error: activityError } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', user.id)
        .eq('activity_type', 'planos_de_aula')
        .single();
      
      if (activityError && activityError.code === 'PGRST116') {
        await supabase
          .from('user_activity')
          .insert({
            user_id: user.id,
            activity_type: 'planos_de_aula',
            activity_count: 1,
            last_activity_at: new Date().toISOString(),
          });
      } else if (!activityError) {
        await supabase
          .from('user_activity')
          .update({
            activity_count: activityData.activity_count + 1,
            last_activity_at: new Date().toISOString(),
          })
          .eq('id', activityData.id);
      }
      
      toast({
        title: "Plano de Aula Criado",
        description: "Seu plano de aula foi criado com sucesso!",
      });
      
      form.reset();
      setStep(1);
      
    } catch (error: any) {
      console.error('Error saving lesson plan:', error);
      toast({
        title: "Erro ao criar plano de aula",
        description: error.message || "Ocorreu um erro ao salvar seu plano de aula. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <PlanoFormHeader 
        plano={plano} 
        usageCount={usageCount} 
        usageLimit={usageLimit < 0 ? null : usageLimit} 
      />
      
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mb-6">
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            {isOpen ? 'Ocultar opções iniciais' : 'Mostrar opções iniciais'}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Opções Iniciais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium mb-2">Método de Criação</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start h-auto py-2">
                      <div className="text-left">
                        <div className="font-medium">Criar do zero</div>
                        <div className="text-xs text-muted-foreground">Começar com um formulário em branco</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-2" disabled={plano === "inicial"}>
                      <div className="text-left">
                        <div className="font-medium">Usar modelo</div>
                        <div className="text-xs text-muted-foreground">Comece com um modelo pré-existente</div>
                      </div>
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Contexto de Aplicação</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="justify-start h-auto py-2">
                      <div className="text-left">
                        <div className="font-medium">Classe Inteira</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-2" disabled={plano === "inicial"}>
                      <div className="text-left">
                        <div className="font-medium">Grupos</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto py-2" disabled={["inicial", "essencial"].includes(plano)}>
                      <div className="text-left">
                        <div className="font-medium">Aluno Individual</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="overflow-hidden">
            <Tabs value={`step-${step}`} className="w-full">
              <TabsContent value="step-1" className="m-0">
                <InfoStep form={form} plano={plano} />
              </TabsContent>
              
              <TabsContent value="step-2" className="m-0">
                <ObjetivosStep form={form} plano={plano} />
              </TabsContent>
              
              <TabsContent value="step-3" className="m-0">
                <ConteudoStep form={form} plano={plano} />
              </TabsContent>
              
              <TabsContent value="step-4" className="m-0">
                <EstruturaStep form={form} plano={plano} />
              </TabsContent>
              
              <TabsContent value="step-5" className="m-0">
                <AvaliacaoStep form={form} plano={plano} />
              </TabsContent>
              
              <TabsContent value="step-6" className="m-0">
                <RecursosStep form={form} plano={plano} />
              </TabsContent>
            </Tabs>
          </Card>
          
          {step === totalSteps && (
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar Plano de Aula"}
              </Button>
            </div>
          )}
        </form>
      </Form>
      
      <PlanoFormStepper
        currentStep={step}
        totalSteps={totalSteps}
        onBack={prevStep}
        onNext={step === totalSteps ? form.handleSubmit(onSubmit) : nextStep}
        canAdvance={currentStepIsValid()}
        isLastStep={step === totalSteps}
      />
    </div>
  );
}
