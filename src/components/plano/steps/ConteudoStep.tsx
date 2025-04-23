
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";

interface ConteudoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function ConteudoStep({ form, plano }: ConteudoStepProps) {
  const [novoTopico, setNovoTopico] = useState("");
  const [novoRecurso, setNovoRecurso] = useState("");
  
  const topicos = form.watch("topicos") || [];
  const recursos = form.watch("recursos") || [];
  
  const adicionarTopico = () => {
    if (novoTopico.trim() && !topicos.includes(novoTopico.trim())) {
      form.setValue("topicos", [...topicos, novoTopico.trim()]);
      setNovoTopico("");
    }
  };
  
  const removerTopico = (index: number) => {
    const atualizados = topicos.filter((_, i) => i !== index);
    form.setValue("topicos", atualizados);
  };
  
  const adicionarRecurso = () => {
    if (novoRecurso.trim() && !recursos.includes(novoRecurso.trim())) {
      form.setValue("recursos", [...recursos, novoRecurso.trim()]);
      setNovoRecurso("");
    }
  };
  
  const removerRecurso = (index: number) => {
    const atualizados = recursos.filter((_, i) => i !== index);
    form.setValue("recursos", atualizados);
  };
  
  const abordagens = [
    { value: "aula-expositiva", label: "Aula expositiva" },
    { value: "aprendizagem-projetos", label: "Aprendizagem baseada em projetos" },
    { value: "sala-invertida", label: "Sala de aula invertida" },
    { value: "aprendizagem-colaborativa", label: "Aprendizagem colaborativa" },
    { value: "gamificacao", label: "Gamificação" },
    { value: "aprendizagem-autonoma", label: "Aprendizagem autônoma" },
    { value: "rotacao-estacoes", label: "Rotação por estações" }
  ];
  
  // Recursos sugeridos com base no plano
  const recursosSugeridos = [
    "Livro didático",
    "Quadro/Lousa",
    "Projetor/Slides",
    "Computadores/tablets",
    "Material impresso"
  ];
  
  if (plano !== "inicial") {
    recursosSugeridos.push("Plataformas digitais", "Aplicativos educacionais", "Vídeos");
  }
  
  if (plano === "maestro" || plano === "institucional") {
    recursosSugeridos.push("Laboratórios virtuais", "Realidade aumentada", "Jogos educativos personalizados");
  }
  
  return (
    <>
      <CardHeader>
        <CardTitle>Conteúdo e Metodologia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="tema"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tema Central</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Frações no cotidiano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="topicos"
          render={() => (
            <FormItem>
              <FormLabel>Tópicos a serem abordados</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Adicione um tópico"
                    value={novoTopico}
                    onChange={(e) => setNovoTopico(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        adicionarTopico();
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={adicionarTopico} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {topicos.map((topico, index) => (
                  <Badge key={index} variant="secondary" className="text-xs py-1.5 pl-2 pr-1">
                    {topico}
                    <button
                      type="button"
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removerTopico(index)}
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
        
        <FormField
          control={form.control}
          name="abordagem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abordagem Pedagógica</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma abordagem" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {abordagens.map((abordagem) => (
                    <SelectItem key={abordagem.value} value={abordagem.value}>
                      {abordagem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="recursos"
          render={() => (
            <FormItem>
              <FormLabel>Recursos Necessários</FormLabel>
              <FormControl>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Adicione um recurso"
                    value={novoRecurso}
                    onChange={(e) => setNovoRecurso(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        adicionarRecurso();
                      }
                    }}
                  />
                  <Button type="button" size="sm" onClick={adicionarRecurso} variant="secondary">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {recursos.map((recurso, index) => (
                  <Badge key={index} variant="secondary" className="text-xs py-1.5 pl-2 pr-1">
                    {recurso}
                    <button
                      type="button"
                      className="ml-1 text-muted-foreground hover:text-foreground"
                      onClick={() => removerRecurso(index)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Recursos Sugeridos:</h4>
                <div className="flex flex-wrap gap-2">
                  {recursosSugeridos.map((recurso) => (
                    <Badge
                      key={recurso}
                      variant="outline"
                      className="cursor-pointer text-xs"
                      onClick={() => {
                        if (!recursos.includes(recurso)) {
                          form.setValue("recursos", [...recursos, recurso]);
                        }
                      }}
                    >
                      {recurso}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </>
  );
}
