
import { Profile } from "@/types/profile";

// Sample user profiles for education
export const mockProfiles: Profile[] = [
  {
    id: "p1",
    email: "carlos.mendes@escola.com",
    name: "Carlos Mendes",
    type: "professor",
    phone: "11987654321",
    subscriptionPlanId: "inicial",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schoolName: "Escola Municipal São Paulo"
  },
  {
    id: "p2", 
    email: "ana.beatriz@escola.com",
    name: "Ana Beatriz",
    type: "professor",
    phone: "11976543210",
    subscriptionPlanId: "essencial",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schoolName: "Colégio Estadual Rio de Janeiro"
  },
  {
    id: "i1",
    email: "diretor.escola@instituicao.com",
    name: "Diretor Escolar",
    type: "instituicao",
    phone: "11965432109",
    subscriptionPlanId: "maestro",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    schoolName: "Instituição de Ensino Central"
  }
];

// Remove all other mock data related to real estate properties, demands, and matches
export const mockProperties: any[] = [];
export const mockDemands: any[] = [];
export const mockMatches: any[] = [];
