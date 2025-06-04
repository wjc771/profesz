
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
        mimeType = 'text/plain';
        break;
      case 'json':
        mimeType = 'application/json';
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
        blob = new Blob([content], { type: mimeType });
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
      // @ts-ignore - API experimental
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'Arquivos de avaliação',
          accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'text/plain': ['.txt'],
            'application/json': ['.json']
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
    
    // Verificar diferentes estruturas de resposta
    if (response.files && Array.isArray(response.files)) {
      // Estrutura com array de arquivos
      for (const file of response.files) {
        if (formatoSaida.includes(file.format)) {
          await this.downloadFile({
            filename: file.filename || `avaliacao.${file.format}`,
            content: file.content,
            type: file.format as 'pdf' | 'doc' | 'txt' | 'json'
          });
        }
      }
    } else if (response.data && response.data.files) {
      // Estrutura aninhada em data
      for (const file of response.data.files) {
        if (formatoSaida.includes(file.format)) {
          await this.downloadFile({
            filename: file.filename || `avaliacao.${file.format}`,
            content: file.content,
            type: file.format as 'pdf' | 'doc' | 'txt' | 'json'
          });
        }
      }
    } else if (response.content || response.data) {
      // Resposta com conteúdo direto
      const content = response.content || response.data;
      const format = formatoSaida[0] || 'pdf';
      
      await this.downloadFile({
        filename: `avaliacao_${new Date().toISOString().split('T')[0]}.${format}`,
        content: content,
        type: format as 'pdf' | 'doc' | 'txt' | 'json'
      });
    } else if (response.pdf || response.doc || response.txt || response.json) {
      // Resposta com propriedades específicas por formato
      for (const formato of formatoSaida) {
        if (response[formato]) {
          await this.downloadFile({
            filename: `avaliacao_${new Date().toISOString().split('T')[0]}.${formato}`,
            content: response[formato],
            type: formato as 'pdf' | 'doc' | 'txt' | 'json'
          });
        }
      }
    } else {
      // Tentar converter a resposta inteira em JSON
      const format = formatoSaida.includes('json') ? 'json' : formatoSaida[0] || 'txt';
      const content = format === 'json' ? JSON.stringify(response, null, 2) : String(response);
      
      await this.downloadFile({
        filename: `avaliacao_${new Date().toISOString().split('T')[0]}.${format}`,
        content: content,
        type: format as 'pdf' | 'doc' | 'txt' | 'json'
      });
    }
  }
}
