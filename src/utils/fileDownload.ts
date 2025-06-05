
export interface FileDownloadOptions {
  filename: string;
  content: string | Blob;
  type: 'pdf' | 'doc' | 'txt' | 'json';
}

export class FileDownloadService {
  static async downloadFile({ filename, content, type }: FileDownloadOptions): Promise<void> {
    let blob: Blob;
    let mimeType: string;

    switch (type) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'doc':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      case 'txt':
        mimeType = 'text/plain;charset=utf-8';
        break;
      case 'json':
        mimeType = 'application/json;charset=utf-8';
        break;
      default:
        mimeType = 'application/octet-stream';
    }

    if (content instanceof Blob) {
      blob = content;
    } else if (typeof content === 'string') {
      // Verificar se é base64
      if (this.isBase64(content)) {
        try {
          const binaryString = atob(content);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          blob = new Blob([bytes], { type: mimeType });
        } catch (error) {
          console.error('Erro ao decodificar base64:', error);
          blob = new Blob([content], { type: mimeType });
        }
      } else {
        // Para texto simples, incluir BOM UTF-8 se necessário
        const bom = '\uFEFF';
        const textContent = type === 'txt' ? bom + content : content;
        blob = new Blob([textContent], { type: mimeType });
      }
    } else {
      blob = new Blob([String(content)], { type: mimeType });
    }

    // Usar a API nativa do browser para download
    this.triggerNativeDownload(blob, filename);
  }

  private static triggerNativeDownload(blob: Blob, filename: string): void {
    // Verificar se o browser suporta a API de download
    if ('showSaveFilePicker' in window) {
      // Usar a API moderna de file system
      this.modernDownload(blob, filename);
    } else {
      // Fallback para método tradicional
      this.legacyDownload(blob, filename);
    }
  }

  private static async modernDownload(blob: Blob, filename: string): Promise<void> {
    try {
      const extension = filename.split('.').pop()?.toLowerCase() || 'txt';
      const acceptTypes: Record<string, string[]> = {
        'pdf': ['.pdf'],
        'doc': ['.doc', '.docx'],
        'txt': ['.txt'],
        'json': ['.json']
      };

      // @ts-ignore - API experimental
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Arquivos de avaliação',
          accept: {
            'application/pdf': acceptTypes.pdf,
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': acceptTypes.doc,
            'text/plain': acceptTypes.txt,
            'application/json': acceptTypes.json
          }
        }]
      });

      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
      
      console.log('Arquivo salvo usando API moderna:', filename);
    } catch (error) {
      console.log('Usuário cancelou o download ou erro na API moderna, usando método tradicional');
      this.legacyDownload(blob, filename);
    }
  }

  private static legacyDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Adicionar ao DOM temporariamente
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Arquivo baixado usando método tradicional:', filename);
  }

  private static isBase64(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  }

  static async processWebhookResponse(response: any, formatoSaida: string[]): Promise<void> {
    console.log('Processando resposta do webhook para download:', response);
    
    // Extrair conteúdo do webhook baseado na estrutura real
    let content = '';
    let hasProcessedFile = false;

    // Verificar se é array com output (formato recebido)
    if (Array.isArray(response) && response.length > 0 && response[0].output) {
      content = response[0].output;
    }
    // Verificar se tem output direto
    else if (response.output) {
      content = response.output;
    }
    // Verificar estruturas aninhadas
    else if (response.data && Array.isArray(response.data) && response.data[0]?.output) {
      content = response.data[0].output;
    }
    // Verificar outras estruturas possíveis
    else if (response.files && Array.isArray(response.files)) {
      // Estrutura com array de arquivos
      for (const file of response.files) {
        if (formatoSaida.includes(file.format)) {
          await this.downloadFile({
            filename: file.filename || `avaliacao.${file.format}`,
            content: file.content,
            type: file.format as 'pdf' | 'doc' | 'txt' | 'json'
          });
          hasProcessedFile = true;
        }
      }
    }
    else if (response.data && response.data.files) {
      // Estrutura aninhada em data
      for (const file of response.data.files) {
        if (formatoSaida.includes(file.format)) {
          await this.downloadFile({
            filename: file.filename || `avaliacao.${file.format}`,
            content: file.content,
            type: file.format as 'pdf' | 'doc' | 'txt' | 'json'
          });
          hasProcessedFile = true;
        }
      }
    }

    // Se encontrou conteúdo de texto, processar para cada formato solicitado
    if (content && !hasProcessedFile) {
      for (const formato of formatoSaida) {
        const timestamp = new Date().toISOString().split('T')[0];
        let filename = `avaliacao_${timestamp}`;
        let processedContent = content;

        switch (formato) {
          case 'txt':
            filename += '.txt';
            // Manter formatação original do texto
            break;
          case 'json':
            filename += '.json';
            // Converter para JSON estruturado
            processedContent = JSON.stringify({
              titulo: "Avaliação Gerada",
              data_criacao: new Date().toISOString(),
              conteudo: content,
              formato_original: "texto"
            }, null, 2);
            break;
          case 'pdf':
            // Para PDF, o ideal seria converter o texto para um PDF real
            // Por enquanto, vamos alertar que é texto simples
            filename += '.txt';
            processedContent = `AVISO: Este arquivo contém o texto da avaliação. Para um PDF formatado, utilize ferramentas de conversão.\n\n${content}`;
            console.warn('PDF solicitado mas recebido texto simples. Salvando como .txt');
            break;
          case 'doc':
            // Para DOC, similar ao PDF
            filename += '.txt';
            processedContent = `AVISO: Este arquivo contém o texto da avaliação. Para um documento Word formatado, utilize ferramentas de conversão.\n\n${content}`;
            console.warn('DOC solicitado mas recebido texto simples. Salvando como .txt');
            break;
          default:
            filename += '.txt';
        }

        await this.downloadFile({
          filename,
          content: processedContent,
          type: formato === 'pdf' || formato === 'doc' ? 'txt' : formato as 'pdf' | 'doc' | 'txt' | 'json'
        });
      }
    }

    // Se não conseguiu processar nada, tentar converter a resposta inteira
    if (!content && !hasProcessedFile) {
      const format = formatoSaida.includes('json') ? 'json' : formatoSaida[0] || 'txt';
      const timestamp = new Date().toISOString().split('T')[0];
      const responseContent = format === 'json' ? JSON.stringify(response, null, 2) : String(response);
      
      await this.downloadFile({
        filename: `resposta_webhook_${timestamp}.${format}`,
        content: responseContent,
        type: format as 'pdf' | 'doc' | 'txt' | 'json'
      });
    }
  }
}
