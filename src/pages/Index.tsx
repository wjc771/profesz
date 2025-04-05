import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import SubscriptionOverview from "@/components/subscription/SubscriptionOverview";

export default function Index() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Olá, {user?.email?.split('@')[0] || 'usuário'}</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao MatchImobiliário. Aqui você pode gerenciar seus imóveis e encontrar o match perfeito.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SubscriptionOverview />
          
          {/* More dashboard components will be added here */}
        </div>
      </div>
    </MainLayout>
  );
}
