
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";
import { Download, Share, Lock } from "lucide-react";

interface DistribuicaoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function DistribuicaoStep({ form, plano }: DistribuicaoStepProps) {
  const formatoSaida = form.watch("formatoSaida") || [];
  const opcaoCompartilhamento = form.watch("opcaoCompartilhamento") || [];

  const isAdmin = plano === 'maestro' || plano === 'institucional';
  const isPremium = plano === 'essencial' || isAdmin;

  const formatosDisponiveis = [
    { id: 'pdf', nome: 'PDF', icone: '📄', disponivel: true },
    { id: 'word', nome: 'Word (.docx)', icone: '📝', disponivel: isPremium },
    { id: 'google_forms', nome: 'Google Forms', icone: '📋', disponivel: isPremium },
    { id: 'moodle', nome: 'Moodle XML', icone: '🎓', disponivel: isAdmin },
    { id: 'qti', nome: 'QTI (Padrão Internacional)', icone: '🌐', disponivel: isAdmin },
    { id: 'html', nome: 'HTML Interativo', icone: '🌐', disponivel: isAdmin },
  ];

  const opcoesCompartilhamento = [
    { id: 'link_publico', nome: 'Link Público', disponivel: isPremium },
    { id: 'email', nome: 'Envio por E-mail', disponivel: isPremium },
    { id: 'whatsapp', nome: 'Compartilhar via WhatsApp', disponivel: true },
    { id: 'classroom', nome: 'Google Classroom', disponivel: isAdmin },
    { id: 'teams', nome: 'Microsoft Teams', disponivel: isAdmin },
    { id: 'lms', nome: 'Sistema LMS', disponivel: isAdmin },
  ];

  const handleFormatoToggle = (formatoId: string) => {
    const formato = formatosDisponiveis.find(f => f.id === formatoId);
    if (!formato?.disponivel) return;

    const novosFormatos = formatoSaida.includes(formatoId)
      ? formatoSaida.filter((id: string) => id !== formatoId)
      : [...formatoSaida, formatoId];
    
    form.setValue("formatoSaida", novosFormatos);
  };

  const handleCompartilhamentoToggle = (opcaoId: string) => {
    const opcao = opcoesCompartilhamento.find(o => o.id === opcaoId);
    if (!opcao?.disponivel) return;

    const novasOpcoes = opcaoCompartilhamento.includes(opcaoId)
      ? opcaoCompartilhamento.filter((id: string) => id !== opcaoId)
      : [...opcaoCompartilhamento, opcaoId];
    
    form.setValue("opcaoCompartilhamento", novasOpcoes);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Distribuição e Compartilhamento
        </CardTitle>
        <CardDescription>
          Configure como você deseja exportar e compartilhar sua avaliação
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formatos de Saída */}
        <FormField
          control={form.control}
          name="formatoSaida"
          render={() => (
            <FormItem>
              <FormLabel>Formatos de Saída *</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {formatosDisponiveis.map((formato) => (
                  <div key={formato.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={formato.id}
                      checked={formatoSaida.includes(formato.id)}
                      onCheckedChange={() => handleFormatoToggle(formato.id)}
                      disabled={!formato.disponivel}
                    />
                    <label
                      htmlFor={formato.id}
                      className={`text-sm font-medium leading-none cursor-pointer flex items-center gap-2 ${
                        !formato.disponivel ? 'opacity-50' : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      }`}
                    >
                      <span>{formato.icone}</span>
                      {formato.nome}
                      {!formato.disponivel && <Lock className="h-3 w-3" />}
                      {!formato.disponivel && plano === 'inicial' && (
                        <Badge className="text-xs">Premium</Badge>
                      )}
                      {!formato.disponivel && !isAdmin && plano !== 'inicial' && (
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

        {/* Opções de Compartilhamento */}
        <FormField
          control={form.control}
          name="opcaoCompartilhamento"
          render={() => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Share className="h-4 w-4" />
                Opções de Compartilhamento
              </FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {opcoesCompartilhamento.map((opcao) => (
                  <div key={opcao.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={opcao.id}
                      checked={opcaoCompartilhamento.includes(opcao.id)}
                      onCheckedChange={() => handleCompartilhamentoToggle(opcao.id)}
                      disabled={!opcao.disponivel}
                    />
                    <label
                      htmlFor={opcao.id}
                      className={`text-sm font-medium leading-none cursor-pointer flex items-center gap-2 ${
                        !opcao.disponivel ? 'opacity-50' : 'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                      }`}
                    >
                      {opcao.nome}
                      {!opcao.disponivel && <Lock className="h-3 w-3" />}
                      {!opcao.disponivel && plano === 'inicial' && (
                        <Badge className="text-xs">Premium</Badge>
                      )}
                      {!opcao.disponivel && !isAdmin && plano !== 'inicial' && (
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

        {/* Informações sobre formatos */}
        {formatoSaida.length > 0 && (
          <Alert>
            <Download className="h-4 w-4" />
            <AlertDescription>
              <strong>Formatos selecionados:</strong>
              <ul className="list-disc list-inside mt-2">
                {formatoSaida.map((id: string) => {
                  const formato = formatosDisponiveis.find(f => f.id === id);
                  return formato ? (
                    <li key={id}>
                      <strong>{formato.nome}:</strong> {getFormatoDescription(id)}
                    </li>
                  ) : null;
                })}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Limitações do plano */}
        {!isPremium && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Formatos como Word, Google Forms e opções de compartilhamento avançado estão disponíveis 
              nos planos Essencial ou superiores. PDF e WhatsApp estão incluídos no seu plano atual.
            </AlertDescription>
          </Alert>
        )}

        {isPremium && !isAdmin && (
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              Recursos como Moodle XML, QTI, HTML interativo e integração com LMS estão disponíveis 
              apenas para administradores.
            </AlertDescription>
          </Alert>
        )}

        {isAdmin && (
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Acesso Admin:</strong> Você tem acesso a todos os formatos de exportação e 
              opções de compartilhamento, incluindo integração com sistemas LMS.
            </p>
          </div>
        )}

        {formatoSaida.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Download className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Selecione pelo menos um formato de saída para continuar.</p>
          </div>
        )}
      </CardContent>
    </>
  );

  function getFormatoDescription(id: string): string {
    switch (id) {
      case 'pdf':
        return 'Documento pronto para impressão e compartilhamento';
      case 'word':
        return 'Editável no Microsoft Word para personalização adicional';
      case 'google_forms':
        return 'Formulário online interativo para aplicação digital';
      case 'moodle':
        return 'Importação direta para plataformas Moodle';
      case 'qti':
        return 'Padrão internacional para sistemas de e-learning';
      case 'html':
        return 'Página web interativa com recursos multimídia';
      default:
        return '';
    }
  }
}
