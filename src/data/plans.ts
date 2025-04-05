
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
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: PlanFeature[];
  limits: PlanLimits;
  recommended?: boolean;
}

export const plans: Plan[] = [
  {
    id: "free",
    name: "Gratuito",
    price: "Grátis",
    description: "Comece a explorar o básico",
    features: [
      { name: "Notificação básica de matches", included: true, details: "Recebe alerta simples via e-mail/plataforma" },
      { name: "Visualização limitada de matches", included: true, details: "Apenas tipo de imóvel e bairro" },
      { name: "Filtros essenciais", included: true, details: "Tipo de imóvel, venda/aluguel, faixa de preço" },
      { name: "Perfil básico", included: true, details: "Nome, e-mail, sem verificação" },
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
    }
  },
  {
    id: "personal",
    name: "Pessoal",
    price: "R$49,90",
    description: "Para uso individual",
    recommended: true,
    features: [
      { name: "Notificação detalhada de matches", included: true, details: "Inclui informações detalhadas e fotos" },
      { name: "Visualização completa de matches", included: true, details: "Acesso a todas as informações e contatos" },
      { name: "Filtros avançados", included: true, details: "Inclui condições específicas e preferências detalhadas" },
      { name: "Contato direto com proprietários", included: true, details: "Limitado mensalmente" },
      { name: "Analytics básicos", included: true, details: "Estatísticas de visualizações" },
      { name: "Destaque de anúncios", included: false },
      { name: "Exportação de relatórios", included: false },
    ],
    limits: {
      activeListings: 5,
      activeSearches: 5,
      matchesPerMonth: 30,
      contactsPerMonth: 15,
    }
  },
  {
    id: "professional",
    name: "Profissional",
    price: "R$99,90",
    description: "Para corretores e imobiliárias",
    features: [
      { name: "Ofertas e buscas ilimitadas", included: true, details: "Sem limite de anúncios ou buscas ativas" },
      { name: "Detalhes e contatos ilimitados", included: true, details: "Acesso total aos contatos e detalhes" },
      { name: "Todos os filtros disponíveis", included: true, details: "Inclui filtros exclusivos profissionais" },
      { name: "Destaque de anúncios", included: true, details: "Prioridade nos resultados de busca" },
      { name: "Analytics avançados", included: true, details: "Relatórios detalhados de desempenho" },
      { name: "API para integração", included: true, details: "Conexão com sistemas externos" },
      { name: "Exportação de relatórios", included: true, details: "Em PDF, Excel e CSV" },
    ],
    limits: {
      activeListings: -1, // Unlimited
      activeSearches: -1, // Unlimited
      matchesPerMonth: -1, // Unlimited
      contactsPerMonth: -1, // Unlimited
    }
  },
  {
    id: "custom",
    name: "Avulso",
    price: "Personalizado",
    description: "Soluções personalizadas para empresas",
    features: [
      { name: "Recursos customizados", included: true, details: "Adaptado às suas necessidades específicas" },
      { name: "Suporte dedicado", included: true, details: "Gerente de conta exclusivo" },
      { name: "Integração personalizada", included: true, details: "Com sistemas corporativos existentes" },
      { name: "Marca personalizada", included: true, details: "White-label disponível" },
      { name: "Treinamento da equipe", included: true, details: "Sessões de capacitação incluídas" },
      { name: "Relatórios personalizados", included: true, details: "Conforme suas métricas de negócio" },
    ],
    limits: {
      activeListings: -1, // Unlimited
      activeSearches: -1, // Unlimited
      matchesPerMonth: -1, // Unlimited
      contactsPerMonth: -1, // Unlimited
    }
  }
];
