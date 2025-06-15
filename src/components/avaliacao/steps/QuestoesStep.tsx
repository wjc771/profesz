
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";
import { InfoIcon, Lock } from "lucide-react";

interface QuestoesStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
  usageLimit: number | null;
}

export function QuestoesStep({ form, plano, usageLimit }: QuestoesStepProps) {
  const numeroQuestoes = form.watch("numeroQuestoes");
  const tipoQuestoes = form.watch("tipoQuestoes");
  const nivelDificuldade = form.watch("nivelDificuldade");

  // Definir limites baseados no plano
  const getLimites = () => {
    const isAdmin = plano === 'maestro' || plano === 'institucional';
    
    if (isAdmin) {
      return {
        maxQuestoes: 50,
        tiposQuestoes: ['multipla', 'dissertativa', 'mista', 'verdadeiro_falso', 'completar_lacunas', 'associacao'],
        opcoesPremium: true
      };
    }
    
    switch (plano) {
      case 'essencial':
        return {
          maxQuestoes: 30,
          tiposQuestoes: ['multipla', 'dissertativa', 'mista', 'verdadeiro_falso'],
          opcoesPremium: true
        };
      case 'inicial':
      default:
        return {
          maxQuestoes: 20,
          tiposQuestoes: ['multipla', 'dissertativa'],
          opcoesPremium: false
        };
    }
  };

  const limites = getLimites();
  const isAdmin = plano === 'maestro' || plano === 'institucional';

  return (
    <>
      <CardHeader>
        <CardTitle>Configuração das Questões</CardTitle>
        <CardDescription>
          Configure o número, tipo e características das questões
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Número de Questões */}
        <FormField
          control={form.control}
          name="numeroQuestoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Questões *</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Input
                    type="number"
                    min={1}
                    max={limites.maxQuestoes}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                  <div className="text-sm text-muted-foreground">
                    Máximo permitido para seu plano: {limites.maxQuestoes} questões
                    {isAdmin && <Badge className="ml-2 text-xs">Admin - Sem limites</Badge>}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo de Questões */}
        <FormField
          control={form.control}
          name="tipoQuestoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Questões *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de questão" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="multipla">Múltipla Escolha</SelectItem>
                  <SelectItem value="dissertativa">Dissertativa</SelectItem>
                  {limites.tiposQuestoes.includes('mista') && (
                    <SelectItem value="mista">Mista (Múltipla + Dissertativa)</SelectItem>
                  )}
                  {limites.tiposQuestoes.includes('verdadeiro_falso') && (
                    <SelectItem value="verdadeiro_falso">Verdadeiro ou Falso</SelectItem>
                  )}
                  {limites.tiposQuestoes.includes('completar_lacunas') && (
                    <SelectItem value="completar_lacunas">
                      Completar Lacunas
                      {!limites.opcoesPremium && <Lock className="ml-2 h-3 w-3" />}
                    </SelectItem>
                  )}
                  {limites.tiposQuestoes.includes('associacao') && (
                    <SelectItem value="associacao">
                      Associação/Correspondência
                      {!limites.opcoesPremium && <Lock className="ml-2 h-3 w-3" />}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Proporção para questões mistas */}
        {tipoQuestoes === 'mista' && (
          <FormField
            control={form.control}
            name="proporcaoMultiplaEscolha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proporção de Múltipla Escolha (%)</FormLabel>
                <FormControl>
                  <div className="space-y-3">
                    <Slider
                      min={10}
                      max={90}
                      step={10}
                      value={[field.value || 50]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="w-full"
                    />
                    <div className="text-sm text-muted-foreground text-center">
                      {field.value || 50}% Múltipla Escolha, {100 - (field.value || 50)}% Dissertativa
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Nível de Dificuldade */}
        <FormField
          control={form.control}
          name="nivelDificuldade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nível de Dificuldade</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[field.value || 5]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full"
                  />
                  <div className="text-sm text-muted-foreground text-center">
                    Nível {field.value || 5}/10 - {
                      (field.value || 5) <= 3 ? 'Fácil' :
                      (field.value || 5) <= 6 ? 'Médio' :
                      (field.value || 5) <= 8 ? 'Difícil' : 'Muito Difícil'
                    }
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Opções Avançadas */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Opções Adicionais</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fórmulas */}
            <FormField
              control={form.control}
              name="incluirFormulas"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!limites.opcoesPremium && !isAdmin}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2">
                      Incluir fórmulas matemáticas
                      {!limites.opcoesPremium && !isAdmin && <Lock className="h-3 w-3" />}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Imagens */}
            <FormField
              control={form.control}
              name="incluirImagens"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!limites.opcoesPremium && !isAdmin}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2">
                      Incluir imagens e gráficos
                      {!limites.opcoesPremium && !isAdmin && <Lock className="h-3 w-3" />}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Tabelas */}
            <FormField
              control={form.control}
              name="incluirTabelas"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!limites.opcoesPremium && !isAdmin}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2">
                      Incluir tabelas e dados
                      {!limites.opcoesPremium && !isAdmin && <Lock className="h-3 w-3" />}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Contexto */}
            <FormField
              control={form.control}
              name="incluirContexto"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Incluir contexto situacional
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Interdisciplinar */}
            <FormField
              control={form.control}
              name="incluirInterdisciplinar"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!limites.opcoesPremium && !isAdmin}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2">
                      Abordagem interdisciplinar
                      {!limites.opcoesPremium && !isAdmin && <Lock className="h-3 w-3" />}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Calculadora */}
            <FormField
              control={form.control}
              name="permitirCalculadora"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Permitir uso de calculadora
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Gabarito */}
            <FormField
              control={form.control}
              name="incluirGabarito"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Incluir gabarito comentado
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {/* Questões Adaptativas */}
            <FormField
              control={form.control}
              name="questoesAdaptativas"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!isAdmin}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2">
                      Questões adaptativas (IA)
                      {!isAdmin && <Badge className="text-xs">Admin</Badge>}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {usageLimit && (
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Você pode criar até {usageLimit} avaliações este mês com seu plano atual.
              {isAdmin && " Como admin, você tem acesso a todas as funcionalidades."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </>
  );
}
