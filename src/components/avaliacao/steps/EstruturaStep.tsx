
import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SubscriptionPlanType } from "@/types/profile";
import { UseFormReturn } from "react-hook-form";
import { useBnccData } from "@/hooks/useBnccData";
import { useProfilePreferences } from "@/hooks/useProfilePreferences";
import { Loader2, Info, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EstruturaStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function EstruturaStep({ form, plano }: EstruturaStepProps) {
  const { preferences } = useProfilePreferences();
  const { 
    areas, 
    componentes, 
    anosEscolares, 
    unidadesTematicas, 
    objetosConhecimento,
    loading,
    fetchComponentesByArea,
    fetchUnidadesTematicasByComponenteAndAno,
    fetchObjetosConhecimentoByUnidade
  } = useBnccData();

  const [selectedArea, setSelectedArea] = useState("");
  const [selectedComponente, setSelectedComponente] = useState("");
  const [selectedAno, setSelectedAno] = useState("");
  const [selectedUnidades, setSelectedUnidades] = useState<string[]>([]);
  const [selectedTemas, setSelectedTemas] = useState<string[]>([]);

  // Watch form values
  const materia = form.watch("materia");
  const capitulos = form.watch("capitulos") || [];
  const temas = form.watch("temas") || [];

  // Debug log
  useEffect(() => {
    console.log("EstruturaStep Debug:", {
      materia,
      capitulos: capitulos.length,
      temas: temas.length,
      selectedArea,
      selectedComponente,
      selectedAno,
      selectedUnidades: selectedUnidades.length,
      selectedTemas: selectedTemas.length
    });
  }, [materia, capitulos, temas, selectedArea, selectedComponente, selectedAno, selectedUnidades, selectedTemas]);

  // Pré-selecionar baseado nas preferências do usuário
  useEffect(() => {
    if (preferences?.grade_level && anosEscolares.length > 0) {
      const anoPreferido = anosEscolares.find(ano => 
        ano.nome.toLowerCase().includes(preferences.grade_level?.toLowerCase() || "")
      );
      if (anoPreferido) {
        setSelectedAno(anoPreferido.id);
      }
    }
  }, [preferences, anosEscolares]);

  // Filtrar anos escolares com base no perfil
  const anosEscolaresFiltrados = anosEscolares.filter(ano => {
    if (!preferences?.grade_level) return true;
    
    const gradeLevel = preferences.grade_level.toLowerCase();
    if (gradeLevel.includes('fundamental')) {
      return ano.etapa === 'fundamental1' || ano.etapa === 'fundamental2';
    }
    if (gradeLevel.includes('médio') || gradeLevel.includes('medio')) {
      return ano.etapa === 'medio';
    }
    if (gradeLevel.includes('infantil')) {
      return ano.etapa === 'infantil';
    }
    return true;
  });

  // Filtrar componentes baseado nas preferências
  const componentesFiltrados = componentes.filter(comp => {
    if (!preferences?.subjects?.length) return true;
    return preferences.subjects.some(subject => 
      comp.nome.toLowerCase().includes(subject.toLowerCase()) ||
      subject.toLowerCase().includes(comp.nome.toLowerCase())
    );
  });

  const handleAreaChange = (areaId: string) => {
    setSelectedArea(areaId);
    setSelectedComponente("");
    setSelectedUnidades([]);
    setSelectedTemas([]);
    form.setValue("materia", "");
    form.setValue("capitulos", []);
    form.setValue("temas", []);
    fetchComponentesByArea(areaId);
  };

  const handleComponenteChange = (componenteId: string) => {
    setSelectedComponente(componenteId);
    setSelectedUnidades([]);
    setSelectedTemas([]);
    form.setValue("capitulos", []);
    form.setValue("temas", []);
    
    const componenteSelecionado = componentes.find(c => c.id === componenteId);
    if (componenteSelecionado) {
      form.setValue("materia", componenteSelecionado.nome);
      if (selectedAno) {
        fetchUnidadesTematicasByComponenteAndAno(componenteId, selectedAno);
      }
    }
  };

  const handleAnoChange = (anoId: string) => {
    setSelectedAno(anoId);
    setSelectedUnidades([]);
    setSelectedTemas([]);
    form.setValue("capitulos", []);
    form.setValue("temas", []);
    
    if (selectedComponente) {
      fetchUnidadesTematicasByComponenteAndAno(selectedComponente, anoId);
    }
  };

  const handleUnidadeToggle = (unidadeId: string, unidadeNome: string) => {
    const newSelectedUnidades = selectedUnidades.includes(unidadeId)
      ? selectedUnidades.filter(id => id !== unidadeId)
      : [...selectedUnidades, unidadeId];
    
    setSelectedUnidades(newSelectedUnidades);
    
    const nomes = newSelectedUnidades.map(id => 
      unidadesTematicas.find(u => u.id === id)?.nome || ""
    ).filter(Boolean);
    
    form.setValue("capitulos", nomes);
    
    // Carregar objetos de conhecimento para as unidades selecionadas
    if (newSelectedUnidades.length > 0) {
      // Clear existing objetos first
      setSelectedTemas([]);
      form.setValue("temas", []);
      
      newSelectedUnidades.forEach(id => {
        fetchObjetosConhecimentoByUnidade(id);
      });
    } else {
      // Limpar temas se nenhuma unidade estiver selecionada
      setSelectedTemas([]);
      form.setValue("temas", []);
    }
  };

  const handleTemaToggle = (temaNome: string) => {
    const newSelectedTemas = selectedTemas.includes(temaNome)
      ? selectedTemas.filter(nome => nome !== temaNome)
      : [...selectedTemas, temaNome];
    
    setSelectedTemas(newSelectedTemas);
    form.setValue("temas", newSelectedTemas);
  };

  const canUseBncc = plano !== 'inicial';

  // Verificar se há objetos de conhecimento disponíveis
  const hasObjetosConhecimento = objetosConhecimento.length > 0;
  const hasSelectedUnidades = selectedUnidades.length > 0;

  return (
    <TooltipProvider>
      <>
        <CardHeader>
          <CardTitle>Estrutura Curricular</CardTitle>
          <CardDescription>
            Selecione os componentes curriculares baseados no seu perfil e na BNCC
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status da Validação */}
          <div className="p-3 bg-blue-50 rounded-lg text-sm">
            <strong>Status da Validação:</strong>
            <div>Matéria: {materia ? '✓' : '✗'} ({materia || 'não selecionada'})</div>
            <div>Unidades Temáticas: {capitulos?.length > 0 ? '✓' : '✗'} ({capitulos?.length || 0} selecionadas)</div>
            <div>Objetos de Conhecimento: {temas?.length > 0 ? '✓' : hasObjetosConhecimento ? '✗' : 'N/A'} ({temas?.length || 0} selecionados)</div>
            <div className="font-semibold mt-2">
              Pode avançar: {(materia && capitulos?.length > 0) ? '✓ SIM' : '✗ NÃO'}
            </div>
          </div>

          {/* Área de Conhecimento */}
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
                <Select onValueChange={handleAreaChange} value={selectedArea}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma área de conhecimento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {areas.map((area) => (
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

          {/* Componente Curricular (Matéria) */}
          <FormField
            control={form.control}
            name="materia"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Componente Curricular *
                  {preferences?.subjects?.length && (
                    <Badge variant="outline" className="text-xs">
                      Baseado no seu perfil
                    </Badge>
                  )}
                </FormLabel>
                <Select 
                  onValueChange={handleComponenteChange} 
                  value={selectedComponente}
                  disabled={!selectedArea}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um componente curricular" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {componentesFiltrados.map((componente) => (
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

          {/* Ano Escolar */}
          <FormField
            control={form.control}
            name="anoEscolar"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  Ano Escolar
                  {preferences?.grade_level && (
                    <Badge variant="outline" className="text-xs">
                      Pré-selecionado
                    </Badge>
                  )}
                </FormLabel>
                <Select onValueChange={handleAnoChange} value={selectedAno}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano escolar" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {anosEscolaresFiltrados.map((ano) => (
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

          {/* Unidades Temáticas (Capítulos) */}
          {unidadesTematicas.length > 0 && (
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
                          onCheckedChange={() => handleUnidadeToggle(unidade.id, unidade.nome)}
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
          )}

          {/* Alerta quando não há objetos de conhecimento */}
          {hasSelectedUnidades && !hasObjetosConhecimento && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Os objetos de conhecimento para as unidades selecionadas ainda não estão disponíveis no sistema. 
                Você pode prosseguir com apenas as unidades temáticas selecionadas.
              </AlertDescription>
            </Alert>
          )}

          {/* Objetos de Conhecimento (Temas) */}
          {objetosConhecimento.length > 0 && (
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
                    {objetosConhecimento.map((objeto) => (
                      <div key={objeto.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={objeto.id}
                          checked={selectedTemas.includes(objeto.nome)}
                          onCheckedChange={() => handleTemaToggle(objeto.nome)}
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
          )}

          {/* BNCC Alignment */}
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
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Adicionar códigos de habilidades específicas da BNCC
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </>
    </TooltipProvider>
  );
}
