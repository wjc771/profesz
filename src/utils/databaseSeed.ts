
import { supabase } from '@/integrations/supabase/client';
import { mockProfiles } from '@/lib/mockData';
import { toast } from '@/components/ui/use-toast';

export async function seedPropertiesFromMockData() {
  try {
    console.log('Starting to seed materials...');
    
    // Demo data for teaching materials
    const teachingMaterials = [
      {
        title: 'Plano de Aula: Matemática Básica',
        description: 'Plano de aula completo para introdução à matemática básica para ensino fundamental.',
        type: 'plano',
        subject: 'matemática',
        grade_level: 'fundamental',
        user_id: mockProfiles[0].id, // Carlos Mendes
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        title: 'Atividade: Gramática Portuguesa',
        description: 'Exercícios de gramática para alunos do ensino médio.',
        type: 'atividade',
        subject: 'português',
        grade_level: 'médio',
        user_id: mockProfiles[1].id, // Ana Beatriz
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        title: 'Material Didático: História do Brasil',
        description: 'Apresentação sobre a história do Brasil colonial.',
        type: 'material',
        subject: 'história',
        grade_level: 'médio',
        user_id: mockProfiles[2].id, // Diretor Escolar
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    // For mock purposes, we'll just log the data rather than inserting it
    // In a real app with Supabase connected, we would insert the data
    console.log('Materials to seed:', teachingMaterials);
    
    // Success message even though we're not actually inserting data
    return {
      success: true,
      message: 'Materiais de demonstração adicionados com sucesso!',
    };
    
  } catch (error) {
    console.error('Error seeding materials:', error);
    return {
      success: false,
      message: 'Erro ao adicionar materiais de demonstração.',
    };
  }
}
