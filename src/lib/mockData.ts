
import { Property, PropertyDemand } from "@/types/property";

// Sample data - to be replaced with Supabase data
export const mockProperties: Property[] = [
  {
    id: "p1",
    title: "Apartamento Moderno no Centro",
    description: "Lindo apartamento totalmente reformado no coração da cidade.",
    type: "apartment",
    transactionType: "sale",
    price: 450000,
    propertyTax: 2000,
    location: {
      address: "Av. Paulista, 1000",
      neighborhood: "Bela Vista",
      city: "São Paulo",
      state: "SP",
      zipCode: "01310-100",
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      area: 75,
      hasElevator: true,
      isFurnished: false,
    },
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2670&auto=format&fit=crop"
    ],
    ownerId: "user1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "p2",
    title: "Casa Espaçosa com Piscina",
    description: "Casa ampla com jardim, piscina e área de lazer completa.",
    type: "house",
    transactionType: "sale",
    price: 850000,
    propertyTax: 3500,
    location: {
      address: "Rua das Flores, 123",
      neighborhood: "Alphaville",
      city: "Barueri",
      state: "SP",
      zipCode: "06453-000",
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      parkingSpaces: 2,
      area: 250,
      hasPool: true,
      isFurnished: false,
    },
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?q=80&w=2667&auto=format&fit=crop"
    ],
    ownerId: "user2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isPremium: true,
  },
  {
    id: "p3",
    title: "Studio Mobiliado para Locação",
    description: "Studio moderno, completamente mobiliado e pronto para morar.",
    type: "apartment",
    transactionType: "rent",
    price: 2500,
    location: {
      address: "Rua Augusta, 500",
      neighborhood: "Consolação",
      city: "São Paulo",
      state: "SP",
      zipCode: "01305-000",
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      parkingSpaces: 0,
      area: 35,
      hasElevator: true,
      isFurnished: true,
      petsAllowed: true,
      condominium: 500,
    },
    images: [
      "https://images.unsplash.com/photo-1536437075651-6b3048f3c46a?q=80&w=2670&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2670&auto=format&fit=crop"
    ],
    ownerId: "user3",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "p4",
    title: "Sala Comercial no Centro Empresarial",
    description: "Excelente sala comercial em prédio de alto padrão.",
    type: "commercial",
    transactionType: "rent",
    price: 4000,
    location: {
      address: "Av. Brigadeiro Faria Lima, 3000",
      neighborhood: "Itaim Bibi",
      city: "São Paulo",
      state: "SP",
      zipCode: "04538-132",
    },
    features: {
      bedrooms: 0,
      bathrooms: 1,
      parkingSpaces: 1,
      area: 50,
      hasElevator: true,
      isFurnished: false,
      condominium: 1200,
    },
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2669&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606836576983-8b458e75221d?q=80&w=2670&auto=format&fit=crop"
    ],
    ownerId: "user4",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
    isPremium: true,
  },
  {
    id: "p5",
    title: "Terreno para Construção",
    description: "Ótimo terreno plano em condomínio fechado.",
    type: "land",
    transactionType: "sale",
    price: 350000,
    propertyTax: 1500,
    location: {
      address: "Rua dos Ipês, 50",
      neighborhood: "Granja Viana",
      city: "Cotia",
      state: "SP",
      zipCode: "06700-000",
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      parkingSpaces: 0,
      area: 500,
    },
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2532&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2670&auto=format&fit=crop"
    ],
    ownerId: "user2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
];

export const mockDemands: PropertyDemand[] = [
  {
    id: "d1",
    userId: "user5",
    transactionType: "sale", // Changed from "buy" to "sale"
    propertyTypes: ["apartment", "house"],
    priceRange: {
      min: 300000,
      max: 600000,
    },
    locationPreferences: {
      cities: ["São Paulo"],
      neighborhoods: ["Vila Mariana", "Pinheiros", "Perdizes"],
      states: ["SP"],
    },
    featureRequirements: {
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      area: 60,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "d2",
    userId: "user6",
    transactionType: "rent",
    propertyTypes: ["apartment"],
    priceRange: {
      min: 1500,
      max: 3000,
    },
    locationPreferences: {
      cities: ["São Paulo"],
      neighborhoods: ["Centro", "Bela Vista", "Santa Cecília"],
      states: ["SP"],
    },
    featureRequirements: {
      bedrooms: 1,
      bathrooms: 1,
      isFurnished: true,
      petsAllowed: true,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
];
