
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/format';
import { Property, PropertyType, TransactionType } from '@/types/property';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Transform the database data to match the Property type
        const transformedData: Property = {
          id: data.id,
          title: data.title,
          description: data.description,
          type: data.type as PropertyType,
          transactionType: data.transaction_type as TransactionType,
          price: data.price,
          propertyTax: data.property_tax,
          location: {
            address: data.address,
            neighborhood: data.neighborhood,
            city: data.city,
            state: data.state,
            zipCode: data.zip_code,
            lat: data.lat,
            lng: data.lng
          },
          features: {
            bedrooms: data.bedrooms,
            bathrooms: data.bathrooms,
            parkingSpaces: data.parking_spaces,
            area: data.area,
            hasPool: data.has_pool,
            isFurnished: data.is_furnished,
            hasElevator: data.has_elevator,
            petsAllowed: data.pets_allowed,
            hasGym: data.has_gym,
            hasBalcony: data.has_balcony,
            condominium: data.condominium
          },
          images: data.images || [],
          ownerId: data.owner_id,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          isActive: data.is_active,
          isPremium: data.is_premium
        };

        setProperty(transformedData);
      } catch (error: any) {
        console.error('Error fetching property:', error);
        toast({
          title: 'Erro ao carregar imóvel',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, toast]);

  const handleImageClick = (index: number) => {
    setActiveImage(index);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!property) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-8">
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Imóvel não encontrado</h3>
            <p className="text-muted-foreground mb-4">
              O imóvel que você está procurando não foi encontrado ou não está disponível.
            </p>
            <Link to="/properties">
              <Button>Voltar para listagem</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'apartment': return 'Apartamento';
      case 'house': return 'Casa';
      case 'commercial': return 'Comercial';
      case 'land': return 'Terreno';
      default: return 'Outro';
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
              <p className="text-lg text-muted-foreground">
                {property.location.address}, {property.location.neighborhood}, {property.location.city} - {property.location.state}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatCurrency(property.price)}
                {property.transactionType === 'rent' && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{getPropertyTypeLabel(property.type)}</Badge>
                <Badge variant={property.transactionType === 'sale' ? 'default' : 'secondary'}>
                  {property.transactionType === 'sale' ? 'Venda' : 'Aluguel'}
                </Badge>
                {property.isPremium && <Badge className="bg-amber-500">Destaque</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* Galeria de imagens */}
        <div className="mb-8">
          {property.images && property.images.length > 0 ? (
            <div>
              <div className="w-full h-96 overflow-hidden rounded-lg mb-2">
                <img 
                  src={property.images[activeImage]} 
                  alt={`${property.title} - Imagem ${activeImage + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`w-24 h-24 flex-shrink-0 cursor-pointer rounded-md overflow-hidden ${index === activeImage ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleImageClick(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${property.title} - Miniatura ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Nenhuma imagem disponível</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Detalhes principais */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Descrição</h2>
              <Separator className="mb-4" />
              <p className="whitespace-pre-line">{property.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Características</h2>
              <Separator className="mb-4" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.features.bedrooms > 0 && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="text-primary font-semibold">{property.features.bedrooms}</span>
                    </div>
                    <span>{property.features.bedrooms === 1 ? 'Quarto' : 'Quartos'}</span>
                  </div>
                )}
                {property.features.bathrooms > 0 && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="text-primary font-semibold">{property.features.bathrooms}</span>
                    </div>
                    <span>{property.features.bathrooms === 1 ? 'Banheiro' : 'Banheiros'}</span>
                  </div>
                )}
                {property.features.parkingSpaces > 0 && (
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <span className="text-primary font-semibold">{property.features.parkingSpaces}</span>
                    </div>
                    <span>{property.features.parkingSpaces === 1 ? 'Vaga' : 'Vagas'}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">{property.features.area}</span>
                  </div>
                  <span>m²</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-6">
                {property.features.hasPool && (
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    <span>Piscina</span>
                  </div>
                )}
                {property.features.isFurnished && (
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    <span>Mobiliado</span>
                  </div>
                )}
                {property.features.hasElevator && (
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    <span>Elevador</span>
                  </div>
                )}
                {property.features.petsAllowed && (
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    <span>Aceita Pets</span>
                  </div>
                )}
                {property.features.hasGym && (
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    <span>Academia</span>
                  </div>
                )}
                {property.features.hasBalcony && (
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    <span>Sacada</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Localização</h2>
              <Separator className="mb-4" />
              <address className="not-italic">
                <p>{property.location.address}</p>
                <p>{property.location.neighborhood}, {property.location.city} - {property.location.state}</p>
                <p>CEP: {property.location.zipCode}</p>
              </address>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-muted p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4">Valores</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor</span>
                  <span className="font-semibold">
                    {formatCurrency(property.price)}
                    {property.transactionType === 'rent' && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
                  </span>
                </div>
                
                {property.propertyTax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IPTU</span>
                    <span className="font-semibold">{formatCurrency(property.propertyTax)}/ano</span>
                  </div>
                )}
                
                {property.features.condominium != null && property.features.condominium > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Condomínio</span>
                    <span className="font-semibold">{formatCurrency(property.features.condominium)}/mês</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Ações</h3>
              <div className="space-y-3">
                <Button variant="default" className="w-full">
                  Entre em contato
                </Button>
                <Button variant="outline" className="w-full">
                  Agendar visita
                </Button>
                <Link to="/properties">
                  <Button variant="ghost" className="w-full">
                    Voltar para listagem
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertyDetails;
