
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PropertySwiper from '@/components/property/PropertySwiper';
import PropertyCard from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Property, PropertyDemand } from '@/types/property';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Swipe = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const [userDemands, setUserDemands] = useState<PropertyDemand[]>([]);
  const [activeTab, setActiveTab] = useState('discover');
  const [loading, setLoading] = useState(true);
  const [profileType, setProfileType] = useState<string | null>(null);

  // Fetch user profile type
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
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
        toast({
          title: 'Erro ao carregar perfil',
          description: 'Não foi possível carregar o seu tipo de perfil',
          variant: 'destructive'
        });
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  // Fetch user demands if user is a buyer
  useEffect(() => {
    const fetchUserDemands = async () => {
      if (!user || profileType !== 'buyer') return;
      
      try {
        const { data, error } = await supabase
          .from('property_demands')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true);
          
        if (error) throw error;
        
        // Transform the database data to match the PropertyDemand type
        const transformedData = data ? data.map(item => ({
          id: item.id,
          userId: item.user_id,
          transactionType: item.transaction_type,
          propertyTypes: item.property_types,
          priceRange: {
            min: item.min_price,
            max: item.max_price,
          },
          locationPreferences: {
            cities: item.cities,
            neighborhoods: item.neighborhoods || [],
            states: item.states,
          },
          featureRequirements: {
            bedrooms: item.min_bedrooms || 0,
            bathrooms: item.min_bathrooms || 0,
            parkingSpaces: item.min_parking_spaces || 0,
            area: item.min_area || 0,
            isFurnished: item.is_furnished,
            hasPool: item.has_pool,
            hasElevator: item.has_elevator,
            hasGym: item.has_gym,
            hasBalcony: item.has_balcony,
            petsAllowed: item.pets_allowed,
          },
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          isActive: item.is_active,
        })) : [];
        
        setUserDemands(transformedData);
      } catch (error: any) {
        console.error('Error fetching user demands:', error);
      }
    };

    fetchUserDemands();
  }, [user, profileType]);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('properties')
          .select('*')
          .eq('is_active', true);
        
        // Filter properties based on user type
        if (profileType === 'owner') {
          // Owners see properties that match their own preferences (future feature)
          // For now, just show other properties they don't own
          if (user) {
            query = query.neq('owner_id', user.id);
          }
        } else if (profileType === 'agent') {
          // Agents see all properties
          // No additional filter needed
        } else if (profileType === 'buyer') {
          // Buyers see properties that match their demands
          // For simplicity, we'll just filter by transaction type from first demand
          if (userDemands.length > 0) {
            const firstDemand = userDemands[0];
            
            // Apply filters based on the first demand
            query = query
              .eq('transaction_type', firstDemand.transactionType)
              .gte('price', firstDemand.priceRange.min)
              .lte('price', firstDemand.priceRange.max);
              
            if (firstDemand.featureRequirements.bedrooms > 0) {
              query = query.gte('bedrooms', firstDemand.featureRequirements.bedrooms);
            }
            
            if (firstDemand.featureRequirements.bathrooms > 0) {
              query = query.gte('bathrooms', firstDemand.featureRequirements.bathrooms);
            }
          }
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transform the database data to match the Property type
        const transformedData = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.description,
          type: item.type,
          transactionType: item.transaction_type,
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

    if (user && profileType) {
      fetchProperties();
    } else if (user) {
      setLoading(false);
    }
  }, [user, toast, profileType, userDemands]);

  const handleLikeProperty = async (property: Property) => {
    setLikedProperties(prev => [...prev, property]);
    
    toast({
      title: 'Interesse registrado',
      description: `Você demonstrou interesse em ${property.title}`,
    });
    
    // In a real application, we would save this preference to the database
    if (profileType === 'buyer' && userDemands.length > 0) {
      try {
        // Create a match record in the database
        const { error } = await supabase
          .from('property_matches')
          .insert({
            property_id: property.id,
            demand_id: userDemands[0].id,
            score: 85, // Simple score for now
          });
          
        if (error) throw error;
      } catch (error) {
        console.error('Error saving property match:', error);
      }
    }
  };

  const handleDislikeProperty = (property: Property) => {
    console.log('Disliked:', property.id);
    // Could track disliked properties if needed
  };

  const handleSelectProperty = (property: Property) => {
    toast({
      title: 'Imóvel selecionado',
      description: `Você selecionou ${property.title}`,
    });
    // Navigate to property details
  };

  const getPageTitle = () => {
    switch (profileType) {
      case 'buyer':
        return 'Encontre o imóvel perfeito para você';
      case 'owner':
        return 'Conecte-se com potenciais compradores';
      case 'agent':
        return 'Explore imóveis disponíveis para seus clientes';
      default:
        return 'Bem-vindo ao MatchImobiliário';
    }
  };

  const getPageDescription = () => {
    switch (profileType) {
      case 'buyer':
        return 'Deslize para encontrar o imóvel dos seus sonhos';
      case 'owner':
        return 'Veja quem pode estar interessado no seu imóvel';
      case 'agent':
        return 'Encontre imóveis para apresentar aos seus clientes';
      default:
        return 'Encontre o imóvel perfeito para você ou conecte-se com potenciais compradores';
    }
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Faça login para ver imóveis</h2>
            <Link to="/login">
              <Button>Fazer Login</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{getPageTitle()}</h1>
          <p className="text-muted-foreground">
            {getPageDescription()}
          </p>
        </div>

        <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="discover">Descobrir</TabsTrigger>
            <TabsTrigger value="matches">Interesses ({likedProperties.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="discover" className="focus-visible:outline-none focus-visible:ring-0">
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : properties.length > 0 ? (
              <div className="flex flex-col items-center mb-8">
                <div className="max-w-full w-full md:max-w-md lg:max-w-lg overflow-hidden">
                  <PropertySwiper 
                    properties={properties}
                    onLike={handleLikeProperty}
                    onDislike={handleDislikeProperty}
                  />
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Deslize para direita para demonstrar interesse ou para esquerda para passar
                  </p>
                  <div className="mt-4">
                    {profileType === 'buyer' && (
                      <Link to="/property-preferences">
                        <Button variant="outline" size="sm">
                          Ajustar preferências
                        </Button>
                      </Link>
                    )}
                    {profileType === 'owner' && (
                      <Link to="/property/new">
                        <Button variant="outline" size="sm">
                          Cadastrar novo imóvel
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Nenhum imóvel disponível</h3>
                <p className="text-muted-foreground mb-4">
                  {profileType === 'buyer' 
                    ? 'Não há imóveis que correspondam às suas preferências no momento.' 
                    : 'Não há imóveis disponíveis para mostrar no momento.'}
                </p>
                {profileType === 'buyer' && userDemands.length === 0 && (
                  <Link to="/demand/new">
                    <Button>Cadastrar preferências</Button>
                  </Link>
                )}
                {profileType === 'owner' && (
                  <Link to="/property/new">
                    <Button>Cadastrar novo imóvel</Button>
                  </Link>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="matches" className="focus-visible:outline-none focus-visible:ring-0">
            {likedProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {likedProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onSelect={() => handleSelectProperty(property)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">Nenhum interesse registrado</h3>
                <p className="text-muted-foreground mb-4">
                  Navegue pelos imóveis disponíveis e demonstre interesse para vê-los aqui.
                </p>
                <Button 
                  onClick={() => setActiveTab('discover')}
                  variant="outline"
                >
                  Descobrir imóveis
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Swipe;
