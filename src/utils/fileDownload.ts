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

    console.log('FileDownloadService.downloadFile - Tipo do conteúdo:', typeof content);
    console.log('FileDownloadService.downloadFile - Conteúdo:', content);

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
      // CORREÇÃO: Converter qualquer outro tipo para string JSON
      console.warn('Conteúdo não é string nem Blob, convertendo para JSON:', content);
      const stringContent = JSON.stringify(content, null, 2);
      blob = new Blob([stringContent], { type: mimeType });
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
    let avaliacaoData: any = null;
    let hasProcessedFile = false;

    // Verificar se é array com output (formato recebido)
    if (Array.isArray(response) && response.length > 0 && response[0].output) {
      content = response[0].output;
      console.log('Conteúdo extraído do array[0].output:', content);
      try {
        avaliacaoData = JSON.parse(content);
        console.log('JSON da avaliação parseado com sucesso:', avaliacaoData);
      } catch (error) {
        console.warn('Não foi possível parsear JSON, tratando como texto:', error);
      }
    }
    // Verificar se tem output direto
    else if (response.output) {
      content = response.output;
      console.log('Conteúdo extraído do response.output:', content);
      try {
        avaliacaoData = JSON.parse(content);
        console.log('JSON da avaliação parseado com sucesso:', avaliacaoData);
      } catch (error) {
        console.warn('Não foi possível parsear JSON, tratando como texto:', error);
      }
    }
    // Verificar estruturas aninhadas
    else if (response.data && Array.isArray(response.data) && response.data[0]?.output) {
      content = response.data[0].output;
      try {
        avaliacaoData = JSON.parse(content);
      } catch (error) {
        console.warn('Não foi possível parsear JSON, tratando como texto:', error);
      }
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

    // Se encontrou dados estruturados, processar para cada formato solicitado
    if (avaliacaoData && !hasProcessedFile) {
      const timestamp = new Date().toISOString().split('T')[0];
      
      for (const formato of formatoSaida) {
        let filename = `avaliacao_${timestamp}`;
        let processedContent: string = '';

        console.log(`Processando formato: ${formato}`);
        console.log('Dados da avaliação:', avaliacaoData);

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
              filename += '.txt'; // Por enquanto, gerar como TXT formatado
              processedContent = this.formatToPdf(avaliacaoData);
              console.warn('PDF solicitado mas gerando TXT formatado para impressão');
              break;
            case 'doc':
              filename += '.txt'; // Por enquanto, gerar como TXT formatado
              processedContent = this.formatToDoc(avaliacaoData);
              console.warn('DOC solicitado mas gerando TXT formatado');
              break;
            default:
              filename += '.txt';
              processedContent = this.formatToText(avaliacaoData);
          }

          console.log(`Conteúdo processado para ${formato}:`, typeof processedContent, processedContent.substring(0, 100) + '...');

          // VALIDAÇÃO: Garantir que processedContent é string
          if (typeof processedContent !== 'string') {
            console.error('ERRO: processedContent não é string:', typeof processedContent, processedContent);
            processedContent = JSON.stringify(processedContent, null, 2);
          }

          await this.downloadFile({
            filename,
            content: processedContent,
            type: formato === 'pdf' || formato === 'doc' ? 'txt' : formato as 'pdf' | 'doc' | 'txt' | 'json'
          });

        } catch (error) {
          console.error(`Erro ao processar formato ${formato}:`, error);
          // Fallback: gerar arquivo de erro
          const errorContent = `ERRO AO PROCESSAR ARQUIVO ${formato.toUpperCase()}\n\nDados recebidos:\n${JSON.stringify(avaliacaoData, null, 2)}`;
          await this.downloadFile({
            filename: `erro_${formato}_${timestamp}.txt`,
            content: errorContent,
            type: 'txt'
          });
        }
      }
    }
    // Se encontrou conteúdo de texto simples, processar como antes
    else if (content && !avaliacaoData && !hasProcessedFile) {
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

  private static formatToText(avaliacaoData: any): string {
    console.log('formatToText - Dados recebidos:', avaliacaoData);
    
    if (!avaliacaoData || typeof avaliacaoData !== 'object') {
      console.error('formatToText - Dados inválidos:', avaliacaoData);
      return `ERRO: Dados de avaliação inválidos\n\nDados recebidos: ${JSON.stringify(avaliacaoData, null, 2)}`;
    }

    let texto = '';
    
    try {
      // Cabeçalho
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

      // Instruções
      if (avaliacaoData.instrucoes && Array.isArray(avaliacaoData.instrucoes) && avaliacaoData.instrucoes.length > 0) {
        texto += 'INSTRUÇÕES:\n\n';
        avaliacaoData.instrucoes.forEach((instrucao: string) => {
          texto += `${instrucao}\n`;
        });
        texto += '\n';
      }

      // Questões
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

      // Gabarito (se incluído)
      if (avaliacaoData.gabarito && Array.isArray(avaliacaoData.gabarito) && avaliacaoData.gabarito.length > 0) {
        texto += 'GABARITO:\n\n';
        avaliacaoData.gabarito.forEach((resposta: any, index: number) => {
          texto += `Questão ${index + 1}: ${resposta}\n`;
        });
        texto += '\n';
      } else if (avaliacaoData.questoes && Array.isArray(avaliacaoData.questoes)) {
        // Gerar gabarito automaticamente se as questões têm resposta_correta
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

      // Metadata
      if (avaliacaoData.metadata) {
        texto += 'INFORMAÇÕES ADICIONAIS:\n\n';
        if (avaliacaoData.metadata.nivel_dificuldade) {
          texto += `Nível de dificuldade: ${avaliacaoData.metadata.nivel_dificuldade}/10\n`;
        }
        if (avaliacaoData.metadata.estilo) {
          texto += `Estilo: ${avaliacaoData.metadata.estilo}\n`;
        }
        if (avaliacaoData.metadata.permite_calculadora !== undefined) {
          texto += `Calculadora: ${avaliacaoData.metadata.permite_calculadora ? 'Permitida' : 'Não permitida'}\n`;
        }
      }

      console.log('formatToText - Texto gerado com sucesso, tamanho:', texto.length);
      return texto;

    } catch (error) {
      console.error('Erro ao formatar texto:', error);
      return `ERRO AO FORMATAR AVALIAÇÃO\n\nDados originais:\n${JSON.stringify(avaliacaoData, null, 2)}`;
    }
  }

  private static formatToPdf(avaliacaoData: any): string {
    // Por enquanto, retorna formato TXT otimizado para impressão
    let texto = this.formatToText(avaliacaoData);
    
    // Adicionar quebras de página e formatação para PDF
    texto = 'AVALIAÇÃO - FORMATO PARA IMPRESSÃO\n' + '='.repeat(50) + '\n\n' + texto;
    
    return texto;
  }

  private static formatToDoc(avaliacaoData: any): string {
    // Por enquanto, retorna formato TXT otimizado para Word
    let texto = this.formatToText(avaliacaoData);
    
    // Adicionar formatação específica para Word
    texto = 'DOCUMENTO DE AVALIAÇÃO\n' + '='.repeat(50) + '\n\n' + texto;
    
    return texto;
  }
}
