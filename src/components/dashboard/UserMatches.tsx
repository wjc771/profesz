
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyMatch, Property } from '@/types/property';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../property/PropertyCard';
import { mockMatches } from '@/lib/mockData';

export const UserMatches = () => {
  const [matches, setMatches] = useState<PropertyMatch[]>([]);
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
        console.log("Fetching user profile type for matches component...");
        const { data, error } = await supabase
          .from('profiles')
          .select('type')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        console.log("User profile type fetched for matches:", data.type);
        setProfileType(data.type);
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user || !profileType) return;
      
      setLoading(true);
      try {
        let matchesData = [];
        let hasMatchesForUser = false;
        
        console.log("Fetching matches for user:", user.id, "with profile type:", profileType);
        
        if (profileType === 'buyer') {
          // Get user's demand IDs
          const { data: demandsData, error: demandsError } = await supabase
            .from('property_demands')
            .select('id')
            .eq('user_id', user.id);
            
          if (demandsError) throw demandsError;
          
          console.log("User demands fetched:", demandsData?.length || 0);
          
          if (demandsData && demandsData.length > 0) {
            // Get matches based on user's demands
            const demandIds = demandsData.map(d => d.id);
            const { data: matchesResult, error: matchesError } = await supabase
              .from('property_matches')
              .select(`
                *,
                property:property_id(*)
              `)
              .in('demand_id', demandIds)
              .order('score', { ascending: false });
              
            if (matchesError) throw matchesError;
            matchesData = matchesResult || [];
            hasMatchesForUser = matchesData.length > 0;
            console.log("Buyer matches fetched:", matchesData.length);
          }
        } else {
          // For owners, agents, agencies - get properties first
          const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties')
            .select('id')
            .eq('owner_id', user.id);
            
          if (propertiesError) throw propertiesError;
          
          console.log("User properties fetched for matches:", propertiesData?.length || 0);
          
          if (propertiesData && propertiesData.length > 0) {
            // Get matches based on user's properties
            const propertyIds = propertiesData.map(p => p.id);
            const { data: matchesResult, error: matchesError } = await supabase
              .from('property_matches')
              .select(`
                *,
                property:property_id(*)
              `)
              .in('property_id', propertyIds)
              .order('score', { ascending: false });
              
            if (matchesError) throw matchesError;
            matchesData = matchesResult || [];
            hasMatchesForUser = matchesData.length > 0;
            console.log("Owner/Agent matches fetched:", matchesData.length);
          }
        }
        
        // Check if we have any matches at all in the database
        if (!hasMatchesForUser) {
          const { count, error: countError } = await supabase
            .from('property_matches')
            .select('*', { count: 'exact', head: true });
            
          if (countError) throw countError;
          
          // If we have matches in db but not for this user, show empty
          if (count && count > 0) {
            console.log("Database has matches but none for this user");
            setMatches([]);
            setUseMockData(false);
            setLoading(false);
            return;
          } else {
            console.log("No matches in database, using mock data");
            setMatches(mockMatches);
            setUseMockData(true);
            setLoading(false);
            return;
          }
        }
        
        // Transform the database data to match the PropertyMatch type
        const transformedData = matchesData.map(item => ({
          id: item.id,
          propertyId: item.property_id,
          demandId: item.demand_id,
          score: item.score,
          createdAt: item.created_at,
          viewed: item.viewed,
          contacted: item.contacted,
          property: item.property ? {
            id: item.property.id,
            title: item.property.title,
            description: item.property.description,
            type: item.property.type,
            transactionType: item.property.transaction_type,
            price: item.property.price,
            propertyTax: item.property.property_tax,
            location: {
              address: item.property.address,
              neighborhood: item.property.neighborhood,
              city: item.property.city,
              state: item.property.state,
              zipCode: item.property.zip_code,
              lat: item.property.lat,
              lng: item.property.lng
            },
            features: {
              bedrooms: item.property.bedrooms,
              bathrooms: item.property.bathrooms,
              parkingSpaces: item.property.parking_spaces,
              area: item.property.area,
              hasPool: item.property.has_pool,
              isFurnished: item.property.is_furnished,
              hasElevator: item.property.has_elevator,
              petsAllowed: item.property.pets_allowed,
              hasGym: item.property.has_gym,
              hasBalcony: item.property.has_balcony,
              condominium: item.property.condominium
            },
            images: item.property.images || [],
            ownerId: item.property.owner_id,
            createdAt: item.property.created_at,
            updatedAt: item.property.updated_at,
            isActive: item.property.is_active,
            isPremium: item.property.is_premium
          } : undefined
        }));
        
        setMatches(transformedData);
        setUseMockData(false);
      } catch (error: any) {
        console.error('Error fetching matches:', error);
        toast({
          title: 'Erro ao carregar matches',
          description: error.message,
          variant: 'destructive'
        });
        
        // If there's an error, use mock data
        console.log("Error fetching matches, using mock data");
        setMatches(mockMatches);
        setUseMockData(true);
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
      if (useMockData) {
        // Just update the local state for mock data
        setMatches(matches.map(m => 
          m.id === match.id ? {...m, contacted: true} : m
        ));
        
        toast({
          title: 'Contato registrado (Modo Demo)',
          description: 'Em modo de demonstração, não há alteração no banco de dados.'
        });
        return;
      }
      
      const { error } = await supabase
        .from('property_matches')
        .update({ contacted: true })
        .eq('id', match.id);
        
      if (error) throw error;
      
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
          {useMockData && (
            <span className="ml-2 text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
              Dados de Demonstração
            </span>
          )}
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
                          onSelect={() => handleViewProperty(match.property!.id)}
                        />
                      </div>
                      <div className="flex flex-col justify-center space-y-4">
                        <Button 
                          onClick={() => handleViewProperty(match.property!.id)}
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
