
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { mockProperties } from "@/lib/mockData";
import { Property } from "@/types/property";
import PropertySwiper from "@/components/property/PropertySwiper";

export default function Index() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [properties] = useState(mockProperties);

  const handleLikeProperty = (property: Property) => {
    toast({
      title: "Imóvel curtido",
      description: `Você curtiu ${property.title}`,
    });
    // Em uma aplicação real, isso salvaria o imóvel como favoritado no banco de dados
  };

  const handleDislikeProperty = (property: Property) => {
    toast({
      title: "Imóvel descartado",
      description: `Você descartou ${property.title}`,
    });
    // Em uma aplicação real, isso removeria o imóvel das sugestões futuras
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Olá, {user?.email?.split('@')[0] || 'usuário'}</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao MatchImobiliário. Encontre o imóvel perfeito para você.
          </p>
        </div>

        <div className="w-full max-w-md mx-auto h-[500px] relative">
          <PropertySwiper 
            properties={properties} 
            onLike={handleLikeProperty}
            onDislike={handleDislikeProperty}
          />
        </div>
      </div>
    </MainLayout>
  );
}
