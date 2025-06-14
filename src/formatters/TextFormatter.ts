
export class TextFormatter {
  static formatToText(avaliacaoData: any): string {
    if (!avaliacaoData || typeof avaliacaoData !== 'object') {
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
          texto += `QUESTÃO ${questao.numero || (index + 1)}`;
          if (questao.pontuacao) {
            texto += ` (${questao.pontuacao})`;
          }
          texto += '\n';
          texto += '─'.repeat(50) + '\n\n';
          
          texto += `${questao.enunciado}\n\n`;
          
          if (questao.alternativas && Array.isArray(questao.alternativas) && questao.alternativas.length > 0) {
            questao.alternativas.forEach((alt: any) => {
              texto += `${alt.letra?.toUpperCase() || 'A'}) ${alt.texto}\n\n`;
            });
          }
          
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

      return texto;

    } catch (error) {
      return `ERRO AO FORMATAR AVALIAÇÃO\n\nDados originais:\n${JSON.stringify(avaliacaoData, null, 2)}`;
    }
  }
}
