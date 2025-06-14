
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLoadingState } from "@/hooks/useLoadingState";
import { WebhookService } from "@/services/WebhookClient";
import { parseWebhookResponse } from "@/utils/webhookResponseParser";
import { validateAvaliacaoData } from "@/utils/requestValidator";

interface ProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  description?: string;
}

export function useAvaliacaoGeneration() {
  const [avaliacaoGerada, setAvaliacaoGerada] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>([]);
  const { toast } = useToast();
  const { setLoading, isLoading } = useLoadingState();

  const isGenerating = isLoading('avaliacao-generation');

  const initializeProgress = () => {
    const steps: ProgressStep[] = [
      {
        id: 'validation',
        label: 'Validando dados do formulário',
        status: 'pending',
        description: 'Verificando se todos os campos obrigatórios estão preenchidos'
      },
      {
        id: 'preparation',
        label: 'Preparando requisição',
        status: 'pending',
        description: 'Organizando dados para envio ao servidor'
      },
      {
        id: 'sending',
        label: 'Enviando para o servidor',
        status: 'pending',
        description: 'Comunicando com o serviço de geração de avaliações'
      },
      {
        id: 'processing',
        label: 'Processando resposta',
        status: 'pending',
        description: 'Analisando e validando dados recebidos'
      },
      {
        id: 'finalizing',
        label: 'Finalizando',
        status: 'pending',
        description: 'Preparando avaliação para visualização'
      }
    ];

    setProgressSteps(steps);
    return steps;
  };

  const updateProgress = (stepId: string, status: ProgressStep['status'], description?: string) => {
    setProgressSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return { ...step, status, description: description || step.description };
      }
      return step;
    }));
  };

  const generatePreview = async (formValues: any) => {
    setLoading('avaliacao-generation', true);
    setError(null);
    setAvaliacaoGerada(null);
    setShowPreview(false);
    setDebugInfo(null);
    
    const steps = initializeProgress();
    
    try {
      // Passo 1: Validação
      updateProgress('validation', 'active');
      const validation = validateAvaliacaoData(formValues);
      if (!validation.isValid) {
        const errorMessage = `Formulário incompleto: ${validation.errors.join(', ')}`;
        updateProgress('validation', 'error', errorMessage);
        setError(errorMessage);
        toast({
          title: "Formulário incompleto",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }
      updateProgress('validation', 'completed');

      // Passo 2: Preparação
      updateProgress('preparation', 'active');
      const dataToSend = {
        ...formValues,
        action: "generate_preview",
        timestamp: new Date().toISOString(),
        plataforma: "PROFZi"
      };
      updateProgress('preparation', 'completed');

      // Passo 3: Envio
      updateProgress('sending', 'active');
      const response = await WebhookService.sendAvaliacaoData(dataToSend);
      
      if (!response || !response.success) {
        throw new Error(response?.error || 'Falha na comunicação com o servidor');
      }
      updateProgress('sending', 'completed');
      
      // Passo 4: Processamento
      updateProgress('processing', 'active');
      const { avaliacaoParsed, debugData } = parseWebhookResponse(response, formValues);
      updateProgress('processing', 'completed');
      
      // Passo 5: Finalização
      updateProgress('finalizing', 'active');
      setAvaliacaoGerada(avaliacaoParsed);
      setDebugInfo(debugData);
      setShowPreview(true);
      updateProgress('finalizing', 'completed');
      
      toast({
        title: "Avaliação gerada com sucesso!",
        description: `Avaliação com ${avaliacaoParsed.questoes?.length || 0} questões foi gerada.`,
      });
      
    } catch (error: any) {
      const currentStep = steps.find(step => step.status === 'active')?.id || 'sending';
      updateProgress(currentStep, 'error');
      
      const errorMessage = error.message || 'Erro desconhecido ao gerar avaliação';
      setError(errorMessage);
      
      toast({
        title: "Erro ao gerar avaliação",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading('avaliacao-generation', false);
    }
  };

  const clearCache = () => {
    WebhookService.clearCache();
    toast({
      title: "Cache limpo",
      description: "O cache foi limpo com sucesso.",
    });
  };

  const getCacheStats = () => {
    return WebhookService.getCacheStats();
  };

  return {
    isGenerating,
    avaliacaoGerada,
    showPreview,
    error,
    debugInfo,
    progressSteps,
    generatePreview,
    clearCache,
    getCacheStats
  };
}
