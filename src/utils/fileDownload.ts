
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
    } else {
      blob = new Blob([content], { type: mimeType });
    }

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async processWebhookResponse(response: any, formatoSaida: string[]): Promise<void> {
    console.log('Processing webhook response:', response);
    
    // Check if response contains file data
    if (response.files && Array.isArray(response.files)) {
      for (const file of response.files) {
        if (formatoSaida.includes(file.format)) {
          await this.downloadFile({
            filename: file.filename || `avaliacao.${file.format}`,
            content: file.content,
            type: file.format as 'pdf' | 'doc' | 'txt' | 'json'
          });
        }
      }
    } else if (response.content) {
      // Fallback for single file response
      const format = formatoSaida[0] || 'pdf';
      await this.downloadFile({
        filename: `avaliacao_${new Date().toISOString().split('T')[0]}.${format}`,
        content: response.content,
        type: format as 'pdf' | 'doc' | 'txt' | 'json'
      });
    }
  }
}
