
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import PlanSelection from '@/components/subscription/PlanSelection';
import { useToast } from '@/components/ui/use-toast';

const plans = [
  {
    id: "free",
    name: "Gratuito",
    price: "Grátis",
    description: "Comece a explorar o básico",
    features: [
      { name: "1 oferta e 1 demanda ativas", included: true },
      { name: "Notificação de matches (sem detalhes)", included: true },
      { name: "Filtros básicos", included: true },
      { name: "Contato direto com matches", included: false },
      { name: "Filtros avançados", included: false },
      { name: "Analytics de desempenho", included: false },
    ],
  },
  {
    id: "personal",
    name: "Pessoal",
    price: "R$49,90",
    description: "Para uso individual",
    recommended: true,
    features: [
      { name: "10 ofertas e 10 demandas ativas", included: true },
      { name: "Detalhes completos de matches", included: true },
      { name: "Filtros avançados", included: true },
      { name: "Contato direto limitado", included: true },
      { name: "Analytics básicos", included: true },
      { name: "Destaque de anúncios", included: false },
    ],
  },
  {
    id: "professional",
    name: "Profissional",
    price: "R$99,90",
    description: "Para corretores e imobiliárias",
    features: [
      { name: "Ofertas e demandas ilimitadas", included: true },
      { name: "Detalhes e contato ilimitados", included: true },
      { name: "Todos os filtros disponíveis", included: true },
      { name: "Destaque de anúncios", included: true },
      { name: "Analytics avançados", included: true },
      { name: "Webhooks personalizados", included: true },
    ],
  },
];

const Subscription = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentPlanId, setCurrentPlanId] = useState<string | undefined>("free");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    if (planId === currentPlanId) return;
    
    setIsProcessing(true);
    
    try {
      // This would be replaced with actual Supabase/Stripe integration
      console.log('Selecting plan:', planId);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCurrentPlanId(planId);
      
      toast({
        title: 'Plano atualizado',
        description: `Seu plano foi atualizado para ${plans.find(p => p.id === planId)?.name}.`,
      });

      // Simulate redirect to dashboard after upgrade
      setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      console.error('Error upgrading plan:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na atualização',
        description: 'Não foi possível atualizar seu plano. Tente novamente mais tarde.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Escolha seu plano</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todos os planos incluem acesso à plataforma MatchImobiliário. Escolha o plano que melhor atende às suas necessidades.
          </p>
        </div>

        <PlanSelection 
          plans={plans} 
          currentPlanId={currentPlanId} 
          onSelectPlan={handleSelectPlan} 
        />

        <div className="mt-10 text-center text-sm text-muted-foreground">
          <p>Você pode alterar ou cancelar seu plano a qualquer momento.</p>
          <p className="mt-1">Precisa de ajuda para escolher? <a href="#" className="text-primary hover:underline">Fale conosco</a></p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Subscription;
