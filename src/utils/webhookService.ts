
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

export class WebhookService {
  private static requestCount = 0;
  private static readonly MAX_REQUESTS = 3; // Reduzido para evitar spam
  private static readonly REQUEST_TIMEOUT = 30000; // 30 segundos
  private static isBlocked = false;
  private static lastRequestTime = 0;
  private static readonly RATE_LIMIT_MS = 5000; // 5 segundos entre requisições

  static async sendData(webhookUrl: string, data: WebhookPayload): Promise<WebhookResponse> {
    if (!webhookUrl) {
      throw new Error("URL do webhook é obrigatória");
    }

    // Rate limiting
    const now = Date.now();
    if (now - this.lastRequestTime < this.RATE_LIMIT_MS) {
      throw new Error(`Aguarde ${Math.ceil((this.RATE_LIMIT_MS - (now - this.lastRequestTime)) / 1000)} segundos antes de tentar novamente`);
    }

    // Se estiver bloqueado, não fazer requisição
    if (this.isBlocked) {
      throw new Error("Serviço temporariamente bloqueado para evitar loops. Tente novamente em alguns minutos.");
    }

    // Validar se a URL é válida
    try {
      new URL(webhookUrl);
    } catch (error) {
      throw new Error("URL do webhook inválida");
    }

    // Controle de limite de requisições
    if (this.requestCount >= this.MAX_REQUESTS) {
      console.warn('Limite de requisições atingido, bloqueando serviço');
      this.isBlocked = true;
      // Reset após 2 minutos
      setTimeout(() => {
        this.isBlocked = false;
        this.requestCount = 0;
      }, 120000);
      throw new Error("Limite de tentativas atingido. Tente novamente em alguns minutos.");
    }

    this.requestCount++;
    this.lastRequestTime = now;

    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      version: "1.0",
      platform: "PROFZi",
      metadata: {
        userAgent: navigator.userAgent,
        source: "avaliacao_form",
        requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    };

    console.log('Enviando payload para webhook:', JSON.stringify(payload, null, 2));

    // Criar um AbortController para timeout
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
      console.log('Status da resposta:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro HTTP:', response.status, errorText);
        
        if (response.status >= 500) {
          throw new Error(`Erro no servidor: ${response.status} - Tente novamente em alguns minutos`);
        } else if (response.status === 404) {
          throw new Error("Serviço de geração não encontrado - verifique a configuração");
        } else if (response.status === 429) {
          throw new Error("Muitas requisições - aguarde alguns minutos antes de tentar novamente");
        } else {
          throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
        }
      }

      // Verificar content-type
      const contentType = response.headers.get('content-type');
      console.log('Content-Type da resposta:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error("Resposta não é JSON válido - verifique o serviço de geração");
      }

      const responseData = await response.json();
      console.log('Resposta JSON do webhook:', JSON.stringify(responseData, null, 2));

      // Reset contador após sucesso
      this.requestCount = Math.max(0, this.requestCount - 1);

      return {
        success: true,
        ...responseData
      };

    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Erro na requisição do webhook:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error("Timeout: A requisição demorou mais que o esperado. Tente novamente.");
        }
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
        }
        
        // Re-throw com mensagem original se já for uma mensagem tratada
        throw error;
      }
      
      throw new Error("Erro desconhecido ao comunicar com o servidor.");
    }
  }

  static validateWebhookUrl(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'https:' || parsedUrl.protocol === 'http:';
    } catch {
      return false;
    }
  }

  static sanitizeData(data: WebhookPayload): WebhookPayload {
    const sanitized: WebhookPayload = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined && value !== '') {
        // Remove campos que possam conter informações sensíveis
        if (!key.toLowerCase().includes('password') && 
            !key.toLowerCase().includes('token') &&
            !key.toLowerCase().includes('secret')) {
          sanitized[key] = value;
        }
      }
    }
    
    return sanitized;
  }

  // Método específico para enviar dados de avaliação
  static async sendAvaliacaoData(data: WebhookPayload): Promise<WebhookResponse> {
    const webhookUrl = "https://n8n2.flowfieldsai.com/webhook/6a3f7dab-06bf-463f-906d-77e78c62d66e";
    const sanitizedData = this.sanitizeData(data);
    
    console.log('Enviando dados de avaliação para:', webhookUrl);
    
    return await this.sendData(webhookUrl, sanitizedData);
  }

  // Método para resetar contador em caso de necessidade
  static resetRequestCount(): void {
    this.requestCount = 0;
    this.isBlocked = false;
    this.lastRequestTime = 0;
  }

  // Método para verificar status do serviço
  static getServiceStatus(): { isBlocked: boolean; requestCount: number; maxRequests: number; canRequest: boolean } {
    const now = Date.now();
    const canRequest = (now - this.lastRequestTime) >= this.RATE_LIMIT_MS;
    
    return {
      isBlocked: this.isBlocked,
      requestCount: this.requestCount,
      maxRequests: this.MAX_REQUESTS,
      canRequest: canRequest && !this.isBlocked
    };
  }
}
