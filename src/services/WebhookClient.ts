interface WebhookPayload {
  [key: string]: any;
}

interface WebhookResponse {
  success: boolean;
  data?: any;
  files?: Array<{
    filename: string;
    content: string;
    format: string;
  }>;
  avaliacao?: any;
  message?: string;
  error?: string;
}

import { globalCache } from "@/utils/requestCache";

export class WebhookService {
  private static requestCount = 0;
  private static readonly MAX_REQUESTS = 3;
  private static readonly REQUEST_TIMEOUT = 45000; // Aumentado para 45s
  private static isBlocked = false;
  private static lastRequestTime = 0;
  private static readonly RATE_LIMIT_MS = 2000; // Reduzido para 2s

  private static readonly MAX_RETRIES = 3;

  static async sendData(webhookUrl: string, data: WebhookPayload): Promise<WebhookResponse> {
    // Novo bloco de retry
    let attempt = 0;
    let lastError: any = null;
    let delay = 1000;
    while (attempt < this.MAX_RETRIES) {
      try {
        return await this.trySendData(webhookUrl, data);
      } catch (error: any) {
        lastError = error;
        // Se erro for timeout, tenta novamente
        if (
          error?.message &&
          (error.message.includes("Timeout") || error.message.includes("demorou mais que o esperado"))
        ) {
          attempt++;
          if (attempt < this.MAX_RETRIES) {
            console.warn("[Webhook] Timeout, retrying attempt", attempt + 1, "...", error.message);
            await new Promise(res => setTimeout(res, delay));
            delay = delay * 2; // backoff exponencial
            continue;
          }
        }
        // Para outros erros, não faz retry.
        break;
      }
    }
    // Se todas as tentativas falharem, lança a última mensagem de erro
    throw lastError || new Error("Erro desconhecido ao comunicar com o servidor.");
  }

  // Extraído para uma função auxiliar para implementar retry de timeout
  private static async trySendData(webhookUrl: string, data: WebhookPayload): Promise<WebhookResponse> {
    if (!webhookUrl) {
      throw new Error("URL do webhook é obrigatória");
    }

    // Gerar chave de cache baseada na URL e dados
    const cacheKey = this.generateCacheKey(webhookUrl, data);
    
    // Verificar cache apenas para requests GET-like (consultas)
    if (data.action === 'get_templates' || data.action === 'validate_only') {
      const cachedResponse = globalCache.get<WebhookResponse>(cacheKey);
      if (cachedResponse) {
        console.log('🚀 Resposta obtida do cache:', cacheKey);
        return cachedResponse;
      }
    }

    // Rate limiting com exponential backoff
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minDelay = this.RATE_LIMIT_MS * Math.pow(2, Math.min(this.requestCount, 3));
    
    if (timeSinceLastRequest < minDelay) {
      const waitTime = Math.ceil((minDelay - timeSinceLastRequest) / 1000);
      throw new Error(`Aguarde ${waitTime} segundos antes de tentar novamente`);
    }

    if (this.isBlocked) {
      throw new Error("Serviço temporariamente bloqueado. Tente novamente em alguns minutos.");
    }

    try {
      new URL(webhookUrl);
    } catch (error) {
      throw new Error("URL do webhook inválida");
    }

    if (this.requestCount >= this.MAX_REQUESTS) {
      this.isBlocked = true;
      setTimeout(() => {
        this.isBlocked = false;
        this.requestCount = 0;
      }, 60000); // Reset após 1 minuto
      throw new Error("Limite de tentativas atingido. Tente novamente em alguns minutos.");
    }

    this.requestCount++;
    this.lastRequestTime = now;

    const payload = {
      ...this.sanitizeData(data),
      timestamp: new Date().toISOString(),
      version: "1.0",
      platform: "PROFZi",
      metadata: {
        userAgent: navigator.userAgent,
        source: "avaliacao_form",
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PROFZi-Webhook/1.0',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status >= 500) {
          throw new Error(`Erro no servidor: ${response.status}`);
        } else if (response.status === 404) {
          throw new Error("Serviço de geração não encontrado");
        } else if (response.status === 429) {
          throw new Error("Muitas requisições - aguarde alguns minutos");
        } else {
          throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
        }
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error("Resposta não é JSON válido");
      }

      const responseData = await response.json();
      
      // Reset contador após sucesso
      this.requestCount = Math.max(0, this.requestCount - 1);

      const result = {
        success: true,
        ...responseData
      };

      // Cache apenas respostas de consulta bem-sucedidas
      if (data.action === 'get_templates' || data.action === 'validate_only') {
        globalCache.set(cacheKey, result, 2 * 60 * 1000); // 2 minutos para consultas
      }

      return result;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error("Timeout: A requisição demorou mais que o esperado.");
        }
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error("Erro de conexão. Verifique sua internet.");
        }
        
        throw error;
      }
      
      throw new Error("Erro desconhecido ao comunicar com o servidor.");
    }
  }

  private static generateCacheKey(url: string, data: WebhookPayload): string {
    const sortedData = Object.keys(data)
      .sort()
      .reduce((result, key) => {
        result[key] = data[key];
        return result;
      }, {} as WebhookPayload);
    
    return `webhook_${btoa(url)}_${btoa(JSON.stringify(sortedData))}`;
  }

  static sanitizeData(data: WebhookPayload): WebhookPayload {
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

  static async sendAvaliacaoData(data: WebhookPayload): Promise<WebhookResponse> {
    const webhookUrl = "https://n8n2.flowfieldsai.com/webhook/6a3f7dab-06bf-463f-906d-77e78c62d66e";
    return await this.sendData(webhookUrl, data);
  }

  static resetRequestCount(): void {
    this.requestCount = 0;
    this.isBlocked = false;
    this.lastRequestTime = 0;
  }

  static getServiceStatus() {
    const now = Date.now();
    const canRequest = (now - this.lastRequestTime) >= this.RATE_LIMIT_MS;
    
    return {
      isBlocked: this.isBlocked,
      requestCount: this.requestCount,
      maxRequests: this.MAX_REQUESTS,
      canRequest: canRequest && !this.isBlocked
    };
  }

  static clearCache(): void {
    globalCache.clear();
    console.log('Cache do WebhookService limpo');
  }

  static getCacheStats() {
    return globalCache.getStats();
  }
}
