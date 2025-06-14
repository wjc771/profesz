
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
  
  tipoCompeticao: z.string().optional(),
  modelosCompeticao: z.array(z.string()).optional(),
  estrategiaCompeticao: z.string().optional(),
  cronogramaPreparacao: z.string().optional(),
  
  templatePersonalizado: z.string().optional(),
  linkSiteInstituicao: z.string().optional(),
  linkPortalAluno: z.string().optional(),
  linkBiblioteca: z.string().optional(),
  linkRecursosExtras: z.string().optional(),
  logo: z.string().optional(),
  cabecalhoPersonalizado: z.string().optional(),
  rodapePersonalizado: z.string().optional(),
});

export type PlanoFormValues = z.infer<typeof planoFormSchema>;

const defaultValues: Partial<PlanoFormValues> = {
  topicos: "",
  habilidadesBncc: [],
  diferenciacaoAlunos: "",
  atividadesCasa: "",
  rubricas: "",
  materiaisComplementares: [],
  tipoCompeticao: "",
  modelosCompeticao: [],
  estrategiaCompeticao: "",
  cronogramaPreparacao: "",
  templatePersonalizado: "moderno",
  linkSiteInstituicao: "",
  linkPortalAluno: "",
  linkBiblioteca: "",
  linkRecursosExtras: "",
  logo: "",
  cabecalhoPersonalizado: "",
  rodapePersonalizado: "",
};

export function usePlanoForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 9;
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
        },
        competicao: {
          tipoCompeticao: values.tipoCompeticao || "",
          modelosCompeticao: values.modelosCompeticao || [],
          estrategiaCompeticao: values.estrategiaCompeticao || "",
          cronogramaPreparacao: values.cronogramaPreparacao || "",
        },
        personalizacao: {
          templatePersonalizado: values.templatePersonalizado || "",
          links: {
            siteInstituicao: values.linkSiteInstituicao || "",
            portalAluno: values.linkPortalAluno || "",
            biblioteca: values.linkBiblioteca || "",
            recursosExtras: values.linkRecursosExtras || "",
          },
          visual: {
            logo: values.logo || "",
            cabecalho: values.cabecalhoPersonalizado || "",
            rodape: values.rodapePersonalizado || "",
          }
        }
      };
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Usuário não autenticado");
      }
      
      const { error } = await supabase
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
      
      navigate('/dashboard/planejamento');
      
    } catch (error: any) {
      console.error('Error saving lesson plan:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao criar plano de aula",
        description: error.message || "Ocorreu um erro ao salvar seu plano de aula. Tente novamente.",
      });
    }
  };

  return {
    form,
    step,
    totalSteps,
    nextStep,
    prevStep,
    onSubmit,
  };
}
