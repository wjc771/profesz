
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Check, ChevronDown, Users, Home, Buildings, Search, ArrowRight, Mail, Phone, Lock, PlayCircle } from 'lucide-react';
import PlanSelection from '@/components/subscription/PlanSelection';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import FeatureCard from '@/components/landing/FeatureCard';
import TestimonialCard from '@/components/landing/TestimonialCard';
import { plans } from '@/data/plans';

const LandingPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleGetStarted = () => {
    navigate('/register', { state: { email } });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: Home,
      title: 'Encontre imóveis rapidamente',
      description: 'Algoritmo inteligente que conecta compradores e vendedores com base em suas necessidades reais.'
    },
    {
      icon: Search,
      title: 'Filtros avançados',
      description: 'Encontre exatamente o que procura com nossos filtros detalhados e personalizados.'
    },
    {
      icon: Users,
      title: 'Contato direto',
      description: 'Conecte-se diretamente com proprietários ou corretores sem intermediários.'
    },
    {
      icon: Buildings,
      title: 'Para imobiliárias',
      description: 'Ferramentas especiais para profissionais do mercado imobiliário.'
    }
  ];

  const testimonials = [
    {
      name: 'Carlos Silva',
      role: 'Comprador',
      content: 'Encontrei meu apartamento em apenas 2 semanas usando o MatchImobiliário. O processo foi muito mais rápido do que eu esperava!',
      image: 'https://randomuser.me/api/portraits/men/41.jpg'
    },
    {
      name: 'Ana Luiza',
      role: 'Corretora',
      content: 'Como corretora, o MatchImobiliário me ajudou a fechar mais negócios em menos tempo. A plataforma é intuitiva e eficiente.',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      name: 'Rafael Mendes',
      role: 'Proprietário',
      content: 'Consegui alugar meu imóvel em tempo recorde e para inquilinos que realmente se encaixavam no perfil que eu buscava.',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">MatchImobiliário</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a onClick={() => scrollToSection('features')} className="text-sm font-medium cursor-pointer hover:text-primary">Recursos</a>
            <a onClick={() => scrollToSection('how-it-works')} className="text-sm font-medium cursor-pointer hover:text-primary">Como funciona</a>
            <a onClick={() => scrollToSection('pricing')} className="text-sm font-medium cursor-pointer hover:text-primary">Planos</a>
            <a onClick={() => scrollToSection('testimonials')} className="text-sm font-medium cursor-pointer hover:text-primary">Depoimentos</a>
          </nav>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Link to="/register">
              <Button>Registrar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 max-w-3xl mx-auto">
              <Badge className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                A revolução no mercado imobiliário
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">
                Conectando pessoas aos imóveis <span className="text-primary">perfeitos</span> para elas
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-[700px]">
                Nossa plataforma usa algoritmos inteligentes para encontrar o match perfeito entre compradores, 
                vendedores e imóveis, economizando seu tempo e dinheiro.
              </p>
              
              <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 mx-auto">
                <Input 
                  placeholder="Seu e-mail" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11" 
                />
                <Button onClick={handleGetStarted} className="h-11">
                  Começar grátis <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Comece gratuitamente, sem necessidade de cartão de crédito.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Recursos exclusivos</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Nossa plataforma oferece tudo o que você precisa para encontrar ou anunciar um imóvel com facilidade e eficiência.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Como funciona</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Entenda como nossa plataforma conecta compradores, vendedores e imóveis de forma inteligente.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">1</div>
                <h3 className="text-xl font-semibold">Cadastre-se</h3>
                <p className="text-muted-foreground">Crie uma conta gratuitamente e defina suas preferências de busca ou cadastre seus imóveis.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">2</div>
                <h3 className="text-xl font-semibold">Encontre matches</h3>
                <p className="text-muted-foreground">Nosso algoritmo encontra as melhores correspondências baseadas em suas necessidades.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">3</div>
                <h3 className="text-xl font-semibold">Conecte-se</h3>
                <p className="text-muted-foreground">Entre em contato diretamente com proprietários, compradores ou corretores interessados.</p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <Button 
                onClick={() => scrollToSection('pricing')}
                className="gap-2"
              >
                Ver planos <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Planos para todos os perfis</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Escolha o plano que melhor atende às suas necessidades, desde usuários casuais até profissionais do mercado.
              </p>
            </div>
            
            <PlanSelection 
              plans={plans} 
              currentPlanId={undefined} 
              onSelectPlan={(planId) => {
                if (planId === 'free') {
                  navigate('/register');
                } else {
                  navigate('/register', { state: { planId } });
                }
              }} 
            />
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">O que nossos usuários dizem</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Milhares de pessoas já encontraram o imóvel ideal através da nossa plataforma.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={index}
                  name={testimonial.name}
                  role={testimonial.role}
                  content={testimonial.content}
                  image={testimonial.image}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter">Pronto para encontrar seu match imobiliário?</h2>
              <p className="text-primary-foreground/80 max-w-[700px]">
                Junte-se a milhares de usuários que estão economizando tempo e dinheiro na busca pelo imóvel ideal.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/register">
                  <Button variant="secondary" size="lg">
                    Começar gratuitamente
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10"
                  onClick={() => scrollToSection('features')}
                >
                  Saiba mais
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-primary" />
                <span className="text-lg font-bold">MatchImobiliário</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Conectando pessoas e imóveis de forma inteligente e eficiente.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Navegação</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a onClick={() => scrollToSection('features')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Recursos</a>
                </li>
                <li>
                  <a onClick={() => scrollToSection('how-it-works')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Como funciona</a>
                </li>
                <li>
                  <a onClick={() => scrollToSection('pricing')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Planos</a>
                </li>
                <li>
                  <a onClick={() => scrollToSection('testimonials')} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">Depoimentos</a>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Termos de Serviço</Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Política de Privacidade</Link>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Contato</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">contato@matchimobiliario.com.br</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">(11) 99999-9999</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} MatchImobiliário. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton phoneNumber="5511999999999" />
    </div>
  );
};

export default LandingPage;
