
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lock } from "lucide-react";

interface PersonalizacaoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function PersonalizacaoStep({ form, plano }: PersonalizacaoStepProps) {
  const canUseAdvancedStyles = plano === 'essencial' || plano === 'maestro' || plano === 'institucional';
  const canUseFullPersonalization = plano === 'maestro' || plano === 'institucional';
  
  return (
    <CardContent className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">Personalização Avançada</h3>
      
      <FormField
        control={form.control}
        name="estiloQuestoes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Estilo das Questões
              {!canUseAdvancedStyles && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
            </FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={!canUseAdvancedStyles}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o estilo das questões" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="conceitual">Conceitual</SelectItem>
                <SelectItem value="aplicacao">Aplicação prática</SelectItem>
                <SelectItem value="interpretacao">Interpretação de texto/dados</SelectItem>
                <SelectItem value="resolucao">Resolução de problemas</SelectItem>
                <SelectItem value="analise">Análise crítica</SelectItem>
                <SelectItem value="vestibular">Estilo ENEM/vestibular</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="formatoApresentacao"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Formato de Apresentação</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o formato de apresentação" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="padrao">Padrão (questões sequenciais)</SelectItem>
                <SelectItem value="temas">Agrupado por temas</SelectItem>
                <SelectItem value="dificuldade">Por ordem de dificuldade</SelectItem>
                <SelectItem value="alternancia">Alternância de tipos</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className={`space-y-4 ${!canUseFullPersonalization && 'opacity-60'}`}>
        <h4 className="font-medium flex items-center">
          Personalização Visual
          {!canUseFullPersonalization && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
        </h4>
        
        <FormField
          control={form.control}
          name="logo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link para o Logo da Instituição</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://example.com/logo.png" 
                  {...field} 
                  disabled={!canUseFullPersonalization}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="cabecalhoPersonalizado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cabeçalho Personalizado</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Cabeçalho personalizado para sua avaliação" 
                  {...field} 
                  disabled={!canUseFullPersonalization}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="rodapePersonalizado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rodapé Personalizado</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Rodapé personalizado para sua avaliação" 
                  {...field} 
                  disabled={!canUseFullPersonalization}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="estiloFonte"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estilo de Fonte</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={!canUseFullPersonalization}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o estilo de fonte" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="default">Padrão</SelectItem>
                  <SelectItem value="serif">Serifa</SelectItem>
                  <SelectItem value="sans">Sem Serifa</SelectItem>
                  <SelectItem value="mono">Monoespaçada</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className={`space-y-4 ${!canUseAdvancedStyles && 'opacity-60'}`}>
        <h4 className="font-medium flex items-center">
          Opções de Tempo
          {!canUseAdvancedStyles && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duracaoSugerida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração Sugerida (min)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    {...field} 
                    disabled={!canUseAdvancedStyles}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tempoPorQuestao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tempo por Questão (min)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    {...field} 
                    disabled={!canUseAdvancedStyles}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </CardContent>
  );
}
