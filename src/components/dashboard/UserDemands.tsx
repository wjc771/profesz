
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyDemand, TransactionType, PropertyType } from '@/types/property';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/lib/format';

export const UserDemands = () => {
  const [demands, setDemands] = useState<PropertyDemand[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState<string | null>('buyer'); // Default to prevent errors
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching user profile type for demands would happen here");
        setProfileType('buyer'); // Default during restructuring
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
    const fetchDemands = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        console.log("Fetching property demands would happen here");
        
        // Using empty array for now during restructuring
        setDemands([]);
      } catch (error: any) {
        console.error('Error fetching property demands:', error);
        toast({
          title: 'Erro ao carregar buscas',
          description: error.message,
          variant: 'destructive'
        });
        setDemands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDemands();
  }, [user, toast]);

  const handleAddDemand = () => {
    navigate('/demand/new');
  };

  const handleViewMatches = (demand: PropertyDemand) => {
    navigate(`/matches/${demand.id}`);
  };

  const handleManageDemands = () => {
    navigate('/demands');
  };

  const isBuyer = profileType === 'buyer';
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          Suas Buscas
        </CardTitle>
        <div className="flex gap-2">
          {isBuyer && (
            <Button size="sm" onClick={handleAddDemand}>Nova Busca</Button>
          )}
          {demands.length > 0 && (
            <Button size="sm" variant="outline" onClick={handleManageDemands}>Gerenciar Buscas</Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : demands.length > 0 ? (
          <div className="space-y-4">
            {demands.map((demand) => (
              <Card key={demand.id} className="overflow-hidden">
                <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge>{demand.transactionType === 'sale' ? 'Compra' : 'Aluguel'}</Badge>
                      <Badge variant="outline">
                        {demand.propertyTypes.map(type => 
                          type === 'apartment' ? 'Apartamento' :
                          type === 'house' ? 'Casa' :
                          type === 'commercial' ? 'Comercial' :
                          type === 'land' ? 'Terreno' : type
                        ).join(', ')}
                      </Badge>
                      {demand.isActive ? (
                        <Badge variant="secondary">Ativa</Badge>
                      ) : (
                        <Badge variant="destructive">Inativa</Badge>
                      )}
                    </div>
                    
                    <h4 className="text-lg font-semibold mb-1">
                      {demand.locationPreferences.cities.join(', ')} - {demand.locationPreferences.states.join(', ')}
                    </h4>
                    
                    <p className="mb-2">
                      {formatCurrency(demand.priceRange.min)} - {formatCurrency(demand.priceRange.max)}
                    </p>
                    
                    <div className="text-sm text-muted-foreground">
                      {demand.featureRequirements.bedrooms && demand.featureRequirements.bedrooms > 0 && (
                        <span className="mr-3">{demand.featureRequirements.bedrooms}+ quartos</span>
                      )}
                      {demand.featureRequirements.bathrooms && demand.featureRequirements.bathrooms > 0 && (
                        <span className="mr-3">{demand.featureRequirements.bathrooms}+ banheiros</span>
                      )}
                      {demand.featureRequirements.area && demand.featureRequirements.area > 0 && (
                        <span>{demand.featureRequirements.area}+ m²</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Button onClick={() => handleViewMatches(demand)}>
                      Ver Matches
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border rounded-md bg-muted/50">
            <p className="mb-4">Você ainda não possui buscas cadastradas.</p>
            {isBuyer && (
              <Button onClick={handleAddDemand}>Cadastrar Busca</Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserDemands;
