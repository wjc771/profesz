
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface BnccUnidadeTematica {
  id: string;
  codigo: string;
  nome: string;
  componente_id: string;
  ano_escolar_id: string;
}

interface UnidadeTematicaSelectorProps {
  form: UseFormReturn<any>;
  unidadesTematicas: BnccUnidadeTematica[];
  selectedUnidades: string[];
  loading: boolean;
  onUnidadeToggle: (unidadeId: string, unidadeNome: string) => void;
}

export function UnidadeTematicaSelector({ 
  form, 
  unidadesTematicas, 
  selectedUnidades, 
  loading,
  onUnidadeToggle 
}: UnidadeTematicaSelectorProps) {
  if (unidadesTematicas.length === 0) return null;

  return (
    <FormField
      control={form.control}
      name="capitulos"
      render={() => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Unidades Temáticas *
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </FormLabel>
          <div className="grid grid-cols-1 gap-3 mt-2">
            {unidadesTematicas.map((unidade) => (
              <div key={unidade.id} className="flex items-center space-x-2">
                <Checkbox
                  id={unidade.id}
                  checked={selectedUnidades.includes(unidade.id)}
                  onCheckedChange={() => onUnidadeToggle(unidade.id, unidade.nome)}
                />
                <label
                  htmlFor={unidade.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {unidade.nome}
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
