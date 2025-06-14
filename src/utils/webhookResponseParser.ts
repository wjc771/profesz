
export function parseWebhookResponse(response: any, formValues: any) {
  console.log('=== ANÁLISE DA RESPOSTA DO WEBHOOK ===');
  console.log('Resposta completa recebida:', JSON.stringify(response, null, 2));
  
  const debugData = {
    originalResponse: response,
    responseType: typeof response,
    isArray: Array.isArray(response),
    keys: response && typeof response === 'object' ? Object.keys(response) : [],
    timestamp: new Date().toISOString()
  };
  
  try {
    if (!response) {
      throw new Error('Resposta vazia do servidor');
    }

    let outputText = null;

    // Estruturas principais de resposta
    const structures = [
      () => Array.isArray(response) && response.length > 0 && response[0]?.output ? response[0].output : null,
      () => response.success && response.data && Array.isArray(response.data) && response.data[0]?.output ? response.data[0].output : null,
      () => response.output ? response.output : null,
      () => response.data?.output ? response.data.output : null,
      () => response["0"]?.output ? response["0"].output : null,
      () => response[0]?.output ? response[0].output : null,
      () => typeof response === 'string' ? response : null,
      () => response.avaliacao ? JSON.stringify(response.avaliacao) : null
    ];

    for (const structure of structures) {
      outputText = structure();
      if (outputText) break;
    }
    
    if (!outputText) {
      throw new Error(`Estrutura de resposta inválida. Recebido: ${JSON.stringify(response, null, 2)}`);
    }

    // Parse do JSON
    let avaliacaoData;
    try {
      avaliacaoData = typeof outputText === 'string' ? JSON.parse(outputText) : outputText;
    } catch (parseError) {
      throw new Error(`JSON inválido no campo output: ${parseError.message}`);
    }
    
    // Validar estrutura básica
    if (!avaliacaoData.questoes || !Array.isArray(avaliacaoData.questoes) || avaliacaoData.questoes.length === 0) {
      throw new Error('Dados de avaliação inválidos - questões ausentes ou vazias');
    }

    // Validar questões
    const questoesValidadas = avaliacaoData.questoes.map((questao: any, index: number) => {
      if (!questao.enunciado) {
        throw new Error(`Questão ${index + 1} não possui enunciado`);
      }
      
      if (!questao.alternativas || !Array.isArray(questao.alternativas) || questao.alternativas.length === 0) {
        throw new Error(`Questão ${index + 1} não possui alternativas válidas`);
      }

      return {
        numero: questao.numero || (index + 1),
        pontuacao: questao.pontuacao || '1,0 ponto',
        enunciado: questao.enunciado,
        tipo: questao.tipo || 'multipla_escolha',
        alternativas: questao.alternativas.map((alt: any) => ({
          letra: alt.letra || 'a',
          texto: alt.texto || 'Alternativa'
        })),
        resposta_correta: questao.resposta_correta || 'a'
      };
    });

    // Montar objeto final validado
    const avaliacaoValidada = {
      cabecalho: {
        disciplina: avaliacaoData.cabecalho?.disciplina || formValues.materia || 'Disciplina',
        unidade: avaliacaoData.cabecalho?.unidade || formValues.unidade || 'Unidade',
        capitulo: avaliacaoData.cabecalho?.capitulo || formValues.capitulos?.[0] || '',
        tema: avaliacaoData.cabecalho?.tema || formValues.temas?.[0] || 'Tema',
        duracao: avaliacaoData.cabecalho?.duracao || `${formValues.duracaoSugerida || 60} minutos`
      },
      instrucoes: Array.isArray(avaliacaoData.instrucoes) 
        ? avaliacaoData.instrucoes 
        : [
            'Leia atentamente cada questão antes de responder.',
            'Marque apenas uma alternativa por questão.',
            'Use caneta azul ou preta para responder.'
          ],
      questoes: questoesValidadas,
      metadata: {
        total_questoes: questoesValidadas.length,
        nivel_dificuldade: avaliacaoData.metadata?.nivel_dificuldade || formValues.nivelDificuldade || 5,
        estilo: avaliacaoData.metadata?.estilo || formValues.estiloQuestoes || 'conceitual',
        permite_calculadora: avaliacaoData.metadata?.permite_calculadora || formValues.permitirCalculadora || false,
        tempo_total: avaliacaoData.metadata?.tempo_total || formValues.duracaoSugerida || 60,
        data_criacao: new Date().toISOString()
      },
      gabarito: questoesValidadas.map((questao: any) => 
        `Questão ${questao.numero}: ${questao.resposta_correta?.toUpperCase()}`
      )
    };
    
    console.log('✅ Avaliação validada com sucesso:', avaliacaoValidada);
    return { avaliacaoParsed: avaliacaoValidada, debugData };
    
  } catch (error) {
    console.error('❌ Erro ao processar resposta:', error);
    throw error;
  }
}
