
-- Add new columns to profiles table if they don't exist yet
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS creci TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS agency_name TEXT;

-- Insert a few more sample properties
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
-- More properties for the second owner
('Loft Industrial', 'Loft estilo industrial com pé direito duplo', 'apartment', 'rent', 3200, 'Rua Oscar Freire, 800', 'Jardins', 'São Paulo', 'SP', '01426-001', 1, 1, 1, 70, 
  (SELECT id FROM profiles WHERE type = 'owner' ORDER BY created_at DESC LIMIT 1), 
  ARRAY['https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=2670&auto=format&fit=crop'],
  false),

('Casa de Praia', 'Linda casa de praia a poucos metros do mar', 'house', 'sale', 950000, 'Avenida Beira Mar, 500', 'Praia Grande', 'Ilhabela', 'SP', '11630-000', 4, 3, 3, 180, 
  (SELECT id FROM profiles WHERE type = 'owner' ORDER BY created_at DESC LIMIT 1), 
  ARRAY['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2670&auto=format&fit=crop'],
  true);
