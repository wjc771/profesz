
import { WebhookPayload } from "@/services/types";

export function validateWebhookUrl(url: string): void {
  if (!url) {
    throw new Error("URL do webhook é obrigatória");
  }

  try {
    new URL(url);
  } catch (error) {
    throw new Error("URL do webhook inválida");
  }
}

export function sanitizeWebhookData(data: WebhookPayload): WebhookPayload {
  const sanitized: WebhookPayload = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined && value !== '') {
      if (!key.toLowerCase().includes('password') && 
          !key.toLowerCase().includes('token') &&
          !key.toLowerCase().includes('secret')) {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
}

export function validateAvaliacaoData(data: any): { isValid: boolean; errors: string[] } {
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
}
