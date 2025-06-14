
-- Criar o tipo enum user_type apenas se não existir
DO $$ BEGIN
    CREATE TYPE user_type AS ENUM ('professor', 'instituicao', 'aluno', 'pais');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Criar o tipo enum subscription_plan_type apenas se não existir
DO $$ BEGIN
    CREATE TYPE subscription_plan_type AS ENUM ('inicial', 'essencial', 'maestro', 'institucional');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verificar se a tabela profiles existe e tem a estrutura correta
-- Se não existir, criar ela
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  type user_type NOT NULL DEFAULT 'professor',
  phone text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  subscription_plan_id subscription_plan_type DEFAULT 'inicial',
  avatar_url text,
  school_name text,
  PRIMARY KEY (id)
);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se existirem
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Criar políticas RLS para a tabela profiles
CREATE POLICY "Users can view own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Recriar a função handle_new_user para garantir que funcione corretamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'type')::user_type, 'professor'::user_type)
  );
  RETURN NEW;
END;
$$;

-- Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
