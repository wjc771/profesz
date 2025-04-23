
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";

interface ObjetivosStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function ObjetivosStep({ form, plano }: ObjetivosStepProps) {
  const [novoObjetivo, setNovoObjetivo] = useState("");
  const [novaHabilidade, setNovaHabilidade] = useState("");
  
  const objetivos = form.watch("objetivos") || [];
  const habilidades = form.watch("habilidadesBNCC") || [];
  
  const adicionarObjetivo = () => {
    if (novoObjetivo.trim() && !objetivos.includes(novoObjetivo.trim())) {
      form.setValue("objetivos", [...objetivos, novoObjetivo.trim()]);
      setNovoObjetivo("");
    }
  };
  
  const removerObjetivo = (index: number) => {
    const atualizados = objetivos.filter((_, i) => i !== index);
    form.setValue("objetivos", atualizados);
  };
  
  const adicionarHabilidade = () => {
    if (novaHabilidade.trim() && !habilidades.includes(novaHabilidade.trim())) {
      form.setValue("habilidadesBNCC", [...habilidades, novaHabilidade.trim()]);
      setNovaHabilidade("");
    }
  };
  
  const removerHabilidade = (index: number) => {
    const atualizadas = habilidades.filter((_, i) => i !== index);
    form.setValue("habilidadesBNCC", atualizadas);
  };
  
  // Habilidades sugeridas baseadas no plano
  const habilidadesSugeridas = plano === "inicial" ? [] : [
    "EF01LP01", "EF02MA01", "EF03CI01", "EF04HI01", "EF05GE01",
    "EF06LP01", "EF07MA01", "EF08CI01", "EF09HI01"
  ];
  
  return (
    <>
      <CardHeader>
        <CardTitle>Objetivos e Alinhamento Curricular</CardTitle>
        <CardDescription>
          Defina os objetivos de aprendizagem e alinhe com a Base Nacional Comum Curricular (BNCC)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="objetivos"
          render={() => (
            <FormItem>
              <FormLabel>Objetivos de Aprendizagem</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Digite um objetivo e pressione Enter"
                    value={novoObjetivo}
                    onChange={(e) => setNovoObjetivo(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        adicionarObjetivo();
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={adicionarObjetivo} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {objetivos.map((objetivo, index) => (
                  <Badge key={index} variant="secondary" className="text-xs py-1.5 pl-2 pr-1">
                    {objetivo}
                    <button
                      type="button"
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removerObjetivo(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={plano === "inicial" ? "opacity-50 pointer-events-none" : ""}>
          <FormField
            control={form.control}
            name="habilidadesBNCC"
            render={() => (
              <FormItem>
                <FormLabel className="flex items-center">
                  Alinhamento com BNCC
                  {plano === "inicial" && <Badge className="ml-2 text-xs">Plano Essencial+</Badge>}
                </FormLabel>
                <FormControl>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Digite um código BNCC (ex: EF01LP01)"
                      value={novaHabilidade}
                      onChange={(e) => setNovaHabilidade(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          adicionarHabilidade();
                        }
                      }}
                      disabled={plano === "inicial"}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={adicionarHabilidade}
                      variant="secondary"
                      disabled={plano === "inicial"}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </FormControl>
                <div className="flex flex-wrap gap-2 mt-2">
                  {habilidades.map((habilidade, index) => (
                    <Badge key={index} variant="outline" className="text-xs py-1.5 pl-2 pr-1">
                      {habilidade}
                      <button
                        type="button"
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => removerHabilidade(index)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                {habilidadesSugeridas.length > 0 && plano !== "inicial" && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Habilidades Sugeridas:</h4>
                    <div className="flex flex-wrap gap-2">
                      {habilidadesSugeridas.map((habilidade) => (
                        <Badge
                          key={habilidade}
                          variant="secondary"
                          className="cursor-pointer text-xs"
                          onClick={() => {
                            if (!habilidades.includes(habilidade)) {
                              form.setValue("habilidadesBNCC", [...habilidades, habilidade]);
                            }
                          }}
                        >
                          {habilidade}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </>
  );
}
