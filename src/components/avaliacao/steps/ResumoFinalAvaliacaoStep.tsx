import { UseFormReturn } from "react-hook-form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, Download, Send, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebhookService } from "@/utils/webhookService";
import { FileDownloadService } from "@/utils/fileDownload";

interface ResumoFinalAvaliacaoStepProps {
  form: UseFormReturn<any>;
}

export function ResumoFinalAvaliacaoStep({ form }: ResumoFinalAvaliacaoStepProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [avaliacaoGerada, setAvaliacaoGerada] = useState<any>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();
  const formValues = form.getValues();

  const parseWebhookResponse = (response: any) => {
    console.log('Parseando resposta do webhook:', response);
    
    // Verificar se é array com output
    if (Array.isArray(response) && response.length > 0 && response[0].output) {
      const outputText = response[0].output;
      return parseJsonAvaliacao(outputText);
    }
    
    // Verificar se tem output direto
    if (response.output) {
      return parseJsonAvaliacao(response.output);
    }
    
    // Verificar estruturas aninhadas
    if (response.data && Array.isArray(response.data) && response.data[0]?.output) {
      return parseJsonAvaliacao(response.data[0].output);
    }
    
    if (response.avaliacao) {
      return response.avaliacao;
    }
    
    return null;
  };

  const parseJsonAvaliacao = (outputText: string) => {
    try {
      // Tentar fazer parse do JSON contido no output
      const avaliacaoData = JSON.parse(outputText);
      
      console.log('JSON da avaliação parseado:', avaliacaoData);
      
      // Estruturar dados para exibição
      return {
        titulo: `${avaliacaoData.cabecalho?.disciplina || 'Avaliação'} - ${avaliacaoData.cabecalho?.tema || 'Tema'}`,
        duracao: avaliacaoData.cabecalho?.duracao || avaliacaoData.metadata?.tempo_total ? `${avaliacaoData.metadata.tempo_total} minutos` : 'Não especificada',
        disciplina: avaliacaoData.cabecalho?.disciplina || 'Não informada',
        unidade: avaliacaoData.cabecalho?.unidade || 'Não informada',
        capitulo: avaliacaoData.cabecalho?.capitulo || 'Não informado',
        tema: avaliacaoData.cabecalho?.tema || 'Não informado',
        instrucoes: avaliacaoData.instrucoes || [],
        questoes: avaliacaoData.questoes?.map((q: any) => ({
          numero: q.numero,
          enunciado: q.enunciado,
          alternativas: q.alternativas || [],
          pontuacao: q.pontuacao,
          tipo: q.tipo,
          resposta_correta: q.resposta_correta
        })) || [],
        gabarito: avaliacaoData.gabarito || [],
        metadata: avaliacaoData.metadata || {},
        json_completo: avaliacaoData,
        texto_completo: outputText
      };
    } catch (error) {
      console.error('Erro ao fazer parse do JSON:', error);
      // Fallback para texto simples se não conseguir parsear JSON
      return parseAvaliacaoText(outputText);
    }
  };

  const parseAvaliacaoText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    const questoes = [];
    let currentQuestao = null;
    let titulo = '';
    let duracao = '';
    
    // Extrair informações do cabeçalho
    for (const line of lines) {
      if (line.includes('DISCIPLINA:')) {
        titulo = line.split(':')[1]?.trim() || 'Avaliação';
      }
      if (line.includes('DURAÇÃO:')) {
        duracao = line.split(':')[1]?.trim() || '';
      }
      
      // Identificar questões
      if (line.match(/QUESTÃO\s+\d+/)) {
        if (currentQuestao) {
          questoes.push(currentQuestao);
        }
        
        const numeroMatch = line.match(/QUESTÃO\s+(\d+)/);
        const numero = numeroMatch ? parseInt(numeroMatch[1]) : questoes.length + 1;
        
        currentQuestao = {
          numero,
          enunciado: '',
          alternativas: [],
          pontuacao: line.match(/\(([\d,]+)\s*pontos?\)/)?.[1] || '1,0'
        };
      } else if (currentQuestao && line.match(/^[a-d]\)/)) {
        // Alternativa
        const letra = line.charAt(0);
        const texto = line.substring(3).trim();
        currentQuestao.alternativas.push({ letra, texto });
      } else if (currentQuestao && line.trim() && !line.includes('_____') && !line.includes('QUESTÃO')) {
        // Parte do enunciado
        if (currentQuestao.enunciado) {
          currentQuestao.enunciado += ' ' + line.trim();
        } else {
          currentQuestao.enunciado = line.trim();
        }
      }
    }
    
    // Adicionar última questão
    if (currentQuestao) {
      questoes.push(currentQuestao);
    }
    
    return {
      titulo: titulo || 'Avaliação Gerada',
      duracao: duracao || 'Não especificada',
      questoes,
      texto_completo: text
    };
  };

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    
    try {
      console.log('Enviando dados para webhook (prévia):', formValues);
      
      const dataToSend = {
        ...formValues,
        action: "generate_preview",
        timestamp: new Date().toISOString(),
        plataforma: "PROFZi"
      };

      const response = await WebhookService.sendAvaliacaoData(dataToSend);
      
      console.log('Resposta recebida do webhook:', response);
      
      if (response.success) {
        const avaliacaoParsed = parseWebhookResponse(response);
        
        if (avaliacaoParsed) {
          setAvaliacaoGerada(avaliacaoParsed);
          toast({
            title: "Prévia gerada com sucesso!",
            description: `Avaliação com ${avaliacaoParsed.questoes?.length || 0} questões foi gerada.`,
          });
        } else {
          throw new Error("Não foi possível processar a resposta do webhook");
        }
      } else {
        throw new Error(response.error || response.message || "Erro desconhecido no webhook");
      }
    } catch (error: any) {
      console.error('Erro ao gerar prévia:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao gerar prévia",
        description: error.message || "Não foi possível conectar com o servidor. Verifique sua conexão e tente novamente.",
      });
      
      setAvaliacaoGerada(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAndDownload = async () => {
    setIsDownloading(true);
    
    try {
      console.log('Enviando dados para webhook (geração final):', formValues);
      
      const dataToSend = {
        ...formValues,
        action: "generate_final",
        formato_saida: formValues.formatoSaida,
        timestamp: new Date().toISOString(),
        plataforma: "PROFZi"
      };

      const response = await WebhookService.sendAvaliacaoData(dataToSend);
      
      console.log('Resposta do webhook para download:', response);
      
      if (response.success) {
        // Processar resposta e fazer download
        await FileDownloadService.processWebhookResponse(response, formValues.formatoSaida || ['pdf']);
        
        toast({
          title: "Avaliação gerada e baixada!",
          description: "O arquivo foi processado e está sendo baixado.",
        });
      } else {
        throw new Error(response.error || response.message || "Erro ao gerar arquivo no servidor");
      }
    } catch (error: any) {
      console.error('Erro ao gerar arquivo:', error);
      
      toast({
        variant: "destructive",
        title: "Erro ao gerar arquivo",
        description: error.message || "Não foi possível gerar o arquivo. Verifique sua conexão e tente novamente.",
      });
    } finally {
      setIsDownloading(false);
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
        </div>

        <Separator />

        {/* Generation Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Gerar Avaliação</h4>
            <div className="flex gap-2">
              <Button 
                onClick={handleGeneratePreview} 
                disabled={isGenerating || isDownloading}
                variant="outline"
                className="gap-2"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                {isGenerating ? 'Gerando Prévia...' : 'Gerar Prévia'}
              </Button>
              
              <Button 
                onClick={handleGenerateAndDownload} 
                disabled={isGenerating || isDownloading}
                className="gap-2"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isDownloading ? 'Gerando Arquivo...' : 'Gerar e Baixar'}
              </Button>
            </div>
          </div>

          {avaliacaoGerada && (
            <div className="border rounded-lg p-4 bg-background">
              <h5 className="font-semibold mb-3">
                {avaliacaoGerada.titulo}
              </h5>
              
              {/* Informações do Cabeçalho */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p><strong>Disciplina:</strong> {avaliacaoGerada.disciplina}</p>
                  <p><strong>Unidade:</strong> {avaliacaoGerada.unidade}</p>
                </div>
                <div>
                  <p><strong>Capítulo:</strong> {avaliacaoGerada.capitulo}</p>
                  <p><strong>Duração:</strong> {avaliacaoGerada.duracao}</p>
                </div>
              </div>

              {/* Instruções */}
              {avaliacaoGerada.instrucoes && avaliacaoGerada.instrucoes.length > 0 && (
                <div className="mb-4">
                  <h6 className="font-medium text-sm mb-2">Instruções:</h6>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    {avaliacaoGerada.instrucoes.map((instrucao: string, index: number) => (
                      <li key={index}>{instrucao}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questões */}
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Total de questões:</strong> {avaliacaoGerada.questoes?.length || 0}
                  {avaliacaoGerada.metadata?.nivel_dificuldade && (
                    <span> | <strong>Nível:</strong> {avaliacaoGerada.metadata.nivel_dificuldade}/10</span>
                  )}
                </p>
                
                {avaliacaoGerada.questoes && avaliacaoGerada.questoes.length > 0 && (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {avaliacaoGerada.questoes.slice(0, 3).map((questao: any, index: number) => (
                      <div key={questao.numero || index} className="border-l-2 border-primary/20 pl-3">
                        <p className="text-sm font-medium">
                          Questão {questao.numero} ({questao.pontuacao})
                          {questao.resposta_correta && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-1 rounded">
                              Resposta: {questao.resposta_correta}
                            </span>
                          )}
                        </p>
                        <p className="text-sm mt-1 mb-2">
                          {questao.enunciado}
                        </p>
                        {questao.alternativas && questao.alternativas.length > 0 && (
                          <div className="text-xs space-y-1">
                            {questao.alternativas.map((alt: any, altIndex: number) => (
                              <p key={altIndex} className={alt.letra === questao.resposta_correta ? 'font-semibold text-green-700' : ''}>
                                {alt.letra}) {alt.texto}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {avaliacaoGerada.questoes.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center">
                        ... e mais {avaliacaoGerada.questoes.length - 3} questões
                      </p>
                    )}
                  </div>
                )}

                {/* Metadata */}
                {avaliacaoGerada.metadata && Object.keys(avaliacaoGerada.metadata).length > 0 && (
                  <div className="mt-3 p-2 bg-muted/30 rounded text-xs">
                    <strong>Informações adicionais:</strong>
                    {avaliacaoGerada.metadata.estilo && <span> | Estilo: {avaliacaoGerada.metadata.estilo}</span>}
                    {avaliacaoGerada.metadata.permite_calculadora !== undefined && (
                      <span> | Calculadora: {avaliacaoGerada.metadata.permite_calculadora ? 'Permitida' : 'Não permitida'}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Preview Note */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Geração em Tempo Real</p>
              <p>Os dados são processados em tempo real via webhook. A prévia mostra o conteúdo estruturado que será gerado e o download cria os arquivos formatados nos formatos selecionados.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}
