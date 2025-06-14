
import { WebhookResponse } from "@/services/types";

export function normalizeWebhookResponse(response: any): WebhookResponse {
  if (!response) {
    throw new Error('Resposta vazia do servidor');
  }

  // Estruturas principais de resposta
  const extractContent = () => {
    const structures = [
      () => Array.isArray(response) && response.length > 0 && response[0]?.output ? response[0].output : null,
      () => response.success && response.data && Array.isArray(response.data) && response.data[0]?.output ? response.data[0].output : null,
      () => response.output ? response.output : null,
      () => response.data?.output ? response.data.output : null,
      () => response["0"]?.output ? response["0"].output : null,
      () => response[0]?.output ? response[0].output : null,
      () => typeof response === 'string' ? response : null,
      () => response.avaliacao ? JSON.stringify(response.avaliacao) : null
    ];

    for (const structure of structures) {
      const content = structure();
      if (content) return content;
    }
    
    return null;
  };

  const content = extractContent();
  
  if (!content) {
    throw new Error(`Estrutura de resposta inválida. Recebido: ${JSON.stringify(response, null, 2)}`);
  }

  return {
    success: true,
    data: content,
    message: response.message,
    error: response.error,
    files: response.files,
    avaliacao: response.avaliacao
  };
}
