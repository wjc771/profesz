
-- Primeiro, remover as tabelas se existirem para recriar
DROP TABLE IF EXISTS public.bncc_habilidades CASCADE;
DROP TABLE IF EXISTS public.bncc_objetos_conhecimento CASCADE;
DROP TABLE IF EXISTS public.bncc_unidades_tematicas CASCADE;
DROP TABLE IF EXISTS public.bncc_anos_escolares CASCADE;
DROP TABLE IF EXISTS public.bncc_componentes CASCADE;
DROP TABLE IF EXISTS public.bncc_areas_conhecimento CASCADE;

-- Recriar tabelas para estrutura BNCC
CREATE TABLE public.bncc_areas_conhecimento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.bncc_componentes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  area_id UUID REFERENCES public.bncc_areas_conhecimento(id),
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.bncc_anos_escolares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  etapa TEXT NOT NULL, -- 'infantil', 'fundamental1', 'fundamental2', 'medio'
  ordem INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.bncc_unidades_tematicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  componente_id UUID REFERENCES public.bncc_componentes(id),
  ano_escolar_id UUID REFERENCES public.bncc_anos_escolares(id),
  codigo TEXT NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.bncc_objetos_conhecimento (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unidade_tematica_id UUID REFERENCES public.bncc_unidades_tematicas(id),
  codigo TEXT NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.bncc_habilidades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  objeto_conhecimento_id UUID REFERENCES public.bncc_objetos_conhecimento(id),
  codigo TEXT NOT NULL UNIQUE, -- EF01LP01, etc
  descricao TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir dados básicos da estrutura BNCC
INSERT INTO public.bncc_areas_conhecimento (codigo, nome, descricao) VALUES
('LIN', 'Linguagens', 'Linguagens e suas Tecnologias'),
('MAT', 'Matemática', 'Matemática e suas Tecnologias'),
('CNT', 'Ciências da Natureza', 'Ciências da Natureza e suas Tecnologias'),
('CHT', 'Ciências Humanas', 'Ciências Humanas e Sociais Aplicadas'),
('ENS', 'Ensino Religioso', 'Ensino Religioso');

-- Corrigir códigos duplicados (FI para Física e Filosofia)
INSERT INTO public.bncc_componentes (area_id, codigo, nome) VALUES
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'LIN'), 'LP', 'Língua Portuguesa'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'LIN'), 'LE', 'Língua Estrangeira'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'LIN'), 'AR', 'Arte'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'LIN'), 'EF', 'Educação Física'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'MAT'), 'MA', 'Matemática'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'CNT'), 'CI', 'Ciências'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'CNT'), 'BI', 'Biologia'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'CNT'), 'FIS', 'Física'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'CNT'), 'QU', 'Química'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'CHT'), 'HI', 'História'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'CHT'), 'GE', 'Geografia'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'CHT'), 'SO', 'Sociologia'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'CHT'), 'FIL', 'Filosofia'),
((SELECT id FROM public.bncc_areas_conhecimento WHERE codigo = 'ENS'), 'ER', 'Ensino Religioso');

INSERT INTO public.bncc_anos_escolares (codigo, nome, etapa, ordem) VALUES
('EI01', 'Bebês (0-1 ano e 6 meses)', 'infantil', 1),
('EI02', 'Crianças bem pequenas (1 ano e 7 meses - 3 anos e 11 meses)', 'infantil', 2),
('EI03', 'Crianças pequenas (4 anos - 5 anos e 11 meses)', 'infantil', 3),
('EF01', '1º ano', 'fundamental1', 4),
('EF02', '2º ano', 'fundamental1', 5),
('EF03', '3º ano', 'fundamental1', 6),
('EF04', '4º ano', 'fundamental1', 7),
('EF05', '5º ano', 'fundamental1', 8),
('EF06', '6º ano', 'fundamental2', 9),
('EF07', '7º ano', 'fundamental2', 10),
('EF08', '8º ano', 'fundamental2', 11),
('EF09', '9º ano', 'fundamental2', 12),
('EM01', '1º ano do Ensino Médio', 'medio', 13),
('EM02', '2º ano do Ensino Médio', 'medio', 14),
('EM03', '3º ano do Ensino Médio', 'medio', 15);

-- Exemplo de unidades temáticas para Matemática do 1º ano
INSERT INTO public.bncc_unidades_tematicas (componente_id, ano_escolar_id, codigo, nome, descricao) VALUES
((SELECT id FROM public.bncc_componentes WHERE codigo = 'MA'), (SELECT id FROM public.bncc_anos_escolares WHERE codigo = 'EF01'), 'NU', 'Números', 'Números e operações'),
((SELECT id FROM public.bncc_componentes WHERE codigo = 'MA'), (SELECT id FROM public.bncc_anos_escolares WHERE codigo = 'EF01'), 'AL', 'Álgebra', 'Álgebra e funções'),
((SELECT id FROM public.bncc_componentes WHERE codigo = 'MA'), (SELECT id FROM public.bncc_anos_escolares WHERE codigo = 'EF01'), 'GE', 'Geometria', 'Geometria'),
((SELECT id FROM public.bncc_componentes WHERE codigo = 'MA'), (SELECT id FROM public.bncc_anos_escolares WHERE codigo = 'EF01'), 'GM', 'Grandezas e medidas', 'Grandezas e medidas'),
((SELECT id FROM public.bncc_componentes WHERE codigo = 'MA'), (SELECT id FROM public.bncc_anos_escolares WHERE codigo = 'EF01'), 'EP', 'Probabilidade e estatística', 'Probabilidade e estatística');

-- Exemplo de objetos de conhecimento para Números do 1º ano
INSERT INTO public.bncc_objetos_conhecimento (unidade_tematica_id, codigo, nome, descricao) VALUES
((SELECT id FROM public.bncc_unidades_tematicas WHERE codigo = 'NU' AND ano_escolar_id = (SELECT id FROM public.bncc_anos_escolares WHERE codigo = 'EF01')), 'CT', 'Contagem', 'Contagem de rotina. Contagem ascendente e descendente'),
((SELECT id FROM public.bncc_unidades_tematicas WHERE codigo = 'NU' AND ano_escolar_id = (SELECT id FROM public.bncc_anos_escolares WHERE codigo = 'EF01')), 'QN', 'Quantificação', 'Quantificação de elementos de uma coleção'),
((SELECT id FROM public.bncc_unidades_tematicas WHERE codigo = 'NU' AND ano_escolar_id = (SELECT id FROM public.bncc_anos_escolares WHERE codigo = 'EF01')), 'LN', 'Leitura, escrita e comparação de números naturais', 'Leitura, escrita e comparação de números naturais (até 100)');

-- Exemplo de habilidades
INSERT INTO public.bncc_habilidades (objeto_conhecimento_id, codigo, descricao) VALUES
((SELECT id FROM public.bncc_objetos_conhecimento WHERE codigo = 'CT'), 'EF01MA01', 'Utilizar números naturais como indicador de quantidade ou de ordem em diferentes situações cotidianas e reconhecer situações em que os números não indicam contagem nem ordem, mas sim código de identificação'),
((SELECT id FROM public.bncc_objetos_conhecimento WHERE codigo = 'QN'), 'EF01MA02', 'Contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos'),
((SELECT id FROM public.bncc_objetos_conhecimento WHERE codigo = 'LN'), 'EF01MA03', 'Estimar e comparar quantidades de objetos de dois conjuntos (em torno de 20 elementos), por estimativa e/ou por correspondência (um a um, dois a dois) para indicar "tem mais", "tem menos" ou "tem a mesma quantidade"');

-- Habilitar RLS para as novas tabelas
ALTER TABLE public.bncc_areas_conhecimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bncc_componentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bncc_anos_escolares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bncc_unidades_tematicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bncc_objetos_conhecimento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bncc_habilidades ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (leitura pública para todos os usuários autenticados)
CREATE POLICY "Allow read access to BNCC areas" ON public.bncc_areas_conhecimento FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access to BNCC components" ON public.bncc_componentes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access to BNCC school years" ON public.bncc_anos_escolares FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access to BNCC thematic units" ON public.bncc_unidades_tematicas FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access to BNCC knowledge objects" ON public.bncc_objetos_conhecimento FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow read access to BNCC skills" ON public.bncc_habilidades FOR SELECT USING (auth.role() = 'authenticated');
