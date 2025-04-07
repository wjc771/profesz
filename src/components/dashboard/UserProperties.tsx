
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from '@/types/property';
import { useToast } from '@/components/ui/use-toast';
import PropertyCard from '../property/PropertyCard';
import { useNavigate } from 'react-router-dom';

export const UserProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        console.log("Fetching properties for user:", user.id);
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', user.id);
        
        if (error) throw error;
        
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
      } catch (error: any) {
        console.error('Error fetching properties:', error);
        toast({
          title: 'Erro ao carregar imóveis',
          description: error.message,
          variant: 'destructive'
        });
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

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Seus Imóveis</CardTitle>
        {(user?.type === 'owner' || user?.type === 'agent' || user?.type === 'agency') && (
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
            {(user?.type === 'owner' || user?.type === 'agent' || user?.type === 'agency') && (
              <Button onClick={handleAddProperty}>Cadastrar Imóvel</Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProperties;
