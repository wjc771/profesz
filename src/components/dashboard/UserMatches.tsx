
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyMatch, Property } from '@/types/property';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../property/PropertyCard';

export const UserMatches = () => {
  const [matches, setMatches] = useState<PropertyMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState<string | null>('buyer'); // Default to prevent errors
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        console.log("Fetching user profile type for matches component would happen here");
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
    const fetchMatches = async () => {
      if (!user || !profileType) return;
      
      setLoading(true);
      try {
        console.log("Fetching matches would happen here");
        
        // Using empty array for now during restructuring
        setMatches([]);
      } catch (error: any) {
        console.error('Error fetching matches:', error);
        toast({
          title: 'Erro ao carregar matches',
          description: error.message,
          variant: 'destructive'
        });
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user, profileType, toast]);

  const handleViewProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const handleContactSeller = async (match: PropertyMatch) => {
    if (!match.propertyId) return;
    
    try {
      console.log("Contacting seller would happen here");
      
      // Update local state
      setMatches(matches.map(m => 
        m.id === match.id ? {...m, contacted: true} : m
      ));
      
      toast({
        title: 'Contato registrado',
        description: 'O proprietário será notificado sobre seu interesse.'
      });
      
    } catch (error: any) {
      console.error('Error updating match:', error);
      toast({
        title: 'Erro ao registrar contato',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {profileType === 'buyer' 
            ? 'Imóveis que Combinam com Você' 
            : 'Potenciais Compradores'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{match.score}% Match</Badge>
                      {match.viewed && <Badge variant="outline">Visualizado</Badge>}
                      {match.contacted && (
                        <Badge 
                          variant="outline" 
                          className="bg-green-100 text-green-800 hover:bg-green-200"
                        >
                          Contactado
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {match.property && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <PropertyCard 
                          property={match.property}
                          onSelect={() => match.property && handleViewProperty(match.property.id)}
                        />
                      </div>
                      <div className="flex flex-col justify-center space-y-4">
                        <Button 
                          onClick={() => match.property && handleViewProperty(match.property.id)}
                          className="w-full"
                        >
                          Ver Detalhes
                        </Button>
                        
                        {!match.contacted && profileType === 'buyer' && (
                          <Button 
                            variant="outline" 
                            onClick={() => handleContactSeller(match)}
                            className="w-full"
                          >
                            Contatar Vendedor
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-6 border rounded-md bg-muted/50">
            <p className="mb-4">Nenhum match encontrado ainda.</p>
            <p className="text-muted-foreground">
              {profileType === 'buyer'
                ? 'Os matches aparecem quando suas buscas coincidem com propriedades disponíveis.'
                : 'Os matches aparecem quando suas propriedades coincidem com as buscas dos compradores.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserMatches;
