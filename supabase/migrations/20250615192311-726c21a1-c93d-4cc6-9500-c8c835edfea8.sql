
-- Adicionar campo onboarding_completed_at à tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN onboarding_completed_at TIMESTAMP WITH TIME ZONE;

-- Criar tabela user_preferences para armazenar dados do questionário
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subjects TEXT[],
  grade_level TEXT,
  institution_type TEXT,
  experience TEXT,
  goals TEXT[],
  frequency TEXT,
  child_name TEXT,
  child_grade TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Habilitar RLS na tabela user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para user_preferences
CREATE POLICY "Users can view their own preferences" 
  ON public.user_preferences 
  FOR SELECT 
  USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert their own preferences" 
  ON public.user_preferences 
  FOR INSERT 
  WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can update their own preferences" 
  ON public.user_preferences 
  FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY "Users can delete their own preferences" 
  ON public.user_preferences 
  FOR DELETE 
  USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);
