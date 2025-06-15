
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";
import { Trophy, Lock } from "lucide-react";

interface ModelosCompeticaoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function ModelosCompeticaoStep({ form, plano }: ModelosCompeticaoStepProps) {
  const tipoCompeticao = form.watch("tipoCompeticao");
  const modelosCompeticao = form.watch("modelosCompeticao") || [];

  const isAdmin = plano === 'maestro' || plano === 'institucional';
  const isPremium = plano === 'essencial' || isAdmin;

  const modelosDisponiveis = [
    { id: 'enem', nome: 'ENEM', disponivel: true },
    { id: 'vestibular', nome: 'Vestibulares Tradicionais', disponivel: true },
    { id: 'sisu', nome: 'SISU', disponivel: isPremium },
    { id: 'fuvest', nome: 'FUVEST', disponivel: isPremium },
    { id: 'unicamp', nome: 'UNICAMP', disponivel: isPremium },
    { id: 'uerj', nome: 'UERJ', disponivel: isPremium },
    { id: 'olimpiadas_mat', nome: 'Olimpíadas de Matemática', disponivel: isAdmin },
    { id: 'olimpiadas_fis', nome: 'Olimpíadas de Física', disponivel: isAdmin },
    { id: 'olimpiadas_qui', nome: 'Olimpíadas de Química', disponivel: isAdmin },
    { id: 'olimpiadas_bio', nome: 'Olimpíadas de Biologia', disponivel: isAdmin },
    { id: 'concursos', nome: 'Concursos Públicos', disponivel: isAdmin },
  ];

  const handleModeloToggle = (modeloId: string) => {
    const modelo = modelosDisponiveis.find(m => m.id === modeloId);
    if (!modelo?.disponivel) return;

    const novosModelos = modelosCompeticao.includes(modeloId)
      ? modelosCompeticao.filter((id: string) => id !== modeloId)
      : [...modelosCompeticao, modeloId];
    
    form.setValue("modelosCompeticao", novosModelos);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Modelos de Competição
        </CardTitle>
        <CardDescription>
          Configure sua avaliação baseada em modelos de exames e competições (opcional)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tipo de Competição */}
        <FormField
          control={form.control}
          name="tipoCompeticao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Competição</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um tipo (opcional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Nenhum</SelectItem>
                  <SelectItem value="vestibular">Vestibular</SelectItem>
                  <SelectItem value="enem">ENEM</SelectItem>
                  {isPremium && <SelectItem value="olimpiada">Olimpíadas Acadêmicas</SelectItem>}
                  {isAdmin && <SelectItem value="concurso">Concursos Públicos</SelectItem>}
                  {isAdmin && <SelectItem value="internacional">Competições Internacionais</SelectItem>}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Modelos Específicos */}
        {tipoCompeticao && (
          <FormField
            control={form.control}
            name="modelosCompeticao"
            render={() => (
              <FormItem>
                <FormLabel>Modelos Específicos</FormLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {modelosDisponiveis.map((modelo) => (
                    <div key={modelo.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={modelo.id}
                        checked={modelosCompeticao.includes(modelo.id)}
                        onCheckedChange={() => handleModeloToggle(modelo.id)}
                        disabled={!modelo.disponivel}
                      />
                      <label
                        htmlFor={modelo.id}
                        className={`text-sm font-medium leading-none cursor-pointer flex items-center gap-2 ${
                          !modelo.disponivel ? 'opacity-50' : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                        }`}
                      >
                        {modelo.nome}
                        {!modelo.disponivel && <Lock className="h-3 w-3" />}
                        {!modelo.disponivel && plano === 'inicial' && (
                          <Badge className="text-xs">Premium</Badge>
                        )}
                        {!modelo.disponivel && !isAdmin && plano !== 'inicial' && (
                          <Badge className="text-xs">Admin</Badge>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Informações sobre os modelos */}
        {tipoCompeticao && (
          <Alert>
            <Trophy className="h-4 w-4" />
            <AlertDescription>
              {tipoCompeticao === 'enem' && (
                "As questões seguirão o formato ENEM com 5 alternativas, competências e habilidades específicas."
              )}
              {tipoCompeticao === 'vestibular' && (
                "Questões no estilo de vestibulares tradicionais com diferentes níveis de complexidade."
              )}
              {tipoCompeticao === 'olimpiada' && (
                "Questões desafiadoras focadas em raciocínio lógico e resolução de problemas complexos."
              )}
              {tipoCompeticao === 'concurso' && (
                "Questões objetivas típicas de concursos públicos com múltiplas alternativas."
              )}
              {tipoCompeticao === 'internacional' && (
                "Questões no padrão de competições internacionais como PISA, TIMSS, etc."
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Limitações do plano */}
        {!isPremium && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Alguns modelos de competição estão disponíveis apenas nos planos Essencial ou superiores. 
              Considere fazer upgrade para acessar modelos como FUVEST, UNICAMP e outros vestibulares específicos.
            </AlertDescription>
          </Alert>
        )}

        {!isAdmin && isPremium && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Modelos de olimpíadas acadêmicas e concursos públicos estão disponíveis apenas para administradores.
            </AlertDescription>
          </Alert>
        )}

        {isAdmin && (
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Acesso Admin:</strong> Você tem acesso a todos os modelos de competição, 
              incluindo olimpíadas acadêmicas e competições internacionais.
            </p>
          </div>
        )}

        {!tipoCompeticao && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Selecione um tipo de competição para configurar modelos específicos.</p>
            <p className="text-sm mt-2">Esta etapa é opcional.</p>
          </div>
        )}
      </CardContent>
    </>
  );
}
