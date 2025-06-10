
import { UseFormReturn } from "react-hook-form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Send, Loader2, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebhookService } from "@/utils/webhookService";
import { FilePreview } from "@/components/ui/file-preview";

interface ResumoFinalAvaliacaoStepProps {
  form: UseFormReturn<any>;
}

export function ResumoFinalAvaliacaoStep({ form }: ResumoFinalAvaliacaoStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [avaliacaoGerada, setAvaliacaoGerada] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  const formValues = form.getValues();

  // Validação do formulário antes de gerar
  const validateFormData = (data: any) => {
    const errors = [];
    
    if (!data.tipoAvaliacao || data.tipoAvaliacao.trim() === '') {
      errors.push('Tipo de avaliação é obrigatório');
    }
    
    if (!data.objetivoAvaliacao || data.objetivoAvaliacao.trim() === '') {
      errors.push('Objetivo da avaliação é obrigatório');
    }
    
    if (!data.materia || data.materia.trim() === '') {
      errors.push('Matéria é obrigatória');
    }
    
    if (!data.numeroQuestoes || data.numeroQuestoes < 1) {
      errors.push('Número de questões deve ser maior que 0');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const createFallbackAvaliacao = (formData: any) => {
    console.log('Criando avaliação de fallback com dados:', formData);
    
    return {
      cabecalho: {
        disciplina: formData.materia || 'Disciplina',
        unidade: formData.unidade || 'Unidade 1',
        capitulo: formData.capitulos?.[0] || 'Capítulo 1',
        tema: formData.temas?.[0] || 'Tema da Avaliação',
        duracao: `${formData.duracaoSugerida || 60} minutos`
      },
      instrucoes: [
        'Leia atentamente cada questão antes de responder.',
        'Marque apenas uma alternativa por questão.',
        'Use caneta azul ou preta para responder.',
        'Não é permitido o uso de corretor.',
        formData.permitirCalculadora ? 'É permitido o uso de calculadora.' : 'Não é permitido o uso de calculadora.'
      ].filter(Boolean),
      questoes: Array.from({ length: formData.numeroQuestoes || 5 }, (_, index) => ({
        numero: index + 1,
        enunciado: `Esta é a questão ${index + 1} sobre ${formData.temas?.[0] || 'o tema estudado'}. Complete com o conteúdo apropriado baseado nos objetivos de aprendizagem da disciplina ${formData.materia || 'estudada'}.`,
        alternativas: [
          { letra: 'a', texto: 'Primeira alternativa da questão' },
          { letra: 'b', texto: 'Segunda alternativa da questão' },
          { letra: 'c', texto: 'Terceira alternativa da questão' },
          { letra: 'd', texto: 'Quarta alternativa da questão' }
        ],
        pontuacao: '1,0 ponto',
        resposta_correta: 'a'
      })),
      metadata: {
        total_questoes: formData.numeroQuestoes || 5,
        nivel_dificuldade: formData.nivelDificuldade || 5,
        estilo: formData.estiloQuestoes || 'conceitual',
        permite_calculadora: formData.permitirCalculadora || false,
        tempo_total: formData.duracaoSugerida || 60,
        data_criacao: new Date().toISOString(),
        observacoes: 'Avaliação gerada automaticamente. Revise e personalize conforme necessário.'
      },
      gabarito: Array.from({ length: formData.numeroQuestoes || 5 }, (_, index) => 
        `Questão ${index + 1}: a`
      )
    };
  };

  const parseWebhookResponse = (response: any) => {
    console.log('Parseando resposta do webhook:', response);
    
    try {
      if (!response) {
        console.warn('Resposta vazia ou null');
        return null;
      }

      let outputText = null;

      // Processar resposta do webhook que vem como array
      if (Array.isArray(response) && response.length > 0 && response[0]?.output) {
        outputText = response[0].output;
        console.log('Array com output detectado:', outputText.substring(0, 100) + '...');
      }
      // Se response tem sucesso e data
      else if (response.success && response.data && Array.isArray(response.data) && response.data[0]?.output) {
        outputText = response.data[0].output;
        console.log('Success.data detectado:', outputText.substring(0, 100) + '...');
      }
      // Response direto com output
      else if (response.output) {
        outputText = response.output;
        console.log('Output direto detectado:', outputText.substring(0, 100) + '...');
      }

      if (!outputText) {
        console.warn('Não foi possível encontrar outputText na resposta');
        return null;
      }

      return parseJsonAvaliacao(outputText);
      
    } catch (error) {
      console.error('Erro ao processar resposta do webhook:', error);
      return null;
    }
  };

  const parseJsonAvaliacao = (outputText: string) => {
    try {
      console.log('Fazendo parse do JSON:', outputText.substring(0, 200) + '...');
      
      const avaliacaoData = JSON.parse(outputText);
      console.log('JSON da avaliação parseado com sucesso:', avaliacaoData);
      
      // Validar estrutura básica
      if (!avaliacaoData.questoes || !Array.isArray(avaliacaoData.questoes) || avaliacaoData.questoes.length === 0) {
        console.warn('Estrutura de avaliação inválida - questões ausentes ou vazias');
        return null;
      }

      // Validar e normalizar questões
      const questoesValidadas = avaliacaoData.questoes.map((questao: any, index: number) => {
        return {
          numero: questao.numero || (index + 1),
          pontuacao: questao.pontuacao || '1,0 ponto',
          enunciado: questao.enunciado || `Questão ${index + 1}`,
          tipo: questao.tipo || 'multipla_escolha',
          alternativas: questao.alternativas && Array.isArray(questao.alternativas) 
            ? questao.alternativas.map((alt: any) => ({
                letra: alt.letra || 'a',
                texto: alt.texto || 'Alternativa'
              }))
            : [
                { letra: 'a', texto: 'Primeira alternativa' },
                { letra: 'b', texto: 'Segunda alternativa' },
                { letra: 'c', texto: 'Terceira alternativa' },
                { letra: 'd', texto: 'Quarta alternativa' }
              ],
          resposta_correta: questao.resposta_correta || 'a'
        };
      });

      // Processar gabarito
      let gabaritoProcessado;
      if (avaliacaoData.gabarito && Array.isArray(avaliacaoData.gabarito)) {
        if (avaliacaoData.gabarito[0] && typeof avaliacaoData.gabarito[0] === 'object' && avaliacaoData.gabarito[0].questao) {
          gabaritoProcessado = avaliacaoData.gabarito.map((item: any) => 
            `Questão ${item.questao}: ${item.resposta?.toUpperCase()} - ${item.explicacao || ''}`
          );
        } else {
          gabaritoProcessado = avaliacaoData.gabarito;
        }
      } else {
        gabaritoProcessado = questoesValidadas.map((questao: any) => 
          `Questão ${questao.numero}: ${questao.resposta_correta?.toUpperCase()}`
        );
      }

      // Montar objeto final validado
      const avaliacaoValidada = {
        cabecalho: {
          disciplina: avaliacaoData.cabecalho?.disciplina || 'Disciplina',
          unidade: avaliacaoData.cabecalho?.unidade || 'Unidade',
          capitulo: avaliacaoData.cabecalho?.capitulo || '',
          tema: avaliacaoData.cabecalho?.tema || 'Tema',
          duracao: avaliacaoData.cabecalho?.duracao || '60 minutos'
        },
        instrucoes: Array.isArray(avaliacaoData.instrucoes) 
          ? avaliacaoData.instrucoes 
          : [
              'Leia atentamente cada questão antes de responder.',
              'Marque apenas uma alternativa por questão.',
              'Use caneta azul ou preta para responder.'
            ],
        questoes: questoesValidadas,
        metadata: {
          total_questoes: questoesValidadas.length,
          nivel_dificuldade: avaliacaoData.metadata?.nivel_dificuldade || 5,
          estilo: avaliacaoData.metadata?.estilo || 'conceitual',
          permite_calculadora: avaliacaoData.metadata?.permite_calculadora || false,
          tempo_total: avaliacaoData.metadata?.tempo_total || 60,
          data_criacao: new Date().toISOString()
        },
        gabarito: gabaritoProcessado
      };
      
      console.log('Avaliação validada com sucesso:', avaliacaoValidada);
      return avaliacaoValidada;
      
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      console.error('JSON recebido:', outputText);
      return null;
    }
  };

  const handleGeneratePreview = async () => {
    // Validar formulário antes de prosseguir
    const validation = validateFormData(formValues);
    if (!validation.isValid) {
      toast({
        title: "Formulário incompleto",
        description: `Por favor, preencha os campos obrigatórios: ${validation.errors.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setHasError(false);
    
    try {
      console.log('Enviando dados para webhook (prévia):', formValues);
      
      const dataToSend = {
        ...formValues,
        action: "generate_preview",
        timestamp: new Date().toISOString(),
        plataforma: "PROFZi"
      };

      let avaliacaoParsed = null;

      try {
        const response = await WebhookService.sendAvaliacaoData(dataToSend);
        console.log('Resposta recebida do webhook:', response);
        
        avaliacaoParsed = parseWebhookResponse(response);
        
        if (!avaliacaoParsed) {
          console.log('Parser não conseguiu extrair dados válidos');
          // Tentar acessar dados diretamente se existirem
          if (response && typeof response === 'object') {
            avaliacaoParsed = parseWebhookResponse(response);
          }
        }
        
      } catch (webhookError) {
        console.error('Erro no webhook:', webhookError);
        // Continue para usar o fallback abaixo
      }

      // Se o webhook falhou ou não retornou dados válidos, usar fallback
      if (!avaliacaoParsed) {
        console.log('Usando avaliação de fallback');
        avaliacaoParsed = createFallbackAvaliacao(formValues);
        setHasError(true);
        
        toast({
          title: "Avaliação gerada localmente",
          description: "Houve um problema na conexão, mas geramos uma prévia para você. Revise e personalize conforme necessário.",
          variant: "default",
        });
      } else {
        toast({
          title: "Prévia gerada com sucesso!",
          description: `Avaliação com ${avaliacaoParsed.questoes?.length || 0} questões foi gerada.`,
        });
      }

      setAvaliacaoGerada(avaliacaoParsed);
      setShowPreview(true);
      
    } catch (error: any) {
      console.error('Erro geral ao gerar prévia:', error);
      
      // Usar fallback mesmo em caso de erro geral
      console.log('Gerando avaliação de fallback devido a erro geral');
      const fallbackAvaliacao = createFallbackAvaliacao(formValues);
      setAvaliacaoGerada(fallbackAvaliacao);
      setShowPreview(true);
      setHasError(true);
      
      toast({
        title: "Prévia gerada localmente",
        description: "Houve um problema técnico, mas geramos uma prévia básica para você. Personalize conforme necessário.",
        variant: "default",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Resumo Final da Avaliação
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        
        {/* Summary Sections */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Configuração da Avaliação</h4>
            <div className="bg-muted/30 p-3 rounded-md space-y-1">
              <p><strong>Tipo:</strong> {formValues.tipoAvaliacao || 'Não informado'}</p>
              <p><strong>Objetivo:</strong> {formValues.objetivoAvaliacao || 'Não informado'}</p>
              <p><strong>Matéria:</strong> {formValues.materia || 'Não informada'}</p>
              <p><strong>Unidade:</strong> {formValues.unidade || 'Não informada'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Estrutura das Questões</h4>
            <div className="bg-muted/30 p-3 rounded-md space-y-1">
              <p><strong>Número de questões:</strong> {formValues.numeroQuestoes || 'Não informado'}</p>
              <p><strong>Tipo de questões:</strong> {formValues.tipoQuestoes || 'Não informado'}</p>
              <p><strong>Nível de dificuldade:</strong> {formValues.nivelDificuldade || 'Não informado'}/10</p>
              <p><strong>Duração sugerida:</strong> {formValues.duracaoSugerida || 'Não informada'} minutos</p>
            </div>
          </div>

          {formValues.tipoCompeticao && (
            <div>
              <h4 className="font-medium mb-2">Modelo de Competição</h4>
              <div className="bg-muted/30 p-3 rounded-md">
                <p><strong>Tipo:</strong> {formValues.tipoCompeticao}</p>
                {formValues.modelosCompeticao && formValues.modelosCompeticao.length > 0 && (
                  <div className="mt-2">
                    <strong>Modelos:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formValues.modelosCompeticao.map((modelo: string) => (
                        <Badge key={modelo} variant="secondary">{modelo}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Opções Adicionais</h4>
            <div className="bg-muted/30 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p>Fórmulas: {formValues.incluirFormulas ? 'Sim' : 'Não'}</p>
                <p>Imagens: {formValues.incluirImagens ? 'Sim' : 'Não'}</p>
                <p>Tabelas: {formValues.incluirTabelas ? 'Sim' : 'Não'}</p>
                <p>Gabarito: {formValues.incluirGabarito ? 'Sim' : 'Não'}</p>
                <p>Calculadora: {formValues.permitirCalculadora ? 'Sim' : 'Não'}</p>
                <p>Cronômetro: {formValues.incluirCronometro ? 'Sim' : 'Não'}</p>
              </div>
            </div>
          </div>

          {formValues.formatoSaida && formValues.formatoSaida.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Formatos de Saída</h4>
              <div className="flex flex-wrap gap-1">
                {formValues.formatoSaida.map((formato: string) => (
                  <Badge key={formato} variant="outline">{formato.toUpperCase()}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Generation Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Gerar Avaliação</h4>
            <Button 
              onClick={handleGeneratePreview} 
              disabled={isGenerating}
              className="gap-2"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isGenerating ? 'Gerando...' : 'Gerar Avaliação'}
            </Button>
          </div>

          {hasError && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Avaliação gerada localmente</p>
                  <p>Houve um problema na conexão com o servidor, mas geramos uma prévia básica para você. Revise e personalize o conteúdo conforme necessário.</p>
                </div>
              </div>
            </div>
          )}

          {showPreview && avaliacaoGerada && (
            <FilePreview 
              data={avaliacaoGerada}
              formats={formValues.formatoSaida || ['pdf']}
            />
          )}
        </div>

        <Separator />

        {/* Preview Note */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Preview e Validação</p>
              <p>Agora você pode visualizar e editar o conteúdo antes de baixar. Isso garante que o arquivo esteja correto antes do download.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}
