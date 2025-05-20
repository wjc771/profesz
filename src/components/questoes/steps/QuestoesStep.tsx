
import { UseFormReturn } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { SubscriptionPlanType } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Lock, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface QuestoesStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
  usageLimit: number | null;
}

export function QuestoesStep({ form, plano, usageLimit }: QuestoesStepProps) {
  const tipoQuestoes = form.watch("tipoQuestoes");
  const proporcaoMultiplaEscolha = form.watch("proporcaoMultiplaEscolha");
  const nivelDificuldade = form.watch("nivelDificuldade");
  
  useEffect(() => {
    // If not "ambos", set proporcaoMultiplaEscolha to 100 or 0
    if (tipoQuestoes === "multipla") {
      form.setValue("proporcaoMultiplaEscolha", 100);
    } else if (tipoQuestoes === "dissertativa") {
      form.setValue("proporcaoMultiplaEscolha", 0);
    }
  }, [tipoQuestoes, form]);
  
  const maxQuestoes = usageLimit ? Math.min(20, usageLimit) : 20;
  
  const getDifficultyLabel = (value: number) => {
    if (value <= 3) return 'Fácil';
    if (value <= 7) return 'Médio';
    return 'Difícil';
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-6">Configuração das Questões</h3>
        
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="numeroQuestoes"
            render={({ field }) => (
              <FormItem className="bg-card/30 p-6 rounded-lg">
                <FormLabel className="text-base font-medium">Número de Questões</FormLabel>
                <div className="flex items-center gap-4 mt-2">
                  <FormControl className="flex-1">
                    <Slider
                      min={1}
                      max={maxQuestoes}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      className="w-20 text-center"
                      min={1}
                      max={maxQuestoes}
                      value={field.value}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= maxQuestoes) {
                          field.onChange(value);
                        }
                      }}
                    />
                  </div>
                </div>
                <FormDescription className="text-xs mt-2">
                  {usageLimit 
                    ? `Limite do seu plano: ${maxQuestoes} questões por solicitação` 
                    : 'Sem limite de questões'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tipoQuestoes"
            render={({ field }) => (
              <FormItem className="space-y-3 bg-card/30 p-6 rounded-lg">
                <FormLabel className="text-base font-medium">Tipo de Questões</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-3 gap-2"
                  >
                    {["multipla", "dissertativa", "ambos"].map((tipo) => (
                      <div key={tipo} className="relative">
                        <RadioGroupItem
                          value={tipo}
                          id={tipo}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={tipo}
                          className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover px-4 py-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-foreground cursor-pointer"
                        >
                          {tipo === "multipla" && "Múltipla Escolha"}
                          {tipo === "dissertativa" && "Dissertativa"}
                          {tipo === "ambos" && "Ambos"}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {tipoQuestoes === "ambos" && (
            <FormField
              control={form.control}
              name="proporcaoMultiplaEscolha"
              render={({ field }) => (
                <FormItem className="bg-card/30 p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <FormLabel className="text-base font-medium">
                      Proporção de Tipos de Questões
                    </FormLabel>
                    <span className="text-sm font-medium">
                      {field.value}% Múltipla Escolha
                    </span>
                  </div>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={10}
                      defaultValue={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>100% Dissertativa</span>
                    <span>50% / 50%</span>
                    <span>100% Múltipla Escolha</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="nivelDificuldade"
            render={({ field }) => (
              <FormItem className="bg-card/30 p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-base font-medium">
                    Nível de Dificuldade
                  </FormLabel>
                  <span className="text-sm font-medium">
                    {getDifficultyLabel(field.value)} ({field.value}/10)
                  </span>
                </div>
                <FormControl>
                  <Slider
                    min={0}
                    max={10}
                    step={1}
                    defaultValue={[field.value]}
                    onValueChange={(values) => field.onChange(values[0])}
                    className="py-4"
                  />
                </FormControl>
                <div className="flex justify-between mt-1">
                  <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">Fácil</span>
                  <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">Médio</span>
                  <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">Difícil</span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Opções Adicionais
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Personalize suas questões com recursos adicionais</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "incluirFormulas", label: "Incluir fórmulas", description: "Adiciona fórmulas matemáticas ou científicas" },
            { name: "incluirImagens", label: "Incluir imagens/figuras", description: "Adiciona elementos visuais às questões" },
            { name: "incluirTabelas", label: "Incluir tabelas/gráficos", description: "Adiciona dados tabulares ou gráficos" },
            { name: "incluirContexto", label: "Incluir contexto/situação-problema", description: "Questões baseadas em casos ou situações" },
            { name: "incluirInterdisciplinar", label: "Incluir questões interdisciplinares", description: "Relaciona conteúdos de diferentes áreas" },
            { name: "permitirCalculadora", label: "Permitir uso de calculadora", description: "Indica se a calculadora pode ser usada" },
            { name: "incluirGabarito", label: "Incluir gabarito/resolução comentada", description: "Fornece respostas e explicações detalhadas" }
          ].map((option) => (
            <FormField
              key={option.name}
              control={form.control}
              name={option.name as any}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/5">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-medium cursor-pointer">
                      {option.label}
                    </FormLabel>
                    <FormDescription className="text-xs">
                      {option.description}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          ))}
          
          <FormField
            control={form.control}
            name="questoesAdaptativas"
            render={({ field }) => (
              <FormItem className={`flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/5 ${plano !== 'maestro' && plano !== 'institucional' ? 'bg-muted/20' : ''}`}>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={plano === 'maestro' || plano === 'institucional' ? field.onChange : undefined}
                    disabled={plano !== 'maestro' && plano !== 'institucional'}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <div className="flex items-center">
                    <FormLabel className="font-medium cursor-pointer">
                      Questões adaptativas
                    </FormLabel>
                    {plano !== 'maestro' && plano !== 'institucional' && (
                      <Lock className="w-4 h-4 ml-2 text-muted-foreground" />
                    )}
                  </div>
                  <FormDescription className="text-xs">
                    Gera questões que se adaptam ao nível do aluno
                    {plano !== 'maestro' && plano !== 'institucional' && (
                      <span className="block text-primary font-medium mt-1">
                        Disponível nos planos Maestro e Institucional
                      </span>
                    )}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
