
import { supabase } from '@/integrations/supabase/client';
import { mockProperties } from '@/lib/mockData';
import { Profile } from '@/types/profile';

/**
 * Função que insere os imóveis de demonstração no banco de dados Supabase.
 * Mapeia os imóveis para os perfis existentes, baseado no tipo de usuário.
 */
export const seedPropertiesFromMockData = async () => {
  try {
    // Busca todos os perfis existentes no banco
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) throw profilesError;
    
    if (!profiles || profiles.length === 0) {
      throw new Error('Nenhum perfil encontrado. Registre pelo menos um usuário primeiro.');
    }
    
    // Separa os perfis por tipo
    const ownerProfiles = profiles.filter(p => p.type === 'owner');
    const agentProfiles = profiles.filter(p => p.type === 'agent');
    const agencyProfiles = profiles.filter(p => p.type === 'agency');
    
    // Seleção de perfis que podem possuir imóveis
    const propertyOwnerProfiles = [...ownerProfiles, ...agentProfiles, ...agencyProfiles];
    
    if (propertyOwnerProfiles.length === 0) {
      throw new Error('Nenhum perfil do tipo proprietário, corretor ou imobiliária encontrado.');
    }
    
    console.log(`Encontrados ${propertyOwnerProfiles.length} perfis que podem possuir imóveis`);
    
    // Para cada imóvel mock, atribuir a um usuário existente
    const propertiesToInsert = mockProperties.map((property, index) => {
      // Distribui os imóveis entre os perfis disponíveis
      const targetProfile = propertyOwnerProfiles[index % propertyOwnerProfiles.length];
      
      // Converte o objeto Property para o formato da tabela properties no Supabase
      return {
        title: property.title,
        description: property.description,
        type: property.type,
        transaction_type: property.transactionType,
        price: property.price,
        property_tax: property.propertyTax,
        address: property.location.address,
        neighborhood: property.location.neighborhood,
        city: property.location.city,
        state: property.location.state,
        zip_code: property.location.zipCode,
        lat: property.location.lat,
        lng: property.location.lng,
        bedrooms: property.features.bedrooms,
        bathrooms: property.features.bathrooms,
        parking_spaces: property.features.parkingSpaces,
        area: property.features.area,
        has_pool: property.features.hasPool,
        is_furnished: property.features.isFurnished,
        has_elevator: property.features.hasElevator,
        pets_allowed: property.features.petsAllowed,
        has_gym: property.features.hasGym,
        has_balcony: property.features.hasBalcony,
        condominium: property.features.condominium,
        images: property.images,
        owner_id: targetProfile.id,
        is_active: property.isActive,
        is_premium: property.isPremium || false
      };
    });
    
    // Insere os imóveis no banco de dados
    const { data: insertedProperties, error: insertError } = await supabase
      .from('properties')
      .insert(propertiesToInsert)
      .select();
      
    if (insertError) throw insertError;
    
    console.log(`Inseridos ${insertedProperties?.length || 0} imóveis com sucesso.`);
    
    return {
      success: true,
      count: insertedProperties?.length || 0,
      message: `${insertedProperties?.length || 0} imóveis inseridos com sucesso!`
    };
    
  } catch (error: any) {
    console.error('Erro ao inserir imóveis:', error);
    return {
      success: false,
      count: 0,
      message: `Erro: ${error.message || 'Falha ao inserir imóveis'}`
    };
  }
};
