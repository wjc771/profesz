
import { UseFormReturn } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { SubscriptionPlanType } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

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
  
  return (
    <CardContent className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">Configuração das Questões</h3>
      
      <FormField
        control={form.control}
        name="numeroQuestoes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Número de Questões</FormLabel>
            <div className="flex items-center gap-4">
              <FormControl className="flex-1">
                <Slider
                  min={1}
                  max={maxQuestoes}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                />
              </FormControl>
              <Input
                type="number"
                className="w-20"
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
            <FormDescription className="text-xs">
              {usageLimit ? `Limite do seu plano: ${maxQuestoes} questões` : 'Sem limite de questões'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="tipoQuestoes"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Tipo de Questões</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multipla" id="multipla" />
                  <Label htmlFor="multipla">Múltipla Escolha</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dissertativa" id="dissertativa" />
                  <Label htmlFor="dissertativa">Dissertativa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ambos" id="ambos" />
                  <Label htmlFor="ambos">Ambos</Label>
                </div>
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
            <FormItem>
              <FormLabel>
                Proporção de Questões de Múltipla Escolha: {field.value}%
              </FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={10}
                  defaultValue={[field.value]}
                  onValueChange={(values) => field.onChange(values[0])}
                />
              </FormControl>
              <FormDescription>
                Dissertativa: {100 - field.value}%
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      <FormField
        control={form.control}
        name="nivelDificuldade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nível de Dificuldade: {
                nivelDificuldade <= 3 ? 'Fácil' : 
                nivelDificuldade <= 7 ? 'Médio' : 
                'Difícil'
              } ({field.value})
            </FormLabel>
            <FormControl>
              <Slider
                min={0}
                max={10}
                step={1}
                defaultValue={[field.value]}
                onValueChange={(values) => field.onChange(values[0])}
              />
            </FormControl>
            <div className="flex justify-between mt-2 text-xs">
              <span>Fácil</span>
              <span>Médio</span>
              <span>Difícil</span>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="space-y-4">
        <FormLabel>Opções Adicionais</FormLabel>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="incluirFormulas"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Incluir fórmulas
                </FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="incluirImagens"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Incluir imagens/figuras
                </FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="incluirTabelas"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Incluir tabelas/gráficos
                </FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="incluirContexto"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Incluir contexto/situação-problema
                </FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="incluirInterdisciplinar"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Incluir questões interdisciplinares
                </FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="permitirCalculadora"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Permitir uso de calculadora
                </FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="incluirGabarito"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  Incluir gabarito/resolução comentada
                </FormLabel>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="questoesAdaptativas"
            render={({ field }) => (
              <FormItem className={`flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3 ${plano !== 'maestro' && plano !== 'institucional' ? 'opacity-50' : ''}`}>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={plano === 'maestro' || plano === 'institucional' ? field.onChange : undefined}
                    disabled={plano !== 'maestro' && plano !== 'institucional'}
                  />
                </FormControl>
                <div className="flex items-center">
                  <FormLabel className="font-normal">
                    Questões adaptativas
                  </FormLabel>
                  {plano !== 'maestro' && plano !== 'institucional' && (
                    <Lock className="w-4 h-4 ml-2 text-muted-foreground" />
                  )}
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </CardContent>
  );
}
