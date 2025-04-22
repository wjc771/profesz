
import { useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

const onboardingSteps = [
  {
    title: "Bem-vindo ao ProfeXpress!",
    text: "Aqui você encontra vagas, oportunidades e conexão entre professores e instituições.",
  },
  {
    title: "Navegação fácil",
    text: "Use o menu para acessar recursos disponíveis de acordo com o seu plano. Recursos bloqueados aparecem com o cadeado ",
    icon: <Lock className="inline w-5 h-5 text-muted-foreground" aria-hidden="true" />
  },
  {
    title: "Personalização",
    text: "Conte para nós suas necessidades e receba recomendações personalizadas!",
  },
  {
    title: "Segurança garantida",
    text: "Seus dados estão protegidos (conforme LGPD). Usamos IA de forma transparente e segura.",
  },
  {
    title: "Primeiros passos",
    text: "Complete seu perfil e explore as possibilidades da plataforma.",
  }
];

export default function Onboarding() {
  const location = useLocation();
  const navigate = useNavigate();
  const isFirstLogin = location.state?.firstLogin;
  const name = location.state?.name;

  // Pular onboarding se não for o primeiro login
  useEffect(() => {
    if (!isFirstLogin) {
      navigate("/dashboard");
    }
  }, [isFirstLogin, navigate]);

  return (
    <div className="container min-h-screen flex flex-col items-center justify-center max-w-lg mx-auto px-4">
      <div className="w-full bg-card rounded-lg shadow-lg p-8 mt-8 flex flex-col gap-6 transition-all duration-700">
        <h1 className="text-3xl font-bold text-primary mb-2 text-center">
          {name ? `Olá, ${name.split(' ')[0]}!` : 'Olá!'}
        </h1>
        <ul className="flex flex-col gap-4">
          {onboardingSteps.map((step, idx) => (
            <li key={idx} className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
              <span className="font-semibold text-lg">{step.title}</span>
              <span className="flex items-center gap-1 text-base mobile-text">
                {step.text}
                {step.icon && step.icon}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={() => navigate("/dashboard")}
            variant="default"
            aria-label="Ir para o dashboard"
          >
            Ir para a plataforma
          </Button>
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => navigate("/profile")}
            aria-label="Ir para Meu Perfil"
          >
            Completar meu perfil
          </Button>
        </div>
        {/* Placeholder visual para plano - simula bloqueio + upgrade */}
        <div className="mt-4 border rounded p-3 flex flex-col items-center gap-2 bg-muted/50" aria-label="Recursos do plano">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Recurso do plano superior</span>
            <Lock className="w-5 h-5 text-destructive" aria-label="Recurso bloqueado" />
          </div>
          <Button variant="outline" size="sm" className="mt-1" aria-label="Upgrade de plano">
            Fazer upgrade
          </Button>
        </div>
        <div className="text-xs text-muted-foreground text-center mt-6">
          ProfeXpress é compatível com dispositivos móveis (PWA) <br />
          <span className="font-bold">LGPD</span> &mdash; Dados protegidos e transparência sobre IA <br />
          Design acessível e adaptável.
        </div>
      </div>
    </div>
  );
}
