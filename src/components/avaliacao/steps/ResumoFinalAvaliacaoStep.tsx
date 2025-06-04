
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

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    
    try {
      const dataToSend = {
        ...formValues,
        action: "generate_preview",
        timestamp: new Date().toISOString(),
        plataforma: "PROFZi"
      };

      const response = await WebhookService.sendAvaliacaoData(dataToSend);
      
      if (response.success && response.avaliacao) {
        setAvaliacaoGerada(response.avaliacao);
        toast({
          title: "Prévia gerada com sucesso!",
          description: `Avaliação gerada conforme suas especificações.`,
        });
      } else {
        // Fallback para mock se webhook não retornar avaliação
        const mockAvaliacao = generateMockAvaliacao();
        setAvaliacaoGerada(mockAvaliacao);
        toast({
          title: "Prévia gerada (modo offline)",
          description: "Usando dados de exemplo para demonstração.",
        });
      }
    } catch (error: any) {
      console.error('Erro ao gerar prévia:', error);
      // Em caso de erro, mostrar mock como fallback
      const mockAvaliacao = generateMockAvaliacao();
      setAvaliacaoGerada(mockAvaliacao);
      toast({
        variant: "destructive",
        title: "Erro na conexão",
        description: "Exibindo prévia offline. " + (error.message || "Tente novamente."),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateAndDownload = async () => {
    setIsDownloading(true);
    
    try {
      const dataToSend = {
        ...formValues,
        action: "generate_final",
        formato_saida: formValues.formatoSaida,
        timestamp: new Date().toISOString(),
        plataforma: "PROFZi"
      };

      const response = await WebhookService.sendAvaliacaoData(dataToSend);
      
      if (response.success) {
        // Processar resposta e fazer download
        await FileDownloadService.processWebhookResponse(response, formValues.formatoSaida || ['pdf']);
        
        toast({
          title: "Avaliação gerada e baixada!",
          description: "O arquivo foi salvo no seu dispositivo.",
        });
      } else {
        throw new Error(response.error || "Erro ao gerar avaliação");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao gerar arquivo",
        description: error.message || "Não foi possível gerar o arquivo. Tente novamente.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const generateMockAvaliacao = () => {
    const questoesMock = [];
    const numeroQuestoes = formValues.numeroQuestoes || 10;
    
    for (let i = 1; i <= numeroQuestoes; i++) {
      if (formValues.tipoQuestoes === "multipla" || formValues.tipoQuestoes === "mista") {
        questoesMock.push({
          numero: i,
          tipo: "multipla_escolha",
          enunciado: `Questão ${i}: Considerando os conceitos de ${formValues.materia || 'Matemática'}, analise a situação apresentada e assinale a alternativa correta.`,
          alternativas: [
            { letra: "A", texto: "Primeira alternativa correta" },
            { letra: "B", texto: "Segunda alternativa" },
            { letra: "C", texto: "Terceira alternativa" },
            { letra: "D", texto: "Quarta alternativa" },
            { letra: "E", texto: "Quinta alternativa" }
          ],
          gabarito: "A",
          dificuldade: formValues.nivelDificuldade || 5
        });
      } else {
        questoesMock.push({
          numero: i,
          tipo: "dissertativa",
          enunciado: `Questão ${i}: Desenvolva uma resposta completa sobre os conceitos de ${formValues.materia || 'Matemática'} apresentados.`,
          criterios_avaliacao: [
            "Clareza na exposição dos conceitos",
            "Aplicação correta dos procedimentos",
            "Organização lógica da resposta"
          ],
          dificuldade: formValues.nivelDificuldade || 5
        });
      }
    }

    return {
      titulo: `Avaliação de ${formValues.materia || 'Matemática'} - ${formValues.unidade || 'Unidade 1'}`,
      tipo: formValues.tipoAvaliacao || 'Prova',
      objetivo: formValues.objetivoAvaliacao || 'Diagnóstica',
      duracao_sugerida: formValues.duracaoSugerida || 60,
      questoes: questoesMock,
      gabarito_disponivel: formValues.incluirGabarito || false,
      permite_calculadora: formValues.permitirCalculadora || false,
      data_geracao: new Date().toISOString()
    };
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
                {isGenerating ? 'Gerando...' : 'Gerar Prévia'}
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
                {isDownloading ? 'Baixando...' : 'Gerar e Baixar'}
              </Button>
            </div>
          </div>

          {avaliacaoGerada && (
            <div className="border rounded-lg p-4 bg-background">
              <h5 className="font-semibold mb-3">{avaliacaoGerada.titulo}</h5>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Tipo:</strong> {avaliacaoGerada.tipo} | 
                  <strong> Duração:</strong> {avaliacaoGerada.duracao_sugerida} min | 
                  <strong> Questões:</strong> {avaliacaoGerada.questoes.length}
                </p>
                
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  {avaliacaoGerada.questoes.slice(0, 3).map((questao: any) => (
                    <div key={questao.numero} className="border-l-2 border-primary/20 pl-3">
                      <p className="text-sm"><strong>Questão {questao.numero}:</strong></p>
                      <p className="text-xs text-muted-foreground mt-1">{questao.enunciado}</p>
                      {questao.alternativas && (
                        <div className="mt-2 text-xs">
                          {questao.alternativas.slice(0, 2).map((alt: any) => (
                            <p key={alt.letra}>{alt.letra}) {alt.texto}</p>
                          ))}
                          <p className="text-muted-foreground">...</p>
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
              <p className="font-medium mb-1">Finalização</p>
              <p>Gere uma prévia para revisar o conteúdo ou baixe diretamente nos formatos selecionados. Os dados serão processados em tempo real via webhook.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}
