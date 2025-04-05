
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import SubscriptionOverview from "@/components/subscription/SubscriptionOverview";
import PropertyCard from "@/components/property/PropertyCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { mockProperties } from "@/lib/mockData";
import { Property } from "@/types/property";

export default function Index() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties, setProperties] = useState(mockProperties.slice(0, 4));

  const handleSelectProperty = (property: Property) => {
    toast({
      title: "Imóvel selecionado",
      description: `Você selecionou ${property.title}`,
    });
    // Em uma aplicação real, isso navegaria para a página de detalhes do imóvel
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Olá, {user?.email?.split('@')[0] || 'usuário'}</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao MatchImobiliário. Aqui você pode gerenciar seus imóveis e encontrar o match perfeito.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Seus Imóveis</h2>
              <Link to="/add-property">
                <Button size="sm">Adicionar Imóvel</Button>
              </Link>
            </div>
            
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {properties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onSelect={() => handleSelectProperty(property)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-muted rounded-lg p-6 text-center">
                <p className="text-muted-foreground mb-4">
                  Você ainda não tem imóveis cadastrados.
                </p>
                <Link to="/add-property">
                  <Button>Adicionar Imóvel</Button>
                </Link>
              </div>
            )}
          </div>
          
          <div>
            <SubscriptionOverview />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
