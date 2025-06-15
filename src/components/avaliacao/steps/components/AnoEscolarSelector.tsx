
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";

interface BnccAnoEscolar {
  id: string;
  codigo: string;
  nome: string;
  etapa: string;
  ordem: number;
}

interface AnoEscolarSelectorProps {
  form: UseFormReturn<any>;
  anosEscolares: BnccAnoEscolar[];
  selectedAno: string;
  hasGradeLevelInProfile: boolean;
  onAnoChange: (anoId: string) => void;
}

export function AnoEscolarSelector({ 
  form, 
  anosEscolares, 
  selectedAno, 
  hasGradeLevelInProfile,
  onAnoChange 
}: AnoEscolarSelectorProps) {
  // Filtro mais rigoroso para garantir que não há IDs vazios
  const validAnosEscolares = anosEscolares.filter(ano => 
    ano && 
    ano.id && 
    typeof ano.id === 'string' && 
    ano.id.trim().length > 0 &&
    ano.nome && 
    ano.nome.trim().length > 0
  );

  return (
    <FormField
      control={form.control}
      name="anoEscolar"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            Ano Escolar
            {hasGradeLevelInProfile && (
              <Badge variant="outline" className="text-xs">
                Pré-selecionado
              </Badge>
            )}
          </FormLabel>
          <Select onValueChange={onAnoChange} value={selectedAno}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano escolar" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {validAnosEscolares.map((ano) => (
                <SelectItem key={ano.id} value={ano.id}>
                  {ano.nome}
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
