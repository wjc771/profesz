
import { UseFormReturn } from "react-hook-form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Send, Loader2, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAvaliacaoGeneration } from "@/hooks/useAvaliacaoGeneration";
import { AvaliacaoPreview } from "@/components/avaliacao/AvaliacaoPreview";
import { DebugPanel } from "@/components/avaliacao/DebugPanel";
import { DebugBlocker } from "../DebugBlocker";

interface ResumoFinalAvaliacaoStepProps {
  form: UseFormReturn<any>;
}

export function ResumoFinalAvaliacaoStep({ form }: ResumoFinalAvaliacaoStepProps) {
  const formValues = form.getValues();
  const {
    isGenerating,
    avaliacaoGerada,
    showPreview,
    error,
    debugInfo,
    generatePreview
  } = useAvaliacaoGeneration();

  const handleGeneratePreview = () => {
    generatePreview(formValues);
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

          <DebugPanel debugInfo={debugInfo} />

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

          {showPreview && avaliacaoGerada && !error && (
            <AvaliacaoPreview 
              avaliacaoGerada={avaliacaoGerada}
              formatoSaida={formValues.formatoSaida || ['pdf']}
            />
          )}
        </div>
      </CardContent>
    </>
  );
}
