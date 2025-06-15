
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";

interface ConfiguracaoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function ConfiguracaoStep({ form, plano }: ConfiguracaoStepProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Configuração Básica</CardTitle>
        <CardDescription>
          Defina o tipo e objetivo da sua avaliação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="tipoAvaliacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Avaliação *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de avaliação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="prova">Prova</SelectItem>
                  <SelectItem value="teste">Teste</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="lista">Lista de Exercícios</SelectItem>
                  <SelectItem value="simulado">Simulado</SelectItem>
                  <SelectItem value="trabalho">Trabalho Avaliativo</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="objetivoAvaliacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Objetivo da Avaliação *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o objetivo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="diagnostica">Avaliação Diagnóstica</SelectItem>
                  <SelectItem value="formativa">Avaliação Formativa</SelectItem>
                  <SelectItem value="somativa">Avaliação Somativa</SelectItem>
                  <SelectItem value="recuperacao">Recuperação</SelectItem>
                  <SelectItem value="reforco">Reforço</SelectItem>
                  <SelectItem value="preparatorio">Preparatório</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </>
  );
}
