
import { UseFormReturn } from "react-hook-form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy, Target } from "lucide-react";
import { SubscriptionPlanType } from "@/types/profile";

interface ModelosCompeticaoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function ModelosCompeticaoStep({ form, plano }: ModelosCompeticaoStepProps) {
  const tiposCompeticao = [
    { value: "vestibular", label: "Vestibular" },
    { value: "jogos_escolares", label: "Jogos Escolares" },
    { value: "torneio_academico", label: "Torneio Acadêmico" },
    { value: "olimpiadas", label: "Olimpíadas" }
  ];

  const modelosPorTipo = {
    vestibular: [
      { value: "enem", label: "ENEM" },
      { value: "usp", label: "USP" },
      { value: "unicamp", label: "UNICAMP" },
      { value: "ita", label: "ITA" },
      { value: "fgv", label: "FGV" }
    ],
    jogos_escolares: [
      { value: "obm", label: "Olimpíadas Brasileiras de Matemática" },
      { value: "obf", label: "Olimpíadas de Física" },
      { value: "obq", label: "Olimpíadas de Química" },
      { value: "jogos_estudantis", label: "Jogos Estudantis" }
    ],
    torneio_academico: [
      { value: "simulados_regionais", label: "Simulados regionais" },
      { value: "competicoes_interdisciplinares", label: "Competições interdisciplinares" }
    ],
    olimpiadas: [
      { value: "olimpiadas_conhecimento", label: "Olimpíadas do Conhecimento" },
      { value: "olimpiadas_cientificas", label: "Olimpíadas Científicas" }
    ]
  };

  const tipoCompeticao = form.watch("tipoCompeticao");
  const modelosDisponiveis = tipoCompeticao ? modelosPorTipo[tipoCompeticao as keyof typeof modelosPorTipo] || [] : [];

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Modelos de Competição
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="tipoCompeticao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Competição</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo de competição" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tiposCompeticao.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {modelosDisponiveis.length > 0 && (
          <FormField
            control={form.control}
            name="modelosCompeticao"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Modelos Específicos</FormLabel>
                  <p className="text-sm text-muted-foreground">
                    Selecione os modelos que deseja usar como referência
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {modelosDisponiveis.map((modelo) => (
                    <FormField
                      key={modelo.value}
                      control={form.control}
                      name="modelosCompeticao"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={modelo.value}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(modelo.value)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, modelo.value])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== modelo.value
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {modelo.label}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Personalização por Modelo</p>
              <p>As questões serão adaptadas ao estilo e formato do modelo selecionado, incluindo estrutura, complexidade e tipo de abordagem.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}
