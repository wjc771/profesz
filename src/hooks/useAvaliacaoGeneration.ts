
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { WebhookService } from "@/services/WebhookClient";
import { parseWebhookResponse } from "@/utils/webhookResponseParser";

export function useAvaliacaoGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [avaliacaoGerada, setAvaliacaoGerada] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { toast } = useToast();

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

  const generatePreview = async (formValues: any) => {
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
    setDebugInfo(null);
    
    try {
      const dataToSend = {
        ...formValues,
        action: "generate_preview",
        timestamp: new Date().toISOString(),
        plataforma: "PROFZi"
      };

      const response = await WebhookService.sendAvaliacaoData(dataToSend);
      
      if (!response || !response.success) {
        throw new Error(response?.error || 'Falha na comunicação com o servidor');
      }
      
      const { avaliacaoParsed, debugData } = parseWebhookResponse(response, formValues);
      
      setAvaliacaoGerada(avaliacaoParsed);
      setDebugInfo(debugData);
      setShowPreview(true);
      
      toast({
        title: "Avaliação gerada com sucesso!",
        description: `Avaliação com ${avaliacaoParsed.questoes?.length || 0} questões foi gerada.`,
      });
      
    } catch (error: any) {
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

  return {
    isGenerating,
    avaliacaoGerada,
    showPreview,
    error,
    debugInfo,
    generatePreview
  };
}
