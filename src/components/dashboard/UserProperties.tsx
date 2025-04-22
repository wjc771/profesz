
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from '@/types/property';
import { useToast } from '@/components/ui/use-toast';
import PropertyCard from '../property/PropertyCard';
import { useNavigate } from 'react-router-dom';

export const UserProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState<string | null>('buyer'); // Default to prevent errors
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      try {
        console.log("Fetching user profile type for properties component...");
        // Since we're restructuring, use a default profile type
        setProfileType('buyer');
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
        toast({
          title: 'Erro ao carregar perfil',
          description: 'Não foi possível carregar o seu tipo de perfil',
          variant: 'destructive'
        });
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        console.log("Fetching properties would happen here in the actual app");
        
        // Using empty array for now during restructuring
        setProperties([]);
      } catch (error: any) {
        console.error('Error fetching properties:', error);
        toast({
          title: 'Erro ao carregar imóveis',
          description: error.message,
          variant: 'destructive'
        });
        setProperties([]);
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
