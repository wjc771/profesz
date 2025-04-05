
export interface PlanFeature {
  name: string;
  included: boolean;
  details?: string;
}

export interface PlanLimits {
  activeListings: number;
  activeSearches: number;
  matchesPerMonth: number;
  contactsPerMonth: number | null;
  photosPerListing?: number;
  videosPerListing?: number;
  highlightsPerWeek?: number;
  teamMembers?: number;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  priceValue?: number; // Numeric price value for comparison
  description: string;
  features: PlanFeature[];
  limits: PlanLimits;
  recommended?: boolean;
  bestFor?: string;
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Gratuito",
    price: "Grátis",
    priceValue: 0,
    description: "Comece a explorar o básico",
    bestFor: "Usuários casuais ou com necessidades pontuais",
    features: [
      { name: "Notificação básica de matches", included: true, details: "Recebe alerta simples via e-mail/plataforma" },
      { name: "Visualização limitada de matches", included: true, details: "Apenas tipo de imóvel e bairro" },
      { name: "Filtros essenciais", included: true, details: "Tipo de imóvel, venda/aluguel, faixa de preço" },
      { name: "Perfil básico", included: true, details: "Nome, e-mail, sem verificação" },
      { name: "Cadastro de imóvel/preferência", included: true, details: "1 imóvel ou 1 perfil de busca" },
      { name: "Contato direto com matches", included: false },
      { name: "Visualização completa de matches", included: false },
      { name: "Filtros avançados", included: false },
      { name: "Analytics de desempenho", included: false },
    ],
    limits: {
      activeListings: 1,
      activeSearches: 1,
      matchesPerMonth: 3,
      contactsPerMonth: null,
      photosPerListing: 5,
    }
  },
  {
    id: "personal",
    name: "Pessoal",
    price: "R$49,90",
    priceValue: 49.90,
    description: "Para proprietários individuais e compradores ativos",
    bestFor: "Proprietários individuais, compradores ativos e corretores autônomos",
    recommended: true,
    features: [
      { name: "Visualização completa de matches", included: true, details: "Acesso a todas informações (fotos, preço, descrição, contato)" },
      { name: "Notificações instantâneas", included: true, details: "Alertas em tempo real (plataforma, e-mail, push, SMS)" },
      { name: "Perfil verificado", included: true, details: "Selo de confiança após validação documental" },
      { name: "Chat ilimitado", included: true, details: "Mensagens + envio de arquivos com tradução automática" },
      { name: "Filtros avançados", included: true, details: "Área, nº quartos/banheiros/vagas, características específicas" },
      { name: "Mídia aprimorada", included: true, details: "20 fotos + 1 vídeo (30s) + link para tour virtual" },
      { name: "Destaque periódico", included: true, details: "1 destaque gratuito por semana (24h no topo)" },
      { name: "Analytics pessoal", included: true, details: "Estatísticas de visualizações e engajamento" },
      { name: "Modo incógnito", included: true, details: "Navegação anônima por 48h/semana" },
      { name: "Histórico de interações", included: true, details: "Rastreamento dos últimos 3 meses" },
      { name: "Análise comparativa", included: true, details: "Comparação com imóveis similares na região" },
      { name: "Impulsionamentos", included: true, details: "3 impulsionamentos de anúncio por mês incluídos" },
      { name: "Ferramentas corporativas", included: false },
      { name: "Analytics avançados", included: false },
      { name: "Branding personalizado", included: false },
    ],
    limits: {
      activeListings: 10,
      activeSearches: 10,
      matchesPerMonth: 30,
      contactsPerMonth: 30,
      photosPerListing: 20,
      videosPerListing: 1,
      highlightsPerWeek: 1
    }
  },
  {
    id: "professional",
    name: "Profissional",
    price: "R$199,90",
    priceValue: 199.90,
    description: "Para imobiliárias e corretores premium",
    bestFor: "Imobiliárias, corretores premium e investidores",
    features: [
      { name: "Cadastro ilimitado", included: true, details: "Imóveis e demandas sem restrições" },
      { name: "Matching premium com IA", included: true, details: "Algoritmo personalizado e sugestões de ajustes de preço" },
      { name: "Multiusuários", included: true, details: "Até 10 perfis com gestão de equipes e permissões" },
      { name: "CRM integrado", included: true, details: "Integração com HubSpot, PipeDrive e API para automação" },
      { name: "Analytics avançados", included: true, details: "Heatmaps de demanda, relatórios e análises preditivas" },
      { name: "Automação", included: true, details: "Postagem automática em portais externos e preços dinâmicos" },
      { name: "Branding personalizado", included: true, details: "Logo, cores e landing pages customizadas" },
      { name: "Visibilidade premium", included: true, details: "Destaque ilimitado e prioridade no algoritmo" },
      { name: "Suporte VIP", included: true, details: "Atendimento 24h e gestor de conta dedicado" },
      { name: "Propostas em lote", included: true, details: "Modelos de contrato personalizáveis" },
      { name: "Contato direto", included: true, details: "Envio de propostas diretas sem match necessário" },
      { name: "Exclusividade territorial", included: true, details: "Em regiões específicas" },
    ],
    limits: {
      activeListings: -1, // Unlimited
      activeSearches: -1, // Unlimited
      matchesPerMonth: -1, // Unlimited
      contactsPerMonth: -1, // Unlimited
      photosPerListing: -1, // Unlimited
      videosPerListing: -1, // Unlimited
      highlightsPerWeek: -1, // Unlimited
      teamMembers: 10
    }
  },
  {
    id: "custom",
    name: "Avulso",
    price: "Personalizado",
    description: "Recursos avulsos independente do plano",
    features: [
      { name: "Destaque de imóvel", included: true, details: "R$50 por semana - Posição privilegiada nos resultados" },
      { name: "Boost/Impulsionamento", included: true, details: "R$19,90 por 24h - Visibilidade imediata no topo" },
      { name: "Pacote de matches extras", included: true, details: "R$20 por 10 matches adicionais" },
      { name: "Anúncio avulso extra", included: true, details: "R$30 por imóvel adicional/mês" },
      { name: "Tour virtual 3D", included: true, details: "R$49,90 - Integração com Matterport" },
      { name: "Relatório de avaliação", included: true, details: "R$29,90 - Análise detalhada de preços" },
      { name: "Verificação documental", included: true, details: "R$49,90 - Validação jurídica de documentos" },
      { name: "Campanha de marketing", included: true, details: "R$149,90 - Divulgação em redes sociais" },
      { name: "Acesso antecipado", included: true, details: "R$9,90 - Visualização 24h antes do público" },
    ],
    limits: {
      activeListings: -1, // Depends on base plan
      activeSearches: -1, // Depends on base plan
      matchesPerMonth: -1, // Depends on base plan
      contactsPerMonth: -1, // Depends on base plan
    }
  }
];

export const standAloneServices = [
  {
    id: "highlight",
    name: "Destaque de Imóvel",
    price: "R$50,00",
    duration: "7 dias",
    description: "Posição privilegiada nos resultados de busca e seção de destaques"
  },
  {
    id: "boost",
    name: "Impulsionamento",
    price: "R$19,90",
    duration: "24 horas",
    description: "Visibilidade imediata no topo das buscas"
  },
  {
    id: "extraMatches",
    name: "Pacote de Matches Extras",
    price: "R$20,00",
    quantity: "10 matches",
    description: "Para usuários que atingiram o limite mensal"
  },
  {
    id: "extraListing",
    name: "Anúncio Avulso Extra",
    price: "R$30,00",
    duration: "30 dias",
    description: "Para quem não quer mudar de plano"
  },
  {
    id: "virtualTour",
    name: "Tour Virtual 3D",
    price: "R$49,90",
    description: "Integração com Matterport para visualização imersiva"
  },
  {
    id: "marketReport",
    name: "Relatório de Avaliação",
    price: "R$29,90",
    description: "Análise detalhada de preços e tendências de mercado"
  },
  {
    id: "docVerification",
    name: "Verificação Documental",
    price: "R$49,90",
    description: "Validação jurídica de documentos (matrícula, CCIR)"
  },
  {
    id: "marketingCampaign",
    name: "Campanha de Marketing",
    price: "R$149,90",
    description: "Divulgação do imóvel em redes sociais e newsletter"
  },
  {
    id: "earlyAccess",
    name: "Acesso Antecipado",
    price: "R$9,90",
    description: "Visualização 24h antes do público geral"
  }
];
