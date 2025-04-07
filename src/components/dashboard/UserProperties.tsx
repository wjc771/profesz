
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from '@/types/property';
import { useToast } from '@/components/ui/use-toast';
import PropertyCard from '../property/PropertyCard';
import { useNavigate } from 'react-router-dom';
import { mockProperties } from '@/lib/mockData';

export const UserProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        console.log("Fetching user profile type for properties component...");
        const { data, error } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        console.log("User profile type fetched:", data.type);
        setProfileType(data.type);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        console.log("Fetching properties for user:", user.id);
        
        // First, try to get properties for this specific user
        const { data: userProperties, error: userPropsError } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', user.id);
          
        if (userPropsError) throw userPropsError;
        
        // If user has properties, use them
        if (userProperties && userProperties.length > 0) {
          console.log(`Found ${userProperties.length} properties for user`);
          
          // Transform the database data to match the Property type
          const transformedData = userProperties.map(item => ({
            id: item.id,
            title: item.title,
            description: item.description,
            type: item.type as any,
            transactionType: item.transaction_type as any,
            price: item.price,
            propertyTax: item.property_tax,
            location: {
              address: item.address,
              neighborhood: item.neighborhood,
              city: item.city,
              state: item.state,
              zipCode: item.zip_code,
              lat: item.lat,
              lng: item.lng
            },
            features: {
              bedrooms: item.bedrooms,
              bathrooms: item.bathrooms,
              parkingSpaces: item.parking_spaces,
              area: item.area,
              hasPool: item.has_pool,
              isFurnished: item.is_furnished,
              hasElevator: item.has_elevator,
              petsAllowed: item.pets_allowed,
              hasGym: item.has_gym,
              hasBalcony: item.has_balcony,
              condominium: item.condominium
            },
            images: item.images || [],
            ownerId: item.owner_id,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            isActive: item.is_active,
            isPremium: item.is_premium
          }));
          
          setProperties(transformedData);
          setUseMockData(false);
        } else {
          // No specific properties for this user - check if there are ANY properties
          const { count, error: countError } = await supabase
            .from('properties')
            .select('*', { count: 'exact', head: true });
            
          if (countError) throw countError;
          
          if (count && count > 0) {
            // There are properties in the database, but not for this user
            console.log("No properties for this user, but database has properties");
            setProperties([]);
            setUseMockData(false);
          } else {
            // No properties in database at all, use mock data
            console.log("No properties in database, using mock data");
            setProperties(mockProperties);
            setUseMockData(true);
          }
        }
      } catch (error: any) {
        console.error('Error fetching properties:', error);
        toast({
          title: 'Erro ao carregar imóveis',
          description: error.message,
          variant: 'destructive'
        });

        // If there's an error, use mock data
        setProperties(mockProperties);
        setUseMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user, toast]);

  const handleAddProperty = () => {
    navigate('/property/new');
  };

  const handleViewProperty = (property: Property) => {
    navigate(`/property/${property.id}`);
  };

  // Check if the user is allowed to add properties (owner, agent, agency)
  const isPropertyManager = profileType === 'owner' || profileType === 'agent' || profileType === 'agency';
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Seus Imóveis 
          {useMockData && (
            <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              Dados de Demonstração
            </span>
          )}
        </CardTitle>
        {isPropertyManager && <Button size="sm" onClick={handleAddProperty}>Adicionar Imóvel</Button>}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map(property => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onSelect={() => handleViewProperty(property)} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border rounded-md bg-muted/50">
            <p className="mb-4">Você ainda não possui imóveis cadastrados.</p>
            {isPropertyManager && (
              <Button onClick={handleAddProperty}>Cadastrar Imóvel</Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProperties;
