
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";

interface EstruturaStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function EstruturaStep({ form, plano }: EstruturaStepProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Estrutura da Aula</CardTitle>
        <CardDescription>
          Defina as etapas e o desenvolvimento da sua aula
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="introducao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Introdução/Aquecimento</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva como será o início da aula, as atividades de engajamento inicial..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="desenvolvimento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desenvolvimento Principal</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva as atividades principais, como o conteúdo será trabalhado..." 
                  className="min-h-[150px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fechamento"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fechamento/Conclusão</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva como será o encerramento da aula, as conclusões e sínteses..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="diferenciacaoAlunos"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Diferenciação
                {plano === "inicial" && <Badge className="ml-2 text-xs">Plano Essencial+</Badge>}
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={
                    plano === "inicial" 
                      ? "Disponível nos planos Essencial, Maestro e Institucional" 
                      : "Descreva adaptações para diferentes perfis de alunos, necessidades específicas..."
                  } 
                  className="min-h-[100px]"
                  {...field}
                  disabled={plano === "inicial"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </>
  );
}
