
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
              {areas.filter(area => area.id && area.id.trim() !== "").map((area) => (
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
