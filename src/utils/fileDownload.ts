
export interface FileDownloadOptions {
  filename: string;
  content: string | Blob;
  type: 'pdf' | 'doc' | 'txt' | 'json';
  actualContentType?: 'text' | 'binary';
}

export class FileDownloadService {
  static async downloadFile({ filename, content, type, actualContentType = 'text' }: FileDownloadOptions): Promise<void> {
    let blob: Blob;
    let mimeType: string;
    let finalFilename = filename;

    // Determine the actual MIME type based on content, not requested type
    if (actualContentType === 'text' || typeof content === 'string') {
      // For text content, always use text MIME types regardless of requested format
      switch (type) {
        case 'json':
          mimeType = 'application/json;charset=utf-8';
          break;
        case 'txt':
        case 'pdf':
        case 'doc':
        default:
          mimeType = 'text/plain;charset=utf-8';
          // Ensure filename has .txt extension for text content
          if (type === 'pdf' || type === 'doc') {
            finalFilename = filename.replace(/\.(pdf|doc|docx)$/, '.txt');
            if (!finalFilename.endsWith('.txt')) {
              finalFilename += '.txt';
            }
          }
          break;
      }
    } else {
      // For binary content (future PDF generation)
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
    }

    console.log('FileDownloadService.downloadFile - Configuração:', {
      originalFilename: filename,
      finalFilename,
      requestedType: type,
      actualContentType,
      mimeType,
      contentType: typeof content
    });

    if (content instanceof Blob) {
      blob = content;
    } else if (typeof content === 'string') {
      // Add BOM for UTF-8 text files to ensure proper encoding
      const bom = '\uFEFF';
      const textContent = type === 'txt' ? bom + content : content;
      blob = new Blob([textContent], { type: mimeType });
    } else {
      // Convert any other type to JSON string
      console.warn('Conteúdo não é string nem Blob, convertendo para JSON:', content);
      const stringContent = JSON.stringify(content, null, 2);
      blob = new Blob([stringContent], { type: 'application/json;charset=utf-8' });
      finalFilename = filename.replace(/\.[^.]+$/, '.json');
    }

    // Use native browser download
    this.triggerNativeDownload(blob, finalFilename);
  }

  private static triggerNativeDownload(blob: Blob, filename: string): void {
    console.log('Iniciando download:', { filename, size: blob.size, type: blob.type });
    
    // Use the standard download approach that works across all browsers
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Add to DOM temporarily and trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Download concluído:', filename);
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
    
    // Extract content from webhook response
    let content = '';
    let avaliacaoData: any = null;
    let hasProcessedFile = false;

    // Check various response structures
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

    // Process structured data for each requested format
    if (avaliacaoData && !hasProcessedFile) {
      const timestamp = new Date().toISOString().split('T')[0];
      
      for (const formato of formatoSaida) {
        let filename = `avaliacao_${timestamp}`;
        let processedContent: string = '';
        let actualContentType: 'text' | 'binary' = 'text';

        console.log(`Processando formato: ${formato}`);

        try {
          switch (formato) {
            case 'txt':
              filename += '.txt';
              processedContent = this.formatToText(avaliacaoData);
              break;
            case 'json':
              filename += '.json';
              processedContent = JSON.stringify(avaliacaoData, null, 2);
              break;
            case 'pdf':
              // Generate text content but inform user it's not a real PDF
              filename += '.txt'; // Use .txt extension for text content
              processedContent = this.formatToPdfText(avaliacaoData);
              console.log('PDF solicitado - gerando texto formatado como .txt');
              break;
            case 'doc':
              // Generate text content but inform user it's not a real DOC
              filename += '.txt'; // Use .txt extension for text content
              processedContent = this.formatToDocText(avaliacaoData);
              console.log('DOC solicitado - gerando texto formatado como .txt');
              break;
            default:
              filename += '.txt';
              processedContent = this.formatToText(avaliacaoData);
          }

          // Validate that processedContent is a string
          if (typeof processedContent !== 'string') {
            console.error('ERRO: processedContent não é string:', typeof processedContent, processedContent);
            processedContent = JSON.stringify(processedContent, null, 2);
          }

          await this.downloadFile({
            filename,
            content: processedContent,
            type: formato as 'pdf' | 'doc' | 'txt' | 'json',
            actualContentType
          });

        } catch (error) {
          console.error(`Erro ao processar formato ${formato}:`, error);
          // Generate error file
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
    // Handle simple text content
    else if (content && !avaliacaoData && !hasProcessedFile) {
      for (const formato of formatoSaida) {
        const timestamp = new Date().toISOString().split('T')[0];
        let filename = `avaliacao_${timestamp}`;
        let processedContent = content;

        switch (formato) {
          case 'txt':
            filename += '.txt';
            break;
          case 'json':
            filename += '.json';
            processedContent = JSON.stringify({
              titulo: "Avaliação Gerada",
              data_criacao: new Date().toISOString(),
              conteudo: content,
              formato_original: "texto"
            }, null, 2);
            break;
          case 'pdf':
          case 'doc':
            filename += '.txt'; // Use .txt for text content
            processedContent = `AVISO: Este arquivo contém texto da avaliação.\nPara ${formato.toUpperCase()} formatado, utilize ferramentas de conversão.\n\n${content}`;
            console.warn(`${formato.toUpperCase()} solicitado mas gerando texto - salvando como .txt`);
            break;
          default:
            filename += '.txt';
        }

        await this.downloadFile({
          filename,
          content: processedContent,
          type: formato as 'pdf' | 'doc' | 'txt' | 'json',
          actualContentType: 'text'
        });
      }
    }

    // Fallback: convert entire response to JSON
    if (!content && !hasProcessedFile) {
      const format = formatoSaida.includes('json') ? 'json' : 'txt';
      const timestamp = new Date().toISOString().split('T')[0];
      const responseContent = format === 'json' ? JSON.stringify(response, null, 2) : String(response);
      
      await this.downloadFile({
        filename: `resposta_webhook_${timestamp}.${format}`,
        content: responseContent,
        type: format as 'pdf' | 'doc' | 'txt' | 'json',
        actualContentType: 'text'
      });
    }
  }

  private static formatToText(avaliacaoData: any): string {
    console.log('formatToText - Dados recebidos:', avaliacaoData);
    
    if (!avaliacaoData || typeof avaliacaoData !== 'object') {
      console.error('formatToText - Dados inválidos:', avaliacaoData);
      return `ERRO: Dados de avaliação inválidos\n\nDados recebidos: ${JSON.stringify(avaliacaoData, null, 2)}`;
    }

    let texto = '';
    
    try {
      // Header
      if (avaliacaoData.cabecalho) {
        texto += 'CABEÇALHO:\n\n';
        texto += 'ESCOLA: _________________________________\n';
        texto += `DISCIPLINA: ${avaliacaoData.cabecalho.disciplina || 'Não informada'}\n`;
        texto += `UNIDADE: ${avaliacaoData.cabecalho.unidade || 'Não informada'}`;
        if (avaliacaoData.cabecalho.capitulo) {
          texto += ` - CAPÍTULO: ${avaliacaoData.cabecalho.capitulo}`;
        }
        texto += '\n';
        texto += `TEMA: ${avaliacaoData.cabecalho.tema || 'Não informado'}\n`;
        texto += 'ALUNO: _________________________________\n';
        texto += 'DATA: ___/___/______\n';
        texto += `DURAÇÃO: ${avaliacaoData.cabecalho.duracao || avaliacaoData.metadata?.tempo_total + ' minutos' || 'Não informada'}\n\n`;
      }

      // Instructions
      if (avaliacaoData.instrucoes && Array.isArray(avaliacaoData.instrucoes) && avaliacaoData.instrucoes.length > 0) {
        texto += 'INSTRUÇÕES:\n\n';
        avaliacaoData.instrucoes.forEach((instrucao: string) => {
          texto += `${instrucao}\n`;
        });
        texto += '\n';
      }

      // Questions
      if (avaliacaoData.questoes && Array.isArray(avaliacaoData.questoes) && avaliacaoData.questoes.length > 0) {
        texto += 'QUESTÕES:\n\n';
        
        avaliacaoData.questoes.forEach((questao: any) => {
          texto += `QUESTÃO ${questao.numero} (${questao.pontuacao})\n`;
          texto += `${questao.enunciado}\n`;
          
          if (questao.alternativas && Array.isArray(questao.alternativas) && questao.alternativas.length > 0) {
            questao.alternativas.forEach((alt: any) => {
              texto += `${alt.letra}) ${alt.texto}\n`;
            });
          }
          
          texto += '\n__________\n\n';
        });
      }

      // Answer key
      if (avaliacaoData.gabarito && Array.isArray(avaliacaoData.gabarito) && avaliacaoData.gabarito.length > 0) {
        texto += 'GABARITO:\n\n';
        avaliacaoData.gabarito.forEach((resposta: any, index: number) => {
          texto += `Questão ${index + 1}: ${resposta}\n`;
        });
        texto += '\n';
      } else if (avaliacaoData.questoes && Array.isArray(avaliacaoData.questoes)) {
        const respostas = avaliacaoData.questoes
          .filter((q: any) => q.resposta_correta)
          .map((q: any) => `Questão ${q.numero}: ${q.resposta_correta}`);
        
        if (respostas.length > 0) {
          texto += 'GABARITO:\n\n';
          respostas.forEach((resposta: string) => {
            texto += `${resposta}\n`;
          });
          texto += '\n';
        }
      }

      return texto;

    } catch (error) {
      console.error('Erro ao formatar texto:', error);
      return `ERRO AO FORMATAR AVALIAÇÃO\n\nDados originais:\n${JSON.stringify(avaliacaoData, null, 2)}`;
    }
  }

  private static formatToPdfText(avaliacaoData: any): string {
    let texto = this.formatToText(avaliacaoData);
    
    // Add PDF-specific formatting notice
    texto = 'AVALIAÇÃO - FORMATO TEXTO PARA IMPRESSÃO\n' + 
            'AVISO: Este é um arquivo de texto formatado (.txt)\n' +
            'Para gerar PDF real, utilize ferramentas de conversão online\n' +
            '='.repeat(60) + '\n\n' + texto;
    
    return texto;
  }

  private static formatToDocText(avaliacaoData: any): string {
    let texto = this.formatToText(avaliacaoData);
    
    // Add DOC-specific formatting notice
    texto = 'DOCUMENTO DE AVALIAÇÃO - FORMATO TEXTO\n' + 
            'AVISO: Este é um arquivo de texto formatado (.txt)\n' +
            'Para gerar Word real, utilize ferramentas de conversão online\n' +
            '='.repeat(60) + '\n\n' + texto;
    
    return texto;
  }
}
