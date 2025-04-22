
import { Badge } from "@/components/ui/badge";

// Pode receber o plano por props, aqui exemplo "Plano Básico"
type PlanIndicatorProps = {
  plan?: string;
};
export function PlanIndicator({ plan = "Básico" }: PlanIndicatorProps) {
  return (
    <Badge className="bg-primary/10 text-primary border-primary/30 px-3 py-1 rounded font-bold ml-3" variant="outline">
      {plan}
    </Badge>
  );
}
