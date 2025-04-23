
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";

interface InfoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function InfoStep({ form, plano }: InfoStepProps) {
  const niveisEnsino = [
    { value: "educacao-infantil", label: "Educação Infantil" },
    { value: "fundamental-1", label: "Ensino Fundamental I" },
    { value: "fundamental-2", label: "Ensino Fundamental II" },
    { value: "medio", label: "Ensino Médio" },
    { value: "tecnico", label: "Ensino Técnico" },
    { value: "superior", label: "Ensino Superior" },
    { value: "especial", label: "Educação Especial" },
    { value: "livre", label: "Curso Livre" }
  ];
  
  const disciplinas = [
    { value: "matematica", label: "Matemática" },
    { value: "portugues", label: "Português" },
    { value: "ciencias", label: "Ciências" },
    { value: "historia", label: "História" },
    { value: "geografia", label: "Geografia" },
    { value: "artes", label: "Artes" },
    { value: "educacao-fisica", label: "Educação Física" }
  ];
  
  // This will change based on the level selected
  const getAnos = (nivel: string) => {
    switch (nivel) {
      case "educacao-infantil":
        return [
          { value: "bercario", label: "Berçário" },
          { value: "maternal-1", label: "Maternal I" },
          { value: "maternal-2", label: "Maternal II" },
          { value: "pre-1", label: "Pré I" },
          { value: "pre-2", label: "Pré II" }
        ];
      case "fundamental-1":
        return [
          { value: "1-ano", label: "1º Ano" },
          { value: "2-ano", label: "2º Ano" },
          { value: "3-ano", label: "3º Ano" },
          { value: "4-ano", label: "4º Ano" },
          { value: "5-ano", label: "5º Ano" }
        ];
      case "fundamental-2":
        return [
          { value: "6-ano", label: "6º Ano" },
          { value: "7-ano", label: "7º Ano" },
          { value: "8-ano", label: "8º Ano" },
          { value: "9-ano", label: "9º Ano" }
        ];
      case "medio":
        return [
          { value: "1-ano-medio", label: "1º Ano" },
          { value: "2-ano-medio", label: "2º Ano" },
          { value: "3-ano-medio", label: "3º Ano" }
        ];
      default:
        return [
          { value: "unico", label: "Período Único" },
          { value: "customizado", label: "Customizado" }
        ];
    }
  };
  
  const duracoes = [
    { value: "30", label: "30 minutos" },
    { value: "45", label: "45 minutos" },
    { value: "50", label: "50 minutos" },
    { value: "60", label: "60 minutos" },
    { value: "90", label: "90 minutos" },
    { value: "120", label: "120 minutos" }
  ];

  const nivelSelecionado = form.watch("nivelEnsino");
  const anos = getAnos(nivelSelecionado);

  return (
    <>
      <CardHeader>
        <CardTitle>Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Plano</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Introdução à Geometria" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="disciplina"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disciplina</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma disciplina" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {disciplinas.map((disciplina) => (
                      <SelectItem key={disciplina.value} value={disciplina.value}>
                        {disciplina.label}
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
            name="nivelEnsino"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nível de Ensino</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  form.setValue("serieAno", ""); // Reset the series/year when level changes
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um nível" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {niveisEnsino.map((nivel) => (
                      <SelectItem key={nivel.value} value={nivel.value}>
                        {nivel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serieAno"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Série/Ano</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!nivelSelecionado}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={nivelSelecionado ? "Selecione a série/ano" : "Selecione o nível primeiro"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {anos.map((ano) => (
                      <SelectItem key={ano.value} value={ano.value}>
                        {ano.label}
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
            name="duracaoAula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração da Aula</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {duracoes.map((duracao) => (
                      <SelectItem key={duracao.value} value={duracao.value}>
                        {duracao.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </>
  );
}
