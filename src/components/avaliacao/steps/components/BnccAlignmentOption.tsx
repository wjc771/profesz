
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";

interface BnccAlignmentOptionProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function BnccAlignmentOption({ form, plano }: BnccAlignmentOptionProps) {
  const canUseBncc = plano !== 'inicial';

  return (
    <div className={!canUseBncc ? "opacity-50 pointer-events-none" : ""}>
      <FormField
        control={form.control}
        name="incluirBncc"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value || false}
                onCheckedChange={field.onChange}
                disabled={!canUseBncc}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="flex items-center gap-2">
                Incluir alinhamento detalhado com BNCC
                {!canUseBncc && <Badge className="text-xs">Plano Essencial+</Badge>}
                {canUseBncc && plano === 'maestro' && <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Admin</Badge>}
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Adicionar códigos de habilidades específicas da BNCC
              </p>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
