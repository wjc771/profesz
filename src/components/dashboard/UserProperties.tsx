
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
        // Check if we have any properties in the database
        const { data: propertyCount, error: countError } = await supabase
          .from('properties')
          .select('id', { count: 'exact', head: true });
        
        if (countError) throw countError;
        
        // If we have no properties, use mock data
        if (propertyCount === null || propertyCount.length === 0) {
          console.log("No properties found in database, using mock data");
          setUseMockData(true);
          // Filter mock properties based on owner id matching current user
          // For demo, we'll just show all mock properties
          setProperties(mockProperties);
          setLoading(false);
          return;
        }
        
        console.log("Fetching properties for user:", user.id);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', user.id);
        
        if (error) throw error;
        
        // If user has no properties, use mock data
        if (!data || data.length === 0) {
          console.log("User has no properties, using mock data");
          setUseMockData(true);
          setProperties(mockProperties);
          setLoading(false);
          return;
        }
        
        console.log("Properties fetched:", data?.length || 0);
        
        // Transform the database data to match the Property type
        const transformedData = data?.map(item => ({
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
        })) || [];
        
        setProperties(transformedData);
        setUseMockData(false);
      } catch (error: any) {
        console.error('Error fetching properties:', error);
        toast({
          title: 'Erro ao carregar imóveis',
          description: error.message,
          variant: 'destructive'
        });
        
        // If there's an error, use mock data
        console.log("Error fetching properties, using mock data");
        setUseMockData(true);
        setProperties(mockProperties);
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
  console.log("Is property manager:", isPropertyManager, "Profile type:", profileType);

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
        {isPropertyManager && (
          <Button size="sm" onClick={handleAddProperty}>Adicionar Imóvel</Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
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
