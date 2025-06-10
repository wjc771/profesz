
import { UseFormReturn } from "react-hook-form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Send, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebhookService } from "@/utils/webhookService";
import { FilePreview } from "@/components/ui/file-preview";
import { DebugBlocker } from "../DebugBlocker";

interface ResumoFinalAvaliacaoStepProps {
  form: UseFormReturn<any>;
}

export function ResumoFinalAvaliacaoStep({ form }: ResumoFinalAvaliacaoStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [avaliacaoGerada, setAvaliacaoGerada] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const formValues = form.getValues();

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

  const parseWebhookResponse = (response: any) => {
    console.log('Parseando resposta do webhook:', response);
    
    try {
      if (!response) {
        throw new Error('Resposta vazia do servidor');
      }

      let outputText = null;

      // Verificar diferentes estruturas de resposta
      if (Array.isArray(response) && response.length > 0 && response[0]?.output) {
        outputText = response[0].output;
      } else if (response.success && response.data && Array.isArray(response.data) && response.data[0]?.output) {
        outputText = response.data[0].output;
      } else if (response.output) {
        outputText = response.output;
      } else if (typeof response === 'string') {
        outputText = response;
      }

      if (!outputText) {
        throw new Error('Estrutura de resposta inválida - campo "output" não encontrado');
      }

      // Parse do JSON
      const avaliacaoData = JSON.parse(outputText);
      
      // Validar estrutura básica
      if (!avaliacaoData.questoes || !Array.isArray(avaliacaoData.questoes) || avaliacaoData.questoes.length === 0) {
        throw new Error('Dados de avaliação inválidos - questões ausentes ou vazias');
      }

      // Validar questões
      const questoesValidadas = avaliacaoData.questoes.map((questao: any, index: number) => {
        if (!questao.enunciado) {
          throw new Error(`Questão ${index + 1} não possui enunciado`);
        }
        
        if (!questao.alternativas || !Array.isArray(questao.alternativas) || questao.alternativas.length === 0) {
          throw new Error(`Questão ${index + 1} não possui alternativas válidas`);
        }

        return {
          numero: questao.numero || (index + 1),
          pontuacao: questao.pontuacao || '1,0 ponto',
          enunciado: questao.enunciado,
          tipo: questao.tipo || 'multipla_escolha',
          alternativas: questao.alternativas.map((alt: any) => ({
            letra: alt.letra || 'a',
            texto: alt.texto || 'Alternativa'
          })),
          resposta_correta: questao.resposta_correta || 'a'
        };
      });

      // Montar objeto final validado
      const avaliacaoValidada = {
        cabecalho: {
          disciplina: avaliacaoData.cabecalho?.disciplina || formValues.materia || 'Disciplina',
          unidade: avaliacaoData.cabecalho?.unidade || formValues.unidade || 'Unidade',
          capitulo: avaliacaoData.cabecalho?.capitulo || formValues.capitulos?.[0] || '',
          tema: avaliacaoData.cabecalho?.tema || formValues.temas?.[0] || 'Tema',
          duracao: avaliacaoData.cabecalho?.duracao || `${formValues.duracaoSugerida || 60} minutos`
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
          nivel_dificuldade: avaliacaoData.metadata?.nivel_dificuldade || formValues.nivelDificuldade || 5,
          estilo: avaliacaoData.metadata?.estilo || formValues.estiloQuestoes || 'conceitual',
          permite_calculadora: avaliacaoData.metadata?.permite_calculadora || formValues.permitirCalculadora || false,
          tempo_total: avaliacaoData.metadata?.tempo_total || formValues.duracaoSugerida || 60,
          data_criacao: new Date().toISOString()
        },
        gabarito: questoesValidadas.map((questao: any) => 
          `Questão ${questao.numero}: ${questao.resposta_correta?.toUpperCase()}`
        )
      };
      
      console.log('Avaliação validada com sucesso:', avaliacaoValidada);
      return avaliacaoValidada;
      
    } catch (error) {
      console.error('Erro ao processar resposta:', error);
      throw error;
    }
  };

  const handleGeneratePreview = async () => {
    // Validar formulário antes de prosseguir
    const validation = validateFormData(formValues);
    if (!validation.isValid) {
      const errorMessage = `Formulário incompleto: ${validation.errors.join(', ')}`;
      setError(errorMessage);
      toast({
        title: "Formulário incompleto",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    setAvaliacaoGerada(null);
    setShowPreview(false);
    
    try {
      console.log('Iniciando geração de avaliação...');
      
      const dataToSend = {
        ...formValues,
        action: "generate_preview",
        timestamp: new Date().toISOString(),
        plataforma: "PROFZi"
      };

      console.log('Enviando dados para webhook:', dataToSend);
      
      const response = await WebhookService.sendAvaliacaoData(dataToSend);
      console.log('Resposta recebida do webhook:', response);
      
      if (!response || !response.success) {
        throw new Error(response?.error || 'Falha na comunicação com o servidor');
      }
      
      const avaliacaoParsed = parseWebhookResponse(response);
      
      setAvaliacaoGerada(avaliacaoParsed);
      setShowPreview(true);
      
      toast({
        title: "Avaliação gerada com sucesso!",
        description: `Avaliação com ${avaliacaoParsed.questoes?.length || 0} questões foi gerada.`,
      });
      
    } catch (error: any) {
      console.error('Erro ao gerar avaliação:', error);
      
      const errorMessage = error.message || 'Erro desconhecido ao gerar avaliação';
      setError(errorMessage);
      
      toast({
        title: "Erro ao gerar avaliação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <DebugBlocker />
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

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">Erro ao gerar avaliação</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Display */}
          {showPreview && avaliacaoGerada && !error && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">Avaliação gerada com sucesso!</p>
                  <p>Sua avaliação foi criada e está pronta para download.</p>
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
      </CardContent>
    </>
  );
}
