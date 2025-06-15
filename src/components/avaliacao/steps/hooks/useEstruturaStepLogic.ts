
import { useState, useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useBnccData } from "@/hooks/useBnccData";
import { useProfilePreferences } from "@/hooks/useProfilePreferences";

export const useEstruturaStepLogic = (form: UseFormReturn<any>) => {
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

  // Debug log with data validation
  useEffect(() => {
    console.log("EstruturaStep Debug:", {
      materia,
      capitulos: capitulos.length,
      temas: temas.length,
      selectedArea,
      selectedComponente,
      selectedAno,
      selectedUnidades: selectedUnidades.length,
      selectedTemas: selectedTemas.length,
      areasCount: areas.length,
      componentesCount: componentes.length,
      anosEscolaresCount: anosEscolares.length,
      unidadesTematicasCount: unidadesTematicas.length,
      objetosConhecimentoCount: objetosConhecimento.length
    });

    // Log data quality
    console.log("Data Quality Check:", {
      invalidAreas: areas.filter(a => !a.id || !a.nome).length,
      invalidComponentes: componentes.filter(c => !c.id || !c.nome).length,
      invalidAnosEscolares: anosEscolares.filter(a => !a.id || !a.nome).length,
      invalidUnidades: unidadesTematicas.filter(u => !u.id || !u.nome).length,
      invalidObjetos: objetosConhecimento.filter(o => !o.id || !o.nome).length
    });
  }, [materia, capitulos, temas, selectedArea, selectedComponente, selectedAno, selectedUnidades, selectedTemas, areas, componentes, anosEscolares, unidadesTematicas, objetosConhecimento]);

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

  const handleAreaChange = (areaId: string) => {
    console.log("Area changed to:", areaId);
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
    console.log("Componente changed to:", componenteId);
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
    console.log("Ano changed to:", anoId);
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
    console.log("Unidade toggled:", unidadeId, unidadeNome);
    const newSelectedUnidades = selectedUnidades.includes(unidadeId)
      ? selectedUnidades.filter(id => id !== unidadeId)
      : [...selectedUnidades, unidadeId];
    
    setSelectedUnidades(newSelectedUnidades);
    
    const nomes = newSelectedUnidades.map(id => 
      unidadesTematicas.find(u => u.id === id)?.nome || ""
    ).filter(Boolean);
    
    form.setValue("capitulos", nomes);
    
    if (newSelectedUnidades.length > 0) {
      setSelectedTemas([]);
      form.setValue("temas", []);
      
      newSelectedUnidades.forEach(id => {
        fetchObjetosConhecimentoByUnidade(id);
      });
    } else {
      setSelectedTemas([]);
      form.setValue("temas", []);
    }
  };

  const handleTemaToggle = (temaNome: string) => {
    console.log("Tema toggled:", temaNome);
    const newSelectedTemas = selectedTemas.includes(temaNome)
      ? selectedTemas.filter(nome => nome !== temaNome)
      : [...selectedTemas, temaNome];
    
    setSelectedTemas(newSelectedTemas);
    form.setValue("temas", newSelectedTemas);
  };

  // Filtrar anos escolares com base no perfil
  const anosEscolaresFiltrados = anosEscolares.filter(ano => {
    if (!ano || !ano.id || !ano.nome) return false;
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
    if (!comp || !comp.id || !comp.nome) return false;
    if (!preferences?.subjects?.length) return true;
    return preferences.subjects.some(subject => 
      comp.nome.toLowerCase().includes(subject.toLowerCase()) ||
      subject.toLowerCase().includes(comp.nome.toLowerCase())
    );
  });

  return {
    // Data
    areas,
    componentesFiltrados,
    anosEscolaresFiltrados,
    unidadesTematicas,
    objetosConhecimento,
    loading,
    preferences,
    
    // State
    selectedArea,
    selectedComponente,
    selectedAno,
    selectedUnidades,
    selectedTemas,
    
    // Form values
    materia,
    capitulos,
    temas,
    
    // Handlers
    handleAreaChange,
    handleComponenteChange,
    handleAnoChange,
    handleUnidadeToggle,
    handleTemaToggle
  };
};
