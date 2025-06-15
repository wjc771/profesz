
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface BnccArea {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
}

interface AreaSelectorProps {
  form: UseFormReturn<any>;
  areas: BnccArea[];
  selectedArea: string;
  onAreaChange: (areaId: string) => void;
}

export function AreaSelector({ form, areas, selectedArea, onAreaChange }: AreaSelectorProps) {
  // Filtro mais rigoroso para garantir que não há IDs vazios
  const validAreas = areas.filter(area => 
    area && 
    area.id && 
    typeof area.id === 'string' && 
    area.id.trim().length > 0 &&
    area.nome && 
    area.nome.trim().length > 0
  );

  return (
    <FormField
      control={form.control}
      name="area"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Área de Conhecimento
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Áreas conforme a Base Nacional Comum Curricular (BNCC)</p>
              </TooltipContent>
            </Tooltip>
          </FormLabel>
          <Select onValueChange={onAreaChange} value={selectedArea}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma área de conhecimento" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validAreas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.nome}
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
