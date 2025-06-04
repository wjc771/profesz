
interface WebhookPayload {
  [key: string]: any;
}

export class WebhookService {
  static async sendData(webhookUrl: string, data: WebhookPayload): Promise<void> {
    if (!webhookUrl) {
      throw new Error("URL do webhook é obrigatória");
    }

    // Validar se a URL é válida
    try {
      new URL(webhookUrl);
    } catch (error) {
      throw new Error("URL do webhook inválida");
    }

    const payload = {
      ...data,
      timestamp: new Date().toISOString(),
      version: "1.0",
      platform: "PROFZi",
      metadata: {
        userAgent: navigator.userAgent,
        source: "avaliacao_form"
      }
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'PROFZi-Webhook/1.0',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
      }

      // Tentar ler a resposta, mas não falhar se não conseguir
      try {
        const responseData = await response.json();
        console.log('Resposta do webhook:', responseData);
      } catch (parseError) {
        // Ignora erro de parsing da resposta
        console.log('Webhook enviado com sucesso (resposta não é JSON)');
      }

    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error("Erro de conexão. Verifique sua internet e tente novamente.");
      }
      throw error;
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
    // Remove campos vazios e sanitiza dados sensíveis
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
  static async sendAvaliacaoData(data: WebhookPayload): Promise<void> {
    const webhookUrl = "https://n8n2.flowfieldsai.com/webhook/6a3f7dab-06bf-463f-906d-77e78c62d66e";
    const sanitizedData = this.sanitizeData(data);
    await this.sendData(webhookUrl, sanitizedData);
  }
}
