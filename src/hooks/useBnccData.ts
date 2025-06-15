
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BnccArea {
  id: string;
  codigo: string;
  nome: string;
  descricao?: string;
}

interface BnccComponente {
  id: string;
  codigo: string;
  nome: string;
  area_id: string;
}

interface BnccAnoEscolar {
  id: string;
  codigo: string;
  nome: string;
  etapa: string;
  ordem: number;
}

interface BnccUnidadeTematica {
  id: string;
  codigo: string;
  nome: string;
  componente_id: string;
  ano_escolar_id: string;
}

interface BnccObjetoConhecimento {
  id: string;
  codigo: string;
  nome: string;
  unidade_tematica_id: string;
}

export const useBnccData = () => {
  const [areas, setAreas] = useState<BnccArea[]>([]);
  const [componentes, setComponentes] = useState<BnccComponente[]>([]);
  const [anosEscolares, setAnosEscolares] = useState<BnccAnoEscolar[]>([]);
  const [unidadesTematicas, setUnidadesTematicas] = useState<BnccUnidadeTematica[]>([]);
  const [objetosConhecimento, setObjetosConhecimento] = useState<BnccObjetoConhecimento[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('bncc_areas_conhecimento')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      setAreas(data || []);
    } catch (error: any) {
      console.error('Error fetching BNCC areas:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar áreas de conhecimento'
      });
    }
  };

  const fetchComponentesByArea = async (areaId: string) => {
    try {
      const { data, error } = await supabase
        .from('bncc_componentes')
        .select('*')
        .eq('area_id', areaId)
        .order('nome');
      
      if (error) throw error;
      setComponentes(data || []);
    } catch (error: any) {
      console.error('Error fetching BNCC components:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar componentes curriculares'
      });
    }
  };

  const fetchAnosEscolares = async () => {
    try {
      const { data, error } = await supabase
        .from('bncc_anos_escolares')
        .select('*')
        .order('ordem');
      
      if (error) throw error;
      setAnosEscolares(data || []);
    } catch (error: any) {
      console.error('Error fetching school years:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar anos escolares'
      });
    }
  };

  const fetchUnidadesTematicasByComponenteAndAno = async (componenteId: string, anoEscolarId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bncc_unidades_tematicas')
        .select('*')
        .eq('componente_id', componenteId)
        .eq('ano_escolar_id', anoEscolarId)
        .order('nome');
      
      if (error) throw error;
      setUnidadesTematicas(data || []);
    } catch (error: any) {
      console.error('Error fetching thematic units:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar unidades temáticas'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchObjetosConhecimentoByUnidade = async (unidadeTematicaId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bncc_objetos_conhecimento')
        .select('*')
        .eq('unidade_tematica_id', unidadeTematicaId)
        .order('nome');
      
      if (error) throw error;
      setObjetosConhecimento(data || []);
    } catch (error: any) {
      console.error('Error fetching knowledge objects:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar objetos de conhecimento'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
    fetchAnosEscolares();
  }, []);

  return {
    areas,
    componentes,
    anosEscolares,
    unidadesTematicas,
    objetosConhecimento,
    loading,
    fetchComponentesByArea,
    fetchUnidadesTematicasByComponenteAndAno,
    fetchObjetosConhecimentoByUnidade
  };
};
