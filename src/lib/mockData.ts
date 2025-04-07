
import { Property, PropertyDemand, PropertyMatch } from "@/types/property";
import { Profile } from "@/types/profile";

// Sample user profiles of different types
export const mockProfiles: Profile[] = [
  // Buyers
  {
    id: "b1",
    email: "carlos@exemplo.com",
    name: "Carlos Mendes",
    type: "buyer",
    phone: "11987654321",
    subscriptionPlanId: "free",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "b2",
    email: "ana@exemplo.com",
    name: "Ana Beatriz",
    type: "buyer",
    phone: "11976543210",
    subscriptionPlanId: "personal",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "b3",
    email: "paulo@exemplo.com",
    name: "Paulo Ferreira",
    type: "buyer",
    phone: "11965432109",
    subscriptionPlanId: "professional",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Owners
  {
    id: "o1",
    email: "roberto@exemplo.com",
    name: "Roberto Almeida",
    type: "owner",
    phone: "11954321098",
    subscriptionPlanId: "free",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "o2",
    email: "claudia@exemplo.com",
    name: "Cláudia Santos",
    type: "owner",
    phone: "11943210987",
    subscriptionPlanId: "personal",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "o3",
    email: "marcelo@exemplo.com",
    name: "Marcelo Lima",
    type: "owner",
    phone: "11932109876",
    subscriptionPlanId: "professional",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Agents
  {
    id: "a1",
    email: "juliana@exemplo.com",
    name: "Juliana Costa",
    type: "agent",
    phone: "11921098765",
    subscriptionPlanId: "free",
    creci: "98765",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "a2",
    email: "ricardo@exemplo.com",
    name: "Ricardo Gomes",
    type: "agent",
    phone: "11910987654",
    subscriptionPlanId: "personal",
    creci: "87654",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "a3",
    email: "fernanda@exemplo.com",
    name: "Fernanda Pereira",
    type: "agent",
    phone: "11909876543",
    subscriptionPlanId: "professional",
    creci: "76543",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  
  // Agencies
  {
    id: "ag1",
    email: "imobiliaria1@exemplo.com",
    name: "Diretor Executivo",
    type: "agency",
    phone: "11898765432",
    subscriptionPlanId: "free",
    agencyName: "Imobiliária Lar Feliz",
    creci: "65432",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "ag2",
    email: "imobiliaria2@exemplo.com",
    name: "Gerente Comercial",
    type: "agency",
    phone: "11887654321",
    subscriptionPlanId: "personal",
    agencyName: "Central Imóveis",
    creci: "54321",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "ag3",
    email: "imobiliaria3@exemplo.com",
    name: "Diretor Geral",
    type: "agency",
    phone: "11876543210",
    subscriptionPlanId: "professional",
    agencyName: "Elite Imobiliária",
    creci: "43210",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Sample data - to be replaced with Supabase data
export const mockProperties: Property[] = [
  // Free plan owner property
  {
    id: "p1",
    title: "Apartamento Compacto",
    description: "Ótimo apartamento para investimento",
    type: "apartment",
    transactionType: "sale",
    price: 250000,
    propertyTax: 1200,
    location: {
      address: "Rua das Flores, 123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01000-000",
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      parkingSpaces: 0,
      area: 45,
      isFurnished: false,
    },
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=2576&auto=format&fit=crop"
    ],
    ownerId: "o1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
  
  // Personal plan owner properties
  {
    id: "p2",
    title: "Casa em Condomínio",
    description: "Casa espaçosa com quintal e área de lazer",
    type: "house",
    transactionType: "sale",
    price: 750000,
    propertyTax: 3000,
    location: {
      address: "Alameda dos Ipês, 456",
      neighborhood: "Jardim Europa",
      city: "Campinas",
      state: "SP",
      zipCode: "13050-000",
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 2,
      area: 150,
      hasPool: true,
      isFurnished: false,
    },
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1430285561322-7808604715df?q=80&w=2670&auto=format&fit=crop"
    ],
    ownerId: "o2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isPremium: true,
  },
  {
    id: "p3",
    title: "Apartamento Duplex",
    description: "Excelente apartamento com dois andares",
    type: "apartment",
    transactionType: "rent",
    price: 3500,
    location: {
      address: "Av. Paulista, 1000",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-000",
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 2,
      area: 120,
      hasElevator: true,
      isFurnished: true,
      condominium: 800,
    },
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop"
    ],
    ownerId: "o2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isPremium: true,
  },
  
  // Professional plan owner properties
  {
    id: "p4",
    title: "Prédio Comercial",
    description: "Prédio comercial completo para locação",
    type: "commercial",
    transactionType: "rent",
    price: 15000,
    location: {
      address: "Rua do Comércio, 789",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01010-000",
    },
    features: {
      bedrooms: 0,
      bathrooms: 4,
      parkingSpaces: 10,
      area: 400,
      hasElevator: true,
      isFurnished: false,
      condominium: 2000,
    },
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577115293949-9c4df36ddc12?q=80&w=2538&auto=format&fit=crop"
    ],
    ownerId: "o3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isPremium: true,
  },
  {
    id: "p5",
    title: "Terreno para Construção",
    description: "Amplo terreno em área nobre",
    type: "land",
    transactionType: "sale",
    price: 500000,
    propertyTax: 2000,
    location: {
      address: "Estrada da Serra, 200",
      neighborhood: "Jardim Botânico",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "22460-000",
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      parkingSpaces: 0,
      area: 1000,
    },
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2532&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2670&auto=format&fit=crop"
    ],
    ownerId: "o3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isPremium: true,
  },
  {
    id: "p6",
    title: "Mansão de Luxo",
    description: "Residência de alto padrão com vista panorâmica",
    type: "house",
    transactionType: "sale",
    price: 2500000,
    propertyTax: 10000,
    location: {
      address: "Av. Beira Mar, 500",
      neighborhood: "Leblon",
      city: "Rio de Janeiro",
      state: "RJ",
      zipCode: "22430-000",
    },
    features: {
      bedrooms: 5,
      bathrooms: 6,
      parkingSpaces: 4,
      area: 500,
      hasPool: true,
      isFurnished: true,
      hasGym: true,
      hasBalcony: true,
    },
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop"
    ],
    ownerId: "o3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isPremium: true,
  },
];

export const mockDemands: PropertyDemand[] = [
  // Free plan buyer demand
  {
    id: "d1",
    userId: "b1",
    transactionType: "rent",
    propertyTypes: ["apartment"],
    priceRange: {
      min: 1000,
      max: 2000,
    },
    locationPreferences: {
      cities: ["São Paulo"],
      neighborhoods: ["Centro", "Bela Vista"],
      states: ["SP"],
    },
    featureRequirements: {
      bedrooms: 1,
      bathrooms: 1,
      area: 40,
      parkingSpaces: 0,
      petsAllowed: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
  
  // Personal plan buyer demands
  {
    id: "d2",
    userId: "b2",
    transactionType: "sale",
    propertyTypes: ["house", "apartment"],
    priceRange: {
      min: 300000,
      max: 700000,
    },
    locationPreferences: {
      cities: ["São Paulo", "Campinas"],
      neighborhoods: ["Jardim Europa", "Cambuí"],
      states: ["SP"],
    },
    featureRequirements: {
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      area: 70,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "d3",
    userId: "b2",
    transactionType: "rent",
    propertyTypes: ["commercial"],
    priceRange: {
      min: 5000,
      max: 10000,
    },
    locationPreferences: {
      cities: ["São Paulo"],
      neighborhoods: ["Centro", "Itaim Bibi"],
      states: ["SP"],
    },
    featureRequirements: {
      bedrooms: 0,
      bathrooms: 1,
      parkingSpaces: 2,
      area: 100,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
  
  // Professional plan buyer demands
  {
    id: "d4",
    userId: "b3",
    transactionType: "sale",
    propertyTypes: ["house", "land"],
    priceRange: {
      min: 500000,
      max: 3000000,
    },
    locationPreferences: {
      cities: ["Rio de Janeiro"],
      neighborhoods: ["Leblon", "Ipanema", "Barra da Tijuca"],
      states: ["RJ"],
    },
    featureRequirements: {
      bedrooms: 3,
      bathrooms: 3,
      parkingSpaces: 2,
      area: 200,
      isFurnished: true,
      petsAllowed: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "d5",
    userId: "b3",
    transactionType: "rent",
    propertyTypes: ["apartment", "house"],
    priceRange: {
      min: 3000,
      max: 8000,
    },
    locationPreferences: {
      cities: ["São Paulo", "Rio de Janeiro"],
      states: ["SP", "RJ"],
    },
    featureRequirements: {
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      area: 80,
      isFurnished: true,
      petsAllowed: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
];

export const mockMatches: PropertyMatch[] = [
  // Match for free plan
  {
    id: "m1",
    propertyId: "p1",
    demandId: "d1",
    score: 85,
    createdAt: new Date().toISOString(),
    viewed: true,
    contacted: false,
    property: mockProperties.find(p => p.id === "p1"),
  },
  
  // Matches for personal plan
  {
    id: "m2",
    propertyId: "p2",
    demandId: "d2",
    score: 92,
    createdAt: new Date().toISOString(),
    viewed: true,
    contacted: true,
    property: mockProperties.find(p => p.id === "p2"),
  },
  {
    id: "m3",
    propertyId: "p3",
    demandId: "d5",
    score: 78,
    createdAt: new Date().toISOString(),
    viewed: false,
    contacted: false,
    property: mockProperties.find(p => p.id === "p3"),
  },
  
  // Matches for professional plan
  {
    id: "m4",
    propertyId: "p6",
    demandId: "d4",
    score: 95,
    createdAt: new Date().toISOString(),
    viewed: true,
    contacted: true,
    property: mockProperties.find(p => p.id === "p6"),
  },
  {
    id: "m5",
    propertyId: "p4",
    demandId: "d3",
    score: 88,
    createdAt: new Date().toISOString(),
    viewed: true,
    contacted: false,
    property: mockProperties.find(p => p.id === "p4"),
  },
];
