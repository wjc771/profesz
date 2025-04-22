
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PropertySwiper from '@/components/property/PropertySwiper';
import PropertyCard from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Property } from '@/types/property';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [properties] = useState<Property[]>([]); // Empty array during restructuring
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState('discover');
  const [loading] = useState(false); // Set to false to avoid showing loading state

  const handleLikeProperty = (property: Property) => {
    setLikedProperties(prev => [...prev, property]);
    toast({
      title: 'Interesse registrado',
      description: `Você demonstrou interesse em ${property.title}`,
    });
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
    // In the future, this would navigate to a property detail page
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
          <h1 className="text-3xl font-bold mb-2">Bem-vindo ao MatchImobiliário</h1>
          <p className="text-muted-foreground">
            Encontre o imóvel perfeito para você ou conecte-se com potenciais compradores
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
                  <Link to="/property-preferences">
                    <Button variant="outline" size="sm">
                      Ajustar preferências
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Nenhum imóvel disponível</h3>
                <p className="text-muted-foreground mb-4">
                  Não há imóveis disponíveis para mostrar no momento.
                </p>
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

export default Index;
