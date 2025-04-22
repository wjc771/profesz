
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/format';

// Define a simple interface for educational materials
interface EducationalMaterial {
  id: string;
  title: string;
  description: string;
  type: string;
  subject: string;
  gradeLevel: string;
  author: string;
  price: number;
  isPremium: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<EducationalMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchMaterialDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Mock data instead of Supabase query
        const mockMaterial: EducationalMaterial = {
          id: id,
          title: "Plano de Aula: Matemática Fundamental",
          description: "Um plano de aula completo para ensino de conceitos básicos de matemática para o ensino fundamental. Inclui atividades interativas, exemplos práticos e avaliação.",
          type: "plano_aula",
          subject: "Matemática", 
          gradeLevel: "Fundamental",
          author: "Prof. Carlos Silva",
          price: 39.90,
          isPremium: true,
          images: [
            "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000",
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000",
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setMaterial(mockMaterial);
      } catch (error: any) {
        console.error('Error fetching material:', error);
        toast({
          title: 'Erro ao carregar material',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMaterialDetails();
  }, [id, toast]);

  const handleImageClick = (index: number) => {
    setActiveImage(index);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-8 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  if (!material) {
    return (
      <MainLayout>
        <div className="container max-w-6xl py-8">
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Material não encontrado</h3>
            <p className="text-muted-foreground mb-4">
              O material que você está procurando não foi encontrado ou não está disponível.
            </p>
            <Link to="/materials">
              <Button>Voltar para listagem</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{material.title}</h1>
              <p className="text-lg text-muted-foreground">
                {material.subject} - {material.gradeLevel}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatCurrency(material.price)}
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{material.type === 'plano_aula' ? 'Plano de Aula' : material.type}</Badge>
                <Badge variant="secondary">{material.subject}</Badge>
                {material.isPremium && <Badge className="bg-amber-500">Premium</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* Galeria de imagens */}
        <div className="mb-8">
          {material.images && material.images.length > 0 ? (
            <div>
              <div className="w-full h-96 overflow-hidden rounded-lg mb-2">
                <img 
                  src={material.images[activeImage]} 
                  alt={`${material.title} - Imagem ${activeImage + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {material.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`w-24 h-24 flex-shrink-0 cursor-pointer rounded-md overflow-hidden ${index === activeImage ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleImageClick(index)}
                  >
                    <img 
                      src={image} 
                      alt={`${material.title} - Miniatura ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Nenhuma imagem disponível</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Detalhes principais */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Descrição</h2>
              <Separator className="mb-4" />
              <p className="whitespace-pre-line">{material.description}</p>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">Informações</h2>
              <Separator className="mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">A</span>
                  </div>
                  <span>Autor: {material.author}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">N</span>
                  </div>
                  <span>Nível: {material.gradeLevel}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <span className="text-primary font-semibold">M</span>
                  </div>
                  <span>Matéria: {material.subject}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-muted p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold mb-4">Valores</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valor</span>
                  <span className="font-semibold">
                    {formatCurrency(material.price)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Ações</h3>
              <div className="space-y-3">
                <Button variant="default" className="w-full">
                  Adquirir material
                </Button>
                <Button variant="outline" className="w-full">
                  Contatar autor
                </Button>
                <Link to="/materials">
                  <Button variant="ghost" className="w-full">
                    Voltar para listagem
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PropertyDetails;
