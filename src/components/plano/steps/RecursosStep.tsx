
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";

interface RecursosStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function RecursosStep({ form, plano }: RecursosStepProps) {
  const [novoMaterial, setNovoMaterial] = useState("");
  
  const materiais = form.watch("materiaisComplementares") || [];
  
  const adicionarMaterial = () => {
    if (novoMaterial.trim() && !materiais.includes(novoMaterial.trim())) {
      form.setValue("materiaisComplementares", [...materiais, novoMaterial.trim()]);
      setNovoMaterial("");
    }
  };
  
  const removerMaterial = (index: number) => {
    const atualizados = materiais.filter((_, i) => i !== index);
    form.setValue("materiaisComplementares", atualizados);
  };
  
  // Limites de recursos por plano
  const limiteRecursos = {
    inicial: 3,
    essencial: 10,
    maestro: -1, // ilimitado
    institucional: -1, // ilimitado
  };
  
  const limite = limiteRecursos[plano];
  const atingiuLimite = limite > 0 && materiais.length >= limite;
  
  // Recursos sugeridos com base no plano
  const materiaisSugeridos = [
    "Vídeos educativos sobre o tema",
    "Livro didático, páginas 10-15",
    "Aplicativo de exercícios",
  ];
  
  if (plano !== "inicial") {
    materiaisSugeridos.push(
      "Atlas digital interativo",
      "Quiz online para revisão",
      "Software de simulação",
    );
  }
  
  return (
    <>
      <CardHeader>
        <CardTitle>Recursos Adicionais</CardTitle>
        <CardDescription>
          Sugira materiais complementares para enriquecer o aprendizado
          {limite > 0 && (
            <span className="block text-sm mt-1">
              Seu plano permite até {limite} recursos complementares
            </span>
          )}
          {limite < 0 && plano === "maestro" && (
            <span className="block text-sm mt-1">
              Seu plano permite recursos ilimitados com recomendação inteligente
            </span>
          )}
          {limite < 0 && plano === "institucional" && (
            <span className="block text-sm mt-1">
              Seu plano permite recursos ilimitados com personalização institucional
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="materiaisComplementares"
          render={() => (
            <FormItem>
              <FormLabel>Sugestões de Material Complementar</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Adicione um material complementar"
                    value={novoMaterial}
                    onChange={(e) => setNovoMaterial(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        adicionarMaterial();
                      }
                    }}
                    disabled={atingiuLimite}
                  />
                  <Button 
                    type="button" 
                    size="sm" 
                    onClick={adicionarMaterial} 
                    variant="secondary"
                    disabled={atingiuLimite}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              
              {atingiuLimite && (
                <p className="text-xs text-amber-600 mt-1">
                  Você atingiu o limite de {limite} recursos para seu plano atual.
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mt-2">
                {materiais.map((material, index) => (
                  <Badge key={index} variant="secondary" className="text-xs py-1.5 pl-2 pr-1">
                    {material}
                    <button
                      type="button"
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removerMaterial(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              {materiais.length === 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  Nenhum material complementar adicionado ainda.
                </p>
              )}
              
              {!atingiuLimite && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Sugestões:</h4>
                  <div className="flex flex-wrap gap-2">
                    {materiaisSugeridos.map((material) => (
                      <Badge
                        key={material}
                        variant="outline"
                        className="cursor-pointer text-xs"
                        onClick={() => {
                          if (!materiais.includes(material) && (limite < 0 || materiais.length < limite)) {
                            form.setValue("materiaisComplementares", [...materiais, material]);
                          }
                        }}
                      >
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2 mt-6">
          <h3 className="text-sm font-medium">Funcionalidades disponíveis por plano:</h3>
          
          <div className="bg-muted p-4 rounded-md text-sm space-y-3">
            <div>
              <span className="font-medium">ProfeXpress Inicial:</span>
              <ul className="list-disc ml-5 mt-1 text-muted-foreground">
                <li>Acesso a templates básicos</li>
                <li>Geração simplificada (sem personalização avançada)</li>
                <li>Exportação apenas em PDF</li>
                <li>Limite de planos por mês</li>
              </ul>
            </div>
            
            <div className={plano === "inicial" ? "opacity-60" : ""}>
              <span className="font-medium">ProfeXpress Essencial:</span>
              <ul className="list-disc ml-5 mt-1 text-muted-foreground">
                <li>Templates diversificados</li>
                <li>Alinhamento automático com BNCC (básico)</li>
                <li>Recomendação de recursos</li>
                <li>Exportação em múltiplos formatos</li>
              </ul>
            </div>
            
            <div className={plano === "inicial" || plano === "essencial" ? "opacity-60" : ""}>
              <span className="font-medium">ProfeXpress Maestro:</span>
              <ul className="list-disc ml-5 mt-1 text-muted-foreground">
                <li>Criação ilimitada</li>
                <li>Personalização avançada por perfil de turma</li>
                <li>Banco de atividades expandido</li>
                <li>Rubricas de avaliação</li>
              </ul>
            </div>
            
            <div className={plano !== "institucional" ? "opacity-60" : ""}>
              <span className="font-medium">ProfeXpress Institucional:</span>
              <ul className="list-disc ml-5 mt-1 text-muted-foreground">
                <li>Integração com currículo da instituição</li>
                <li>Banco de recursos próprio</li>
                <li>Compartilhamento interno</li>
                <li>Métricas de uso</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}
