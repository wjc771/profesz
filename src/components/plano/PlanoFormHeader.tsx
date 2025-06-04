
import { SubscriptionPlanType } from "@/types/profile";
import { Book, Star } from "lucide-react";

interface PlanoFormHeaderProps {
  plano: SubscriptionPlanType;
  usageCount: number;
  usageLimit: number | null;
}

export function PlanoFormHeader({ plano, usageCount, usageLimit }: PlanoFormHeaderProps) {
  const getUsageText = () => {
    if (!usageLimit || usageLimit < 0) {
      return "Criação ilimitada";
    }
    return `${usageCount}/${usageLimit} planos restantes este mês`;
  };

  const planDisplayNames = {
    inicial: "PROFZi Inicial",
    essencial: "PROFZi Essencial",
    maestro: "PROFZi Maestro",
    institucional: "PROFZi Institucional",
  };

  const planName = planDisplayNames[plano] || "PROFZi";

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Book className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Criação de Plano de Aula</h1>
      </div>
      <p className="text-muted-foreground mb-4">
        Crie planos de aula personalizados em poucos minutos
      </p>
      
      <div className="flex items-center gap-2 py-2 px-3 rounded-md bg-secondary text-sm">
        <Star className="h-4 w-4 text-amber-500" />
        <span className="font-medium">{planName}:</span>
        <span className="text-muted-foreground">{getUsageText()}</span>
      </div>
    </div>
  );
}
