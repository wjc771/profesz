
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
import { CardContent } from "@/components/ui/card";
import { SubscriptionPlanType } from "@/types/profile";
import { Book, FileCheck, ListChecks, PenTool, School, Timer } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ConfiguracaoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function ConfiguracaoStep({ form, plano }: ConfiguracaoStepProps) {
  return (
    <CardContent className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">Configuração Inicial</h3>
      
      <FormField
        control={form.control}
        name="tipoAvaliacao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo de Avaliação</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um tipo de avaliação" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="prova">Prova Formal</SelectItem>
                <SelectItem value="quiz">Quiz Rápido</SelectItem>
                <SelectItem value="lista">Lista de Exercícios</SelectItem>
                <SelectItem value="atividade">Atividade Avaliativa</SelectItem>
                <SelectItem value="simulado">Simulado</SelectItem>
                <SelectItem value="revisao">Revisão Temática</SelectItem>
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
            <FormLabel>Objetivo da Avaliação</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um objetivo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="diagnostica">Diagnóstica (pré-conteúdo)</SelectItem>
                <SelectItem value="formativa">Formativa (durante o processo)</SelectItem>
                <SelectItem value="somativa">Somativa (pós-conteúdo)</SelectItem>
                <SelectItem value="recuperacao">Recuperação</SelectItem>
                <SelectItem value="pratica">Prática/Fixação</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="modeloCriacao"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Modelo de Criação</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="zero" id="zero" className="sr-only" />
                      <label
                        htmlFor="zero"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer w-full h-32 transition-all ${
                          field.value === "zero"
                            ? "border-primary bg-primary/5"
                            : "border-muted bg-transparent hover:bg-muted/20"
                        }`}
                      >
                        <PenTool className="w-8 h-8 mb-2" />
                        <span className="font-medium text-center">Criar do zero</span>
                      </label>
                    </div>
                  </FormControl>
                </FormItem>
                
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="modelo" id="modelo" className="sr-only" />
                      <label
                        htmlFor="modelo"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer w-full h-32 transition-all ${
                          field.value === "modelo"
                            ? "border-primary bg-primary/5"
                            : "border-muted bg-transparent hover:bg-muted/20"
                        }`}
                      >
                        <FileCheck className="w-8 h-8 mb-2" />
                        <span className="font-medium text-center">Usar modelo existente</span>
                      </label>
                    </div>
                  </FormControl>
                </FormItem>
                
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="historico" id="historico" className="sr-only" />
                      <label
                        htmlFor="historico"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer w-full h-32 transition-all ${
                          field.value === "historico"
                            ? "border-primary bg-primary/5"
                            : "border-muted bg-transparent hover:bg-muted/20"
                        }`}
                      >
                        <Timer className="w-8 h-8 mb-2" />
                        <span className="font-medium text-center">Baseado no meu histórico</span>
                      </label>
                    </div>
                  </FormControl>
                </FormItem>
                
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="plano" id="plano" className="sr-only" />
                      <label
                        htmlFor="plano"
                        className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 cursor-pointer w-full h-32 transition-all ${
                          field.value === "plano"
                            ? "border-primary bg-primary/5"
                            : "border-muted bg-transparent hover:bg-muted/20"
                        }`}
                      >
                        <Book className="w-8 h-8 mb-2" />
                        <span className="font-medium text-center">A partir do meu plano de aula</span>
                      </label>
                    </div>
                  </FormControl>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CardContent>
  );
}
