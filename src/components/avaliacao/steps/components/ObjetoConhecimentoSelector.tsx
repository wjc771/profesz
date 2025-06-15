
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface BnccObjetoConhecimento {
  id: string;
  codigo: string;
  nome: string;
  unidade_tematica_id: string;
}

interface ObjetoConhecimentoSelectorProps {
  form: UseFormReturn<any>;
  objetosConhecimento: BnccObjetoConhecimento[];
  selectedTemas: string[];
  loading: boolean;
  onTemaToggle: (temaNome: string) => void;
}

export function ObjetoConhecimentoSelector({ 
  form, 
  objetosConhecimento, 
  selectedTemas, 
  loading,
  onTemaToggle 
}: ObjetoConhecimentoSelectorProps) {
  // Filtro mais rigoroso para garantir que não há IDs vazios
  const validObjetosConhecimento = objetosConhecimento.filter(objeto => 
    objeto && 
    objeto.id && 
    typeof objeto.id === 'string' && 
    objeto.id.trim().length > 0 &&
    objeto.nome && 
    objeto.nome.trim().length > 0
  );

  console.log("ObjetoConhecimentoSelector - Valid objects:", validObjetosConhecimento.length, "Total objects:", objetosConhecimento.length);

  if (validObjetosConhecimento.length === 0) return null;

  return (
    <FormField
      control={form.control}
      name="temas"
      render={() => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Objetos de Conhecimento
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <Badge variant="outline" className="text-xs">Opcional</Badge>
          </FormLabel>
          <div className="grid grid-cols-1 gap-3 mt-2 max-h-48 overflow-y-auto">
            {validObjetosConhecimento.map((objeto) => (
              <div key={objeto.id} className="flex items-center space-x-2">
                <Checkbox
                  id={objeto.id}
                  checked={selectedTemas.includes(objeto.nome)}
                  onCheckedChange={() => onTemaToggle(objeto.nome)}
                />
                <label
                  htmlFor={objeto.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {objeto.nome}
                </label>
              </div>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
