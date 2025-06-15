
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";

interface BnccComponente {
  id: string;
  codigo: string;
  nome: string;
  area_id: string;
}

interface ComponenteSelectorProps {
  form: UseFormReturn<any>;
  componentes: BnccComponente[];
  selectedComponente: string;
  selectedArea: string;
  hasSubjectsInProfile: boolean;
  onComponenteChange: (componenteId: string) => void;
}

export function ComponenteSelector({ 
  form, 
  componentes, 
  selectedComponente, 
  selectedArea, 
  hasSubjectsInProfile,
  onComponenteChange 
}: ComponenteSelectorProps) {
  // Filtro mais rigoroso para garantir que não há IDs vazios
  const validComponentes = componentes.filter(componente => 
    componente && 
    componente.id && 
    typeof componente.id === 'string' && 
    componente.id.trim().length > 0 &&
    componente.nome && 
    componente.nome.trim().length > 0
  );

  return (
    <FormField
      control={form.control}
      name="materia"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Componente Curricular *
            {hasSubjectsInProfile && (
              <Badge variant="outline" className="text-xs">
                Baseado no seu perfil
              </Badge>
            )}
          </FormLabel>
          <Select 
            onValueChange={onComponenteChange} 
            value={selectedComponente}
            disabled={!selectedArea}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um componente curricular" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validComponentes.map((componente) => (
                <SelectItem key={componente.id} value={componente.id}>
                  {componente.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
