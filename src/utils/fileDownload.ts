
import { FileDownloader } from "@/services/FileDownloader";
import { FileDownloadOptions } from "@/services/types";
import { TextFormatter } from "@/formatters/TextFormatter";

export class FileDownloadService {
  static async downloadFile(options: FileDownloadOptions): Promise<void> {
    return FileDownloader.downloadFile(options);
  }

  static async processWebhookResponse(response: any, formatoSaida: string[]): Promise<void> {
    let content = '';
    let avaliacaoData: any = null;

    // Processar estrutura do webhook
    if (Array.isArray(response) && response.length > 0 && response[0].output) {
      content = response[0].output;
      try {
        avaliacaoData = JSON.parse(content);
      } catch (error) {
        console.warn('Não foi possível parsear JSON, tratando como texto:', error);
      }
    } else if (response.output) {
      content = response.output;
      try {
        avaliacaoData = JSON.parse(content);
      } catch (error) {
        console.warn('Não foi possível parsear JSON, tratando como texto:', error);
      }
    } else if (response.data && Array.isArray(response.data) && response.data[0]?.output) {
      content = response.data[0].output;
      try {
        avaliacaoData = JSON.parse(content);
      } catch (error) {
        console.warn('Não foi possível parsear JSON, tratando como texto:', error);
      }
    }

    // Processar dados estruturados
    if (avaliacaoData) {
      const timestamp = new Date().toISOString().split('T')[0];
      
      for (const formato of formatoSaida) {
        let filename = `avaliacao_${timestamp}`;
        let processedContent: string = '';

        try {
          switch (formato) {
            case 'txt':
              processedContent = TextFormatter.formatToText(avaliacaoData);
              break;
            case 'json':
              processedContent = JSON.stringify(avaliacaoData, null, 2);
              break;
            case 'pdf':
              processedContent = this.formatToPdfContent(avaliacaoData);
              break;
            case 'doc':
              processedContent = this.formatToDocContent(avaliacaoData);
              break;
            default:
              processedContent = TextFormatter.formatToText(avaliacaoData);
          }

          await this.downloadFile({
            filename,
            content: processedContent,
            type: formato as 'pdf' | 'doc' | 'txt' | 'json',
            actualContentType: 'text'
          });

        } catch (error) {
          console.error(`Erro ao processar formato ${formato}:`, error);
          const errorContent = `ERRO AO PROCESSAR ARQUIVO ${formato.toUpperCase()}\n\nDados recebidos:\n${JSON.stringify(avaliacaoData, null, 2)}`;
          await this.downloadFile({
            filename: `erro_${formato}_${timestamp}.txt`,
            content: errorContent,
            type: 'txt',
            actualContentType: 'text'
          });
        }
      }
    }
  }

  private static formatToPdfContent(avaliacaoData: any): string {
    let content = TextFormatter.formatToText(avaliacaoData);
    
    const pdfMetadata = `%PDF Formatted Content
%Creator: PROFZi Platform
%Title: Avaliação ${avaliacaoData.cabecalho?.disciplina || 'Acadêmica'}
%Subject: ${avaliacaoData.cabecalho?.tema || 'Avaliação'}
%Keywords: avaliacao, educacao, questoes

`;
    
    return pdfMetadata + content;
  }

  private static formatToDocContent(avaliacaoData: any): string {
    let content = TextFormatter.formatToText(avaliacaoData);
    
    const docHeader = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 
`;
    const docFooter = `}`;
    
    content = content.replace(/\\/g, '\\\\')
                   .replace(/\{/g, '\\{')
                   .replace(/\}/g, '\\}')
                   .replace(/\n/g, '\\par ');
    
    return docHeader + content + docFooter;
  }
}
