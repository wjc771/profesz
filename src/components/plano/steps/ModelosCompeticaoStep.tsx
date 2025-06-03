
import { UseFormReturn } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionPlanType } from "@/types/profile";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy, Target, BookOpen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface ModelosCompeticaoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

const vestibularOptions = [
  { id: "enem", label: "ENEM" },
  { id: "usp", label: "USP (FUVEST)" },
  { id: "unicamp", label: "UNICAMP" },
  { id: "ita", label: "ITA" },
  { id: "fgv", label: "FGV" },
];

const jogosEscolaresOptions = [
  { id: "obm", label: "Olimpíada Brasileira de Matemática" },
  { id: "obf", label: "Olimpíada Brasileira de Física" },
  { id: "obq", label: "Olimpíada Brasileira de Química" },
  { id: "obi", label: "Olimpíada Brasileira de Informática" },
  { id: "jogos-estudantis", label: "Jogos Estudantis" },
];

const torneioAcademicoOptions = [
  { id: "simulados", label: "Simulados Regionais" },
  { id: "interdisciplinar", label: "Competições Interdisciplinares" },
  { id: "debates", label: "Torneios de Debates" },
];

const olimpiadaOptions = [
  { id: "conhecimento", label: "Olimpíadas do Conhecimento" },
  { id: "cientificas", label: "Olimpíadas Científicas" },
  { id: "linguagens", label: "Olimpíadas de Linguagens" },
];

export function ModelosCompeticaoStep({ form, plano }: ModelosCompeticaoStepProps) {
  const tipoCompeticao = form.watch("tipoCompeticao");
  
  const getOptionsForType = (tipo: string) => {
    switch (tipo) {
      case "vestibular":
        return vestibularOptions;
      case "jogos":
        return jogosEscolaresOptions;
      case "torneio":
        return torneioAcademicoOptions;
      case "olimpiada":
        return olimpiadaOptions;
      default:
        return [];
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Modelos de Competição
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <FormField
          control={form.control}
          name="tipoCompeticao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Competição</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de competição" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="vestibular">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Vestibular
                    </div>
                  </SelectItem>
                  <SelectItem value="jogos">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Jogos Escolares
                    </div>
                  </SelectItem>
                  <SelectItem value="torneio">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Torneio Acadêmico
                    </div>
                  </SelectItem>
                  <SelectItem value="olimpiada">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Olimpíadas
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {tipoCompeticao && (
          <FormField
            control={form.control}
            name="modelosCompeticao"
            render={() => (
              <FormItem>
                <FormLabel>Modelos Específicos</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {getOptionsForType(tipoCompeticao).map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="modelosCompeticao"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={option.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...(field.value || []), option.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value: string) => value !== option.id
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {option.label}
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

        <FormField
          control={form.control}
          name="estrategiaCompeticao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estratégia de Preparação</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva como esta aula se alinha com a preparação para a competição escolhida. Ex: foco em resolução rápida, técnicas específicas, etc."
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
          name="cronogramaPreparacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cronograma de Preparação (Opcional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Defina um cronograma de estudos ou sequência de aulas para a preparação. Ex: semanas 1-2 teoria, semanas 3-4 exercícios, etc."
                  className="min-h-[80px]"
                  {...field} 
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
