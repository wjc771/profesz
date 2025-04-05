
export const plans = [
  {
    id: "free",
    name: "Gratuito",
    price: "Grátis",
    description: "Comece a explorar o básico",
    features: [
      { name: "1 oferta e 1 demanda ativas", included: true },
      { name: "Notificação de matches (sem detalhes)", included: true },
      { name: "Filtros básicos", included: true },
      { name: "Contato direto com matches", included: false },
      { name: "Filtros avançados", included: false },
      { name: "Analytics de desempenho", included: false },
    ],
  },
  {
    id: "personal",
    name: "Pessoal",
    price: "R$49,90",
    description: "Para uso individual",
    recommended: true,
    features: [
      { name: "10 ofertas e 10 demandas ativas", included: true },
      { name: "Detalhes completos de matches", included: true },
      { name: "Filtros avançados", included: true },
      { name: "Contato direto limitado", included: true },
      { name: "Analytics básicos", included: true },
      { name: "Destaque de anúncios", included: false },
    ],
  },
  {
    id: "professional",
    name: "Profissional",
    price: "R$99,90",
    description: "Para corretores e imobiliárias",
    features: [
      { name: "Ofertas e demandas ilimitadas", included: true },
      { name: "Detalhes e contato ilimitados", included: true },
      { name: "Todos os filtros disponíveis", included: true },
      { name: "Destaque de anúncios", included: true },
      { name: "Analytics avançados", included: true },
      { name: "Webhooks personalizados", included: true },
    ],
  },
];
