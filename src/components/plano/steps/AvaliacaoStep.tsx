
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";

interface AvaliacaoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function AvaliacaoStep({ form, plano }: AvaliacaoStepProps) {
  const metodosAvaliacao = [
    { value: "formativa", label: "Avaliação Formativa" },
    { value: "somativa", label: "Avaliação Somativa" },
    { value: "diagnostica", label: "Avaliação Diagnóstica" },
    { value: "continua", label: "Avaliação Contínua" },
    { value: "autoavaliacao", label: "Autoavaliação" },
    { value: "grupo", label: "Avaliação em Grupo" },
    { value: "projeto", label: "Avaliação de Projeto" },
    { value: "portfolio", label: "Portfólio" }
  ];

  return (
    <>
      <CardHeader>
        <CardTitle>Avaliação e Atividades</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="metodoAvaliacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Avaliação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um método" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {metodosAvaliacao.map((metodo) => (
                    <SelectItem key={metodo.value} value={metodo.value}>
                      {metodo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="atividadesSala"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Atividades em Sala</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva as atividades que serão realizadas em sala de aula..." 
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
          name="atividadesCasa"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Atividades para Casa</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva as atividades que serão realizadas em casa, se houver..." 
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
          name="rubricas"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Rubricas de Avaliação
                {(plano === "inicial" || plano === "essencial") && (
                  <Badge className="ml-2 text-xs">Plano Maestro+</Badge>
                )}
              </FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={
                    plano === "maestro" || plano === "institucional"
                      ? "Defina critérios específicos para avaliar o desempenho dos alunos..." 
                      : "Disponível nos planos Maestro e Institucional"
                  } 
                  className="min-h-[100px]"
                  {...field}
                  disabled={plano === "inicial" || plano === "essencial"}
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
