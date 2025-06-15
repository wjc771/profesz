
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";
import { Lock } from "lucide-react";

interface PersonalizacaoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function PersonalizacaoStep({ form, plano }: PersonalizacaoStepProps) {
  const isAdmin = plano === 'maestro' || plano === 'institucional';
  const isPremium = plano === 'essencial' || isAdmin;

  return (
    <>
      <CardHeader>
        <CardTitle>Personalização Avançada</CardTitle>
        <CardDescription>
          Configure o estilo, tempo e aparência da sua avaliação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estilo das Questões */}
        <FormField
          control={form.control}
          name="estiloQuestoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estilo das Questões</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estilo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="conceitual">Conceitual</SelectItem>
                  <SelectItem value="aplicacao">Aplicação Prática</SelectItem>
                  {isPremium && <SelectItem value="analise">Análise e Síntese</SelectItem>}
                  {isPremium && <SelectItem value="criativo">Pensamento Criativo</SelectItem>}
                  {isAdmin && <SelectItem value="competitivo">Estilo Competitivo</SelectItem>}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Formato de Apresentação */}
        <FormField
          control={form.control}
          name="formatoApresentacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Formato de Apresentação</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o formato" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="padrao">Padrão</SelectItem>
                  <SelectItem value="moderno">Moderno</SelectItem>
                  {isPremium && <SelectItem value="academico">Acadêmico</SelectItem>}
                  {isPremium && <SelectItem value="colorido">Colorido e Visual</SelectItem>}
                  {isAdmin && <SelectItem value="institucional">Institucional</SelectItem>}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Configurações de Tempo */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Configurações de Tempo</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="duracaoSugerida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração Sugerida (minutos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={5}
                      max={300}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                  <FormLabel>Tempo por Questão (minutos)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0.5}
                      max={30}
                      step={0.5}
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="incluirCronometro"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={!isPremium && !isAdmin}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center gap-2">
                    Incluir cronômetro visual
                    {!isPremium && !isAdmin && <Lock className="h-3 w-3" />}
                    {!isPremium && <Badge className="text-xs">Premium</Badge>}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Personalização Visual */}
        <div className={`space-y-4 ${!isPremium && !isAdmin ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Personalização Visual</h4>
            {!isPremium && !isAdmin && <Badge className="text-xs">Premium</Badge>}
          </div>

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL do Logo da Instituição</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://exemplo.com/logo.png"
                    {...field}
                    disabled={!isPremium && !isAdmin}
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
                    placeholder="Nome da Instituição, Curso, Disciplina, etc."
                    {...field}
                    disabled={!isPremium && !isAdmin}
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
                    placeholder="Informações adicionais, instruções, etc."
                    {...field}
                    disabled={!isPremium && !isAdmin}
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
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isPremium && !isAdmin}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estilo da fonte" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="arial">Arial</SelectItem>
                    <SelectItem value="times">Times New Roman</SelectItem>
                    <SelectItem value="calibri">Calibri</SelectItem>
                    <SelectItem value="verdana">Verdana</SelectItem>
                    {isAdmin && <SelectItem value="custom">Fonte Customizada</SelectItem>}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isAdmin && (
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Acesso Admin:</strong> Você tem acesso a todas as funcionalidades de personalização, 
              incluindo recursos exclusivos para administradores.
            </p>
          </div>
        )}
      </CardContent>
    </>
  );
}
