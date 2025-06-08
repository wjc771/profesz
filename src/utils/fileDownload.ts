
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

    // Definir MIME types corretos para cada formato
    switch (type) {
      case 'pdf':
        mimeType = 'application/pdf';
        if (!finalFilename.endsWith('.pdf')) {
          finalFilename = filename.replace(/\.[^.]+$/, '.pdf') || filename + '.pdf';
        }
        break;
      case 'doc':
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        if (!finalFilename.endsWith('.docx')) {
          finalFilename = filename.replace(/\.[^.]+$/, '.docx') || filename + '.docx';
        }
        break;
      case 'json':
        mimeType = 'application/json;charset=utf-8';
        if (!finalFilename.endsWith('.json')) {
          finalFilename = filename.replace(/\.[^.]+$/, '.json') || filename + '.json';
        }
        break;
      case 'txt':
      default:
        mimeType = 'text/plain;charset=utf-8';
        if (!finalFilename.endsWith('.txt')) {
          finalFilename = filename.replace(/\.[^.]+$/, '.txt') || filename + '.txt';
        }
        break;
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
      // Para PDF e DOC, usar UTF-8 BOM para compatibilidade
      const bom = type === 'pdf' || type === 'doc' ? '\uFEFF' : '';
      const textContent = bom + content;
      blob = new Blob([textContent], { type: mimeType });
    } else {
      console.warn('Conteúdo não é string nem Blob, convertendo para JSON:', content);
      const stringContent = JSON.stringify(content, null, 2);
      blob = new Blob([stringContent], { type: 'application/json;charset=utf-8' });
      finalFilename = filename.replace(/\.[^.]+$/, '.json');
    }

    this.triggerNativeDownload(blob, finalFilename);
  }

  private static triggerNativeDownload(blob: Blob, filename: string): void {
    console.log('Iniciando download:', { filename, size: blob.size, type: blob.type });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('Download concluído:', filename);
  }

  static async processWebhookResponse(response: any, formatoSaida: string[]): Promise<void> {
    console.log('Processando resposta do webhook para download:', response);
    
    let content = '';
    let avaliacaoData: any = null;
    let hasProcessedFile = false;

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
              processedContent = this.formatToText(avaliacaoData);
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
              processedContent = this.formatToText(avaliacaoData);
          }

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
    // Tratar conteúdo simples de texto
    else if (content && !avaliacaoData && !hasProcessedFile) {
      for (const formato of formatoSaida) {
        const timestamp = new Date().toISOString().split('T')[0];
        let filename = `avaliacao_${timestamp}`;
        let processedContent = content;

        switch (formato) {
          case 'txt':
            break;
          case 'json':
            processedContent = JSON.stringify({
              titulo: "Avaliação Gerada",
              data_criacao: new Date().toISOString(),
              conteudo: content,
              formato_original: "texto"
            }, null, 2);
            break;
          case 'pdf':
          case 'doc':
            processedContent = this.formatForOfficeApp(content, formato);
            break;
          default:
            break;
        }

        await this.downloadFile({
          filename,
          content: processedContent,
          type: formato as 'pdf' | 'doc' | 'txt' | 'json',
          actualContentType: 'text'
        });
      }
    }

    // Fallback
    if (!content && !hasProcessedFile) {
      const format = formatoSaida.includes('json') ? 'json' : 'txt';
      const timestamp = new Date().toISOString().split('T')[0];
      const responseContent = format === 'json' ? JSON.stringify(response, null, 2) : String(response);
      
      await this.downloadFile({
        filename: `resposta_webhook_${timestamp}`,
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
      // Cabeçalho formatado
      if (avaliacaoData.cabecalho) {
        texto += '═'.repeat(80) + '\n';
        texto += '                           AVALIAÇÃO\n';
        texto += '═'.repeat(80) + '\n\n';
        
        texto += 'ESCOLA: ________________________________________________\n\n';
        texto += `DISCIPLINA: ${avaliacaoData.cabecalho.disciplina || 'Não informada'}\n`;
        texto += `UNIDADE: ${avaliacaoData.cabecalho.unidade || 'Não informada'}`;
        if (avaliacaoData.cabecalho.capitulo) {
          texto += ` - CAPÍTULO: ${avaliacaoData.cabecalho.capitulo}`;
        }
        texto += '\n';
        texto += `TEMA: ${avaliacaoData.cabecalho.tema || 'Não informado'}\n`;
        texto += `DURAÇÃO: ${avaliacaoData.cabecalho.duracao || avaliacaoData.metadata?.tempo_total + ' minutos' || 'Não informada'}\n\n`;
        texto += 'ALUNO: ________________________________________________\n';
        texto += 'DATA: _____ / _____ / __________     TURMA: __________\n\n';
        texto += '═'.repeat(80) + '\n\n';
      }

      // Instruções
      if (avaliacaoData.instrucoes && Array.isArray(avaliacaoData.instrucoes) && avaliacaoData.instrucoes.length > 0) {
        texto += 'INSTRUÇÕES:\n\n';
        avaliacaoData.instrucoes.forEach((instrucao: string, index: number) => {
          texto += `${index + 1}. ${instrucao}\n`;
        });
        texto += '\n' + '─'.repeat(80) + '\n\n';
      }

      // Questões
      if (avaliacaoData.questoes && Array.isArray(avaliacaoData.questoes) && avaliacaoData.questoes.length > 0) {
        texto += 'QUESTÕES:\n\n';
        
        avaliacaoData.questoes.forEach((questao: any, index: number) => {
          // Cabeçalho da questão
          texto += `QUESTÃO ${questao.numero || (index + 1)}`;
          if (questao.pontuacao) {
            texto += ` (${questao.pontuacao})`;
          }
          texto += '\n';
          texto += '─'.repeat(50) + '\n\n';
          
          // Enunciado
          texto += `${questao.enunciado}\n\n`;
          
          // Alternativas
          if (questao.alternativas && Array.isArray(questao.alternativas) && questao.alternativas.length > 0) {
            questao.alternativas.forEach((alt: any) => {
              texto += `${alt.letra?.toUpperCase() || 'A'}) ${alt.texto}\n\n`;
            });
          }
          
          // Espaço para resposta
          texto += 'RESPOSTA: ___________\n\n';
          texto += '═'.repeat(80) + '\n\n';
        });
      }

      // Gabarito
      if (avaliacaoData.gabarito && Array.isArray(avaliacaoData.gabarito) && avaliacaoData.gabarito.length > 0) {
        texto += '\n' + '═'.repeat(80) + '\n';
        texto += '                            GABARITO\n';
        texto += '═'.repeat(80) + '\n\n';
        avaliacaoData.gabarito.forEach((resposta: any) => {
          if (typeof resposta === 'string') {
            texto += `${resposta}\n`;
          } else {
            texto += `Questão ${resposta.questao}: ${resposta.resposta?.toUpperCase()} - ${resposta.explicacao || ''}\n`;
          }
        });
      }

      // Informações finais
      if (avaliacaoData.metadata) {
        texto += '\n' + '─'.repeat(80) + '\n';
        texto += 'INFORMAÇÕES DA AVALIAÇÃO:\n';
        texto += `Total de questões: ${avaliacaoData.metadata.total_questoes || avaliacaoData.questoes?.length || 0}\n`;
        texto += `Nível de dificuldade: ${avaliacaoData.metadata.nivel_dificuldade || 'Não informado'}\n`;
        texto += `Estilo: ${avaliacaoData.metadata.estilo || 'Não informado'}\n`;
        texto += `Calculadora permitida: ${avaliacaoData.metadata.permite_calculadora ? 'Sim' : 'Não'}\n`;
        texto += `Tempo sugerido: ${avaliacaoData.metadata.tempo_total || 'Não informado'} minutos\n`;
      }

      return texto;

    } catch (error) {
      console.error('Erro ao formatar texto:', error);
      return `ERRO AO FORMATAR AVALIAÇÃO\n\nDados originais:\n${JSON.stringify(avaliacaoData, null, 2)}`;
    }
  }

  private static formatToPdfContent(avaliacaoData: any): string {
    // Para PDF, criar um conteúdo mais formatado que pode ser interpretado por leitores de PDF
    let content = this.formatToText(avaliacaoData);
    
    // Adicionar metadata específica para PDF
    const pdfMetadata = `%PDF Formatted Content
%Creator: PROFZi Platform
%Title: Avaliação ${avaliacaoData.cabecalho?.disciplina || 'Acadêmica'}
%Subject: ${avaliacaoData.cabecalho?.tema || 'Avaliação'}
%Keywords: avaliacao, educacao, questoes

`;
    
    return pdfMetadata + content;
  }

  private static formatToDocContent(avaliacaoData: any): string {
    // Para DOC, criar um conteúdo estruturado que pode ser interpretado pelo Word
    let content = this.formatToText(avaliacaoData);
    
    // Adicionar estrutura RTF básica para melhor compatibilidade
    const docHeader = `{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}
\\f0\\fs24 
`;
    const docFooter = `}`;
    
    // Escapar caracteres especiais para RTF
    content = content.replace(/\\/g, '\\\\')
                   .replace(/\{/g, '\\{')
                   .replace(/\}/g, '\\}')
                   .replace(/\n/g, '\\par ');
    
    return docHeader + content + docFooter;
  }

  private static formatForOfficeApp(content: string, format: string): string {
    if (format === 'pdf') {
      return `%PDF Formatted Content\n%Title: Avaliação\n\n${content}`;
    } else if (format === 'doc') {
      return `{\\rtf1\\ansi {\\fonttbl {\\f0 Times New Roman;}}\\f0\\fs24 ${content.replace(/\n/g, '\\par ')}}`;
    }
    return content;
  }
}
