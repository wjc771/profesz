
-- Add new columns to profiles table if they don't exist yet
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS creci TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS agency_name TEXT;

-- Update the subscription_plan_id column if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_plan_id TEXT DEFAULT 'free';

-- Update existing profiles to have descriptive names
UPDATE profiles 
SET name = 'Maria Oliveira',
    subscription_plan_id = 'free'
WHERE type = 'buyer' 
LIMIT 1;

UPDATE profiles 
SET name = 'João Silva',
    subscription_plan_id = 'personal'
WHERE type = 'owner' 
LIMIT 1;

-- Create mock users for each profile type with different subscription plans

-- BUYERS (3 profiles with different plans)
INSERT INTO profiles (id, email, name, type, phone, subscription_plan_id, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'carlos@exemplo.com', 'Carlos Mendes', 'buyer', '11987654321', 'free', now(), now()),
    (gen_random_uuid(), 'ana@exemplo.com', 'Ana Beatriz', 'buyer', '11976543210', 'personal', now(), now()),
    (gen_random_uuid(), 'paulo@exemplo.com', 'Paulo Ferreira', 'buyer', '11965432109', 'professional', now(), now())
ON CONFLICT (id) DO NOTHING;

-- OWNERS (3 profiles with different plans)
INSERT INTO profiles (id, email, name, type, phone, subscription_plan_id, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'roberto@exemplo.com', 'Roberto Almeida', 'owner', '11954321098', 'free', now(), now()),
    (gen_random_uuid(), 'claudia@exemplo.com', 'Cláudia Santos', 'owner', '11943210987', 'personal', now(), now()),
    (gen_random_uuid(), 'marcelo@exemplo.com', 'Marcelo Lima', 'owner', '11932109876', 'professional', now(), now())
ON CONFLICT (id) DO NOTHING;

-- AGENTS (3 profiles with different plans and CRECI numbers)
INSERT INTO profiles (id, email, name, type, phone, subscription_plan_id, creci, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'juliana@exemplo.com', 'Juliana Costa', 'agent', '11921098765', 'free', '98765', now(), now()),
    (gen_random_uuid(), 'ricardo@exemplo.com', 'Ricardo Gomes', 'agent', '11910987654', 'personal', '87654', now(), now()),
    (gen_random_uuid(), 'fernanda@exemplo.com', 'Fernanda Pereira', 'agent', '11909876543', 'professional', '76543', now(), now())
ON CONFLICT (id) DO NOTHING;

-- AGENCIES (3 profiles with different plans, agency names and CRECI numbers)
INSERT INTO profiles (id, email, name, type, phone, subscription_plan_id, agency_name, creci, created_at, updated_at)
VALUES 
    (gen_random_uuid(), 'imobiliaria1@exemplo.com', 'Diretor Executivo', 'agency', '11898765432', 'free', 'Imobiliária Lar Feliz', '65432', now(), now()),
    (gen_random_uuid(), 'imobiliaria2@exemplo.com', 'Gerente Comercial', 'agency', '11887654321', 'personal', 'Central Imóveis', '54321', now(), now()),
    (gen_random_uuid(), 'imobiliaria3@exemplo.com', 'Diretor Geral', 'agency', '11876543210', 'professional', 'Elite Imobiliária', '43210', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert sample properties for different owners
INSERT INTO public.properties (
  title, 
  description, 
  type, 
  transaction_type, 
  price, 
  address, 
  neighborhood, 
  city, 
  state, 
  zip_code, 
  bedrooms, 
  bathrooms, 
  parking_spaces, 
  area,
  owner_id,
  images,
  is_premium
) 
VALUES 
-- Properties for free owner plan
('Apartamento Compacto', 'Ótimo apartamento para investimento', 'apartment', 'sale', 250000, 'Rua das Flores, 123', 'Centro', 'São Paulo', 'SP', '01000-000', 1, 1, 0, 45, 
  (SELECT id FROM profiles WHERE type = 'owner' AND subscription_plan_id = 'free' LIMIT 1), 
  ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=2576&auto=format&fit=crop'],
  false),

-- Properties for personal owner plan
('Casa em Condomínio', 'Casa espaçosa com quintal e área de lazer', 'house', 'sale', 750000, 'Alameda dos Ipês, 456', 'Jardim Europa', 'Campinas', 'SP', '13050-000', 3, 2, 2, 150, 
  (SELECT id FROM profiles WHERE type = 'owner' AND subscription_plan_id = 'personal' LIMIT 1), 
  ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1430285561322-7808604715df?q=80&w=2670&auto=format&fit=crop'],
  true),

('Apartamento Duplex', 'Excelente apartamento com dois andares', 'apartment', 'rent', 3500, 'Av. Paulista, 1000', 'Bela Vista', 'São Paulo', 'SP', '01310-000', 3, 2, 2, 120, 
  (SELECT id FROM profiles WHERE type = 'owner' AND subscription_plan_id = 'personal' LIMIT 1), 
  ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2670&auto=format&fit=crop'],
  true),

-- Properties for professional owner plan
('Prédio Comercial', 'Prédio comercial completo para locação', 'commercial', 'rent', 15000, 'Rua do Comércio, 789', 'Centro', 'São Paulo', 'SP', '01010-000', 0, 4, 10, 400, 
  (SELECT id FROM profiles WHERE type = 'owner' AND subscription_plan_id = 'professional' LIMIT 1), 
  ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1577115293949-9c4df36ddc12?q=80&w=2538&auto=format&fit=crop'],
  true),

('Terreno para Construção', 'Amplo terreno em área nobre', 'land', 'sale', 500000, 'Estrada da Serra, 200', 'Jardim Botânico', 'Rio de Janeiro', 'RJ', '22460-000', 0, 0, 0, 1000, 
  (SELECT id FROM profiles WHERE type = 'owner' AND subscription_plan_id = 'professional' LIMIT 1), 
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2532&auto=format&fit=crop', 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?q=80&w=2670&auto=format&fit=crop'],
  true),

('Mansão de Luxo', 'Residência de alto padrão com vista panorâmica', 'house', 'sale', 2500000, 'Av. Beira Mar, 500', 'Leblon', 'Rio de Janeiro', 'RJ', '22430-000', 5, 6, 4, 500, 
  (SELECT id FROM profiles WHERE type = 'owner' AND subscription_plan_id = 'professional' LIMIT 1), 
  ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2675&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop'],
  true);

-- Insert property demands for different buyers
INSERT INTO public.property_demands (
  transaction_type,
  property_types,
  min_price,
  max_price,
  cities,
  states,
  neighborhoods,
  min_bedrooms,
  min_bathrooms,
  min_parking_spaces,
  min_area,
  is_furnished,
  pets_allowed,
  user_id,
  is_active
)
VALUES
-- Free plan buyer demand
('rent', ARRAY['apartment']::text[], 1000, 2000, 
 ARRAY['São Paulo']::text[], ARRAY['SP']::text[], ARRAY['Centro', 'Bela Vista']::text[],
 1, 1, 0, 40, false, true,
 (SELECT id FROM profiles WHERE type = 'buyer' AND subscription_plan_id = 'free' LIMIT 1),
 true),

-- Personal plan buyer demands
('sale', ARRAY['house', 'apartment']::text[], 300000, 700000, 
 ARRAY['São Paulo', 'Campinas']::text[], ARRAY['SP']::text[], ARRAY['Jardim Europa', 'Cambuí']::text[],
 2, 1, 1, 70, false, false,
 (SELECT id FROM profiles WHERE type = 'buyer' AND subscription_plan_id = 'personal' LIMIT 1),
 true),

('rent', ARRAY['commercial']::text[], 5000, 10000, 
 ARRAY['São Paulo']::text[], ARRAY['SP']::text[], ARRAY['Centro', 'Itaim Bibi']::text[],
 0, 1, 2, 100, false, false,
 (SELECT id FROM profiles WHERE type = 'buyer' AND subscription_plan_id = 'personal' LIMIT 1),
 true),

-- Professional plan buyer demands
('sale', ARRAY['house', 'land']::text[], 500000, 3000000, 
 ARRAY['Rio de Janeiro']::text[], ARRAY['RJ']::text[], ARRAY['Leblon', 'Ipanema', 'Barra da Tijuca']::text[],
 3, 3, 2, 200, true, true,
 (SELECT id FROM profiles WHERE type = 'buyer' AND subscription_plan_id = 'professional' LIMIT 1),
 true),

('rent', ARRAY['apartment', 'house']::text[], 3000, 8000, 
 ARRAY['São Paulo', 'Rio de Janeiro']::text[], ARRAY['SP', 'RJ']::text[], NULL,
 2, 2, 1, 80, true, true,
 (SELECT id FROM profiles WHERE type = 'buyer' AND subscription_plan_id = 'professional' LIMIT 1),
 true);

-- Insert some match data
INSERT INTO public.property_matches (
  property_id,
  demand_id,
  score,
  viewed,
  contacted
)
VALUES
-- Matches for free plan
((SELECT id FROM properties WHERE title = 'Apartamento Compacto' LIMIT 1),
 (SELECT id FROM property_demands WHERE max_price = 2000 LIMIT 1),
 85, true, false),

-- Matches for personal plan
((SELECT id FROM properties WHERE title = 'Casa em Condomínio' LIMIT 1),
 (SELECT id FROM property_demands WHERE max_price = 700000 LIMIT 1),
 92, true, true),

((SELECT id FROM properties WHERE title = 'Apartamento Duplex' LIMIT 1),
 (SELECT id FROM property_demands WHERE max_price = 8000 LIMIT 1),
 78, false, false),

-- Matches for professional plan
((SELECT id FROM properties WHERE title = 'Mansão de Luxo' LIMIT 1),
 (SELECT id FROM property_demands WHERE max_price = 3000000 LIMIT 1),
 95, true, true),

((SELECT id FROM properties WHERE title = 'Prédio Comercial' LIMIT 1),
 (SELECT id FROM property_demands WHERE max_price = 10000 LIMIT 1),
 88, true, false);
