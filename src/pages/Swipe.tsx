
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Property, PropertyDemand } from '@/types/property';
import PropertySwiper from '@/components/property/PropertySwiper';
import PropertyCard from '@/components/property/PropertyCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data to replace supabase queries
const mockProperties: Property[] = [
  {
    id: "prop1",
    title: "Apartamento Modelo",
    description: "Um lindo apartamento no centro da cidade",
    type: "apartment",
    transactionType: "sale",
    price: 450000,
    location: {
      address: "Rua das Flores, 123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01001-000",
    },
    features: {
      bedrooms: 2,
      bathrooms: 1,
      parkingSpaces: 1,
      area: 70,
      hasPool: false,
      isFurnished: true,
    },
    images: ["/placeholder.svg"],
    ownerId: "owner1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "prop2",
    title: "Casa Espaçosa",
    description: "Uma casa ampla em condomínio fechado",
    type: "house",
    transactionType: "rent",
    price: 3500,
    location: {
      address: "Av. dos Ipês, 456",
      neighborhood: "Jardins",
      city: "São Paulo",
      state: "SP",
      zipCode: "04567-000",
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      parkingSpaces: 2,
      area: 120,
      hasPool: true,
      isFurnished: false,
    },
    images: ["/placeholder.svg"],
    ownerId: "owner2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  },
];

const Swipe = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [properties] = useState<Property[]>(mockProperties);
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState('discover');
  const [loading, setLoading] = useState(false);
  const [profileType, setProfileType] = useState<string>('professor');

  const handleLikeProperty = (property: Property) => {
    setLikedProperties(prev => [...prev, property]);
    
    toast({
      title: 'Interesse registrado',
      description: `Você demonstrou interesse em ${property.title}`,
    });
  };

  const handleDislikeProperty = (property: Property) => {
    console.log('Disliked:', property.id);
  };

  const handleSelectProperty = (property: Property) => {
    toast({
      title: 'Imóvel selecionado',
      description: `Você selecionou ${property.title}`,
    });
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Faça login para acessar recursos</h2>
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
          <h1 className="text-3xl font-bold mb-2">Descobrir Materiais Didáticos</h1>
          <p className="text-muted-foreground">
            Encontre materiais didáticos que combinam com seu perfil
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
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Nenhum material disponível</h3>
                <p className="text-muted-foreground mb-4">
                  Não há materiais didáticos que correspondam às suas preferências no momento.
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
                  Navegue pelos materiais didáticos disponíveis e demonstre interesse para vê-los aqui.
                </p>
                <Button 
                  onClick={() => setActiveTab('discover')}
                  variant="outline"
                >
                  Descobrir materiais
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
