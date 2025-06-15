
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlanType } from "@/types/profile";

interface ValidationStatusProps {
  plano: SubscriptionPlanType;
  materia: string;
  capitulos: string[];
  temas: string[];
  hasObjetosConhecimento: boolean;
}

export function ValidationStatus({ 
  plano, 
  materia, 
  capitulos, 
  temas, 
  hasObjetosConhecimento 
}: ValidationStatusProps) {
  return (
    <div className="p-3 bg-blue-50 rounded-lg text-sm">
      <strong>Status da Validação:</strong>
      <div>Plano: {plano} {plano === 'maestro' && '✓ (Admin)'}</div>
      <div>Matéria: {materia ? '✓' : '✗'} ({materia || 'não selecionada'})</div>
      <div>Unidades Temáticas: {capitulos?.length > 0 ? '✓' : '✗'} ({capitulos?.length || 0} selecionadas)</div>
      <div>Objetos de Conhecimento: {temas?.length > 0 ? '✓' : hasObjetosConhecimento ? '✗' : 'N/A'} ({temas?.length || 0} selecionados)</div>
      <div className="font-semibold mt-2">
        Pode avançar: {(materia && capitulos?.length > 0) ? '✓ SIM' : '✗ NÃO'}
      </div>
    </div>
  );
}
