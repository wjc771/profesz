import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, FilePen, PieChart, FileText, Book, User, Star, MessageSquare, Building, Database } from 'lucide-react';
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
      icon: ClipboardList,
      title: 'Gerador de Planos de Aula',
      description: 'Gere rapidamente planos de aula personalizados, alinhados à BNCC e adaptados à sua turma.'
    },
    {
      icon: PieChart,
      title: 'Banco de Questões Inteligente',
      description: 'Acesse e crie questões automaticamente para avaliações ou atividades diagnósticas.'
    },
    {
      icon: FilePen,
      title: 'Assistente de Feedback',
      description: 'Receba sugestões automáticas de devolutivas para alunos com base no desempenho.'
    },
    {
      icon: FileText,
      title: 'Adaptador de Materiais',
      description: 'Adapte rapidamente textos, atividades ou slides para diferentes públicos e dificuldades.'
    },
    {
      icon: Book,
      title: 'Ajuda em Tarefas',
      description: 'Estudantes podem resolver dúvidas em exercícios e receber orientação personalizada.'
    },
    {
      icon: User,
      title: 'Suporte para Pais',
      description: 'Auxílio para pais acompanharem e ajudarem nas tarefas escolares de seus filhos.'
    },
  ];

  const testimonials = [
    {
      name: 'Larissa Matos',
      role: 'Professora de Ciências (Ensino Fundamental)',
      content: 'Nunca consegui preparar aulas tão rápido! O Profzi mudou meu planejamento e liberou horas da minha semana.',
      image: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    {
      name: 'Pedro Ventura',
      role: 'Diretor Escolar',
      content: 'Nossos professores relataram menos estresse e mais tempo para inovar. A IA do Profzi faz a diferença!',
      image: 'https://randomuser.me/api/portraits/men/56.jpg'
    },
    {
      name: 'Ana Lúcia Silva',
      role: 'Mãe de aluno do 7º ano',
      content: 'Agora consigo auxiliar meu filho nas tarefas mesmo sem dominar o conteúdo. O Profzi nos ajuda muito!',
      image: 'https://randomuser.me/api/portraits/women/33.jpg'
    }
  ];

  const faqs = [
    {
      question: "Como o Profzi protege meus dados?",
      answer: "A segurança dos dados é prioridade máxima. Utilizamos protocolos avançados e nunca compartilhamos informações pessoais sem consentimento."
    },
    {
      question: "Como funciona o período de teste gratuito?",
      answer: "Você pode testar todos os recursos do plano Essencial durante 7 dias, sem compromisso ou cobrança automática."
    },
    {
      question: "Posso cancelar ou trocar de plano a qualquer momento?",
      answer: "Sim! Basta acessar sua área logada para solicitar cancelamento, upgrade ou downgrade, sem burocracia."
    },
    {
      question: "O Profzi serve para qual nível de ensino?",
      answer: "Atendemos professores, alunos e pais da educação básica ao ensino superior, com recursos flexíveis para cada etapa."
    },
    {
      question: "Há planos específicos para alunos e pais?",
      answer: "Sim! Oferecemos planos especiais para alunos que precisam de auxílio nas tarefas e para pais que querem apoiar seus filhos nas atividades escolares."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/c36b1c8e-bb9e-4e4e-9a44-98fd7b4f15a6.png" alt="Logo Profzi" className="h-8 w-8" />
            <span className="text-xl font-bold text-indigo-700">Profzi</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a onClick={() => scrollToSection('features')} className="text-sm font-medium cursor-pointer hover:text-primary">Recursos</a>
            <a onClick={() => scrollToSection('pricing')} className="text-sm font-medium cursor-pointer hover:text-primary">Planos</a>
            <a onClick={() => scrollToSection('about')} className="text-sm font-medium cursor-pointer hover:text-primary">Sobre Nós</a>
            <a href="/blog" className="text-sm font-medium cursor-pointer hover:text-primary">Blog</a>
            <a onClick={() => scrollToSection('contact')} className="text-sm font-medium cursor-pointer hover:text-primary">Contato</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Button onClick={handleGetStarted} className="bg-indigo-700 text-white font-bold">
              Experimente Grátis
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-4 md:space-y-6 max-w-3xl mx-auto">
            <Badge className="px-3 py-1 text-sm bg-indigo-100 text-indigo-800 font-semibold shadow-sm">
              Para Professores, Estudantes e Pais
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter leading-snug">
              Revolucione sua experiência educacional <br className="hidden sm:block" />
              <span className="text-indigo-700">com inteligência artificial</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[700px]">
              Economize tempo, personalize materiais e potencialize o aprendizado com assistentes de IA especializados em educação.
            </p>
            <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 mx-auto">
              <Input
                placeholder="Seu e-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
              <Button onClick={handleGetStarted} className="h-11 bg-indigo-700 text-white font-bold">
                Comece Grátis Agora
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="secondary" onClick={() => scrollToSection('pricing')} className="font-medium">
                Conheça os Planos
              </Button>
            </div>
            <div className="mt-8">
              <img
                src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80"
                alt="Interface do Profzi"
                className="mx-auto rounded-xl shadow-lg max-h-72 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Problema-Solução */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900" id="problem-solution">
          <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-4">
                Falta de tempo? Dificuldades? Profzi resolve isso.
              </h2>
              <ul className="text-md space-y-2 text-muted-foreground">
                <li>• Ajuda para professores, alunos e pais.</li>
                <li>• Organização de planos de aula em segundos.</li>
                <li>• Geração automática de questões e feedbacks.</li>
                <li>• Suporte em tarefas escolares para estudantes.</li>
                <li>• Orientação para pais ajudarem seus filhos.</li>
                <li>• Reduza em até <span className="text-indigo-700 font-bold">70% do tempo</span> gasto com tarefas burocráticas.</li>
              </ul>
              <div className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <span className="text-3xl font-bold text-indigo-700">+80%</span>
                    <span className="ml-2 text-lg">dos usuários relatam mais eficiência em suas atividades educacionais</span>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=700&q=80"
                alt="Workflow Educacional"
                className="rounded-xl shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Principais Recursos */}
        <section id="features" className="py-16 md:py-20 bg-indigo-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-indigo-800">Principais Recursos do Profzi</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Soluções completas para professores, estudantes e pais.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
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

        {/* Públicos-alvo */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-indigo-800">Para quem é o Profzi?</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Nossa plataforma atende diferentes perfis do universo educacional
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-blue-50 dark:bg-blue-900/30">
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-6 w-6 text-primary" />
                    Professores
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Planos de aula automatizados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Banco de questões personalizadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Gerador de avaliações</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Feedback inteligente para alunos</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button className="w-full" onClick={() => navigate('/register', { state: { type: 'professor' }})}>
                    Sou Professor
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-green-50 dark:bg-green-900/30">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-6 w-6 text-green-600" />
                    Estudantes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Auxílio em tarefas escolares</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Resolução de dúvidas em tempo real</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Prática com questões personalizadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Preparação para avaliações</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button className="w-full" onClick={() => navigate('/register', { state: { type: 'aluno' }})}>
                    Sou Estudante
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-purple-50 dark:bg-purple-900/30">
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                    Pais
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Auxílio para ajudar nos deveres</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Reforço escolar para seus filhos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Explicações simplificadas de conteúdos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Sugestões de atividades adequadas</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button className="w-full" onClick={() => navigate('/register', { state: { type: 'pais' }})}>
                    Sou Pai/Responsável
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-amber-50 dark:bg-amber-900/30">
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-6 w-6 text-amber-600" />
                    Instituições
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Integração com material próprio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Personalização para colaboradores</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Gestão de conteúdo educacional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Star className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <span>Base de conhecimento institucional</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button className="w-full" onClick={() => navigate('/register', { state: { type: 'instituicao' }})}>
                    Sou Instituição
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Instituições de Ensino */}
        <section className="py-16 md:py-20 bg-indigo-50 dark:bg-gray-900" id="instituicoes">
          <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-4">
                Soluções para Instituições de Ensino
              </h2>
              <p className="text-muted-foreground mb-4">
                Transforme seu material escolar existente em uma poderosa base de conhecimento para criação de recursos pedagógicos personalizados.
              </p>
              <ul className="text-md space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Database className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>Ingestão e processamento de material didático proprietário</span>
                </li>
                <li className="flex items-start gap-2">
                  <Database className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>Criação automatizada de planos de aula baseados no seu conteúdo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Database className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>Geração de questões e avaliações alinhadas ao seu currículo</span>
                </li>
                <li className="flex items-start gap-2">
                  <Database className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>Portal personalizado para docentes e equipe pedagógica</span>
                </li>
              </ul>
              <Button className="w-full sm:w-auto" onClick={() => navigate('/contact', { state: { subject: 'Plano Institucional' }})}>
                Solicitar demonstração
              </Button>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                alt="Instituições de Ensino"
                className="rounded-xl shadow-xl w-full max-w-lg"
              />
            </div>
          </div>
        </section>

        {/* Demonstração Visual */}
        <section className="py-16 md:py-20 bg-indigo-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-indigo-800 mb-4">
                Veja o Profzi em ação!
              </h2>
              <p className="text-muted-foreground mb-4">
                Interface simples, navegação intuitiva e resultados visíveis desde os primeiros minutos de uso.
              </p>
              <ul className="text-md space-y-1">
                <li>✔️ Fluxo fácil para criar planos de aula</li>
                <li>✔️ Geração de avaliações em segundos</li>
                <li>✔️ Auxílio em tarefas escolares</li>
                <li>✔️ Suporte para pais e alunos</li>
              </ul>
            </div>
            <div className="flex justify-center">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                alt="Demonstração do Profzi"
                className="rounded-xl shadow-xl w-full max-w-lg"
              />
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section id="testimonials" className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-indigo-800">O que os usuários dizem</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Profzi é aprovado por professores, estudantes e pais em diferentes níveis educacionais.
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

        {/* Planos e Preços */}
        <section id="pricing" className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter text-indigo-800">Planos para todos os perfis</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Escolha o plano ideal para você, seja professor, estudante ou pai.
              </p>
            </div>
            <PlanSelection
              plans={[
                {
                  id: "professor",
                  name: "Profzi Professor",
                  price: "R$ 29,90",
                  description: "Acesso completo ao gerador de planos, banco de questões avançado, assistente de feedback e adaptador de materiais.",
                  features: [
                    { name: "Planos de aula automatizados", included: true },
                    { name: "Banco de questões personalizadas", included: true },
                    { name: "Gerador de avaliações", included: true },
                    { name: "Feedback inteligente para alunos", included: true },
                    { name: "Adaptador de materiais", included: true },
                    { name: "Suporte dedicado", included: true },
                  ],
                  recommended: true,
                  limits: {
                    activeListings: 100,
                    activeSearches: 100,
                    matchesPerMonth: 10,
                    contactsPerMonth: 10
                  }
                },
                {
                  id: "estudante",
                  name: "Profzi Estudante",
                  price: "R$ 19,90",
                  description: "Auxílio em tarefas escolares, resolução de dúvidas, preparação para provas e geração de exercícios personalizados.",
                  features: [
                    { name: "Auxílio em tarefas escolares", included: true },
                    { name: "Resolução de dúvidas em tempo real", included: true },
                    { name: "Prática com questões personalizadas", included: true },
                    { name: "Preparação para avaliações", included: true },
                    { name: "Materiais de estudo adaptados", included: true },
                    { name: "Suporte básico", included: true },
                  ],
                  limits: {
                    activeListings: 100,
                    activeSearches: 100,
                    matchesPerMonth: 10,
                    contactsPerMonth: 10
                  }
                },
                {
                  id: "familia",
                  name: "Profzi Família",
                  price: "R$ 39,90",
                  description: "Ideal para pais ajudarem seus filhos. Inclui auxílio em tarefas, explicações de conteúdos e recomendações de atividades.",
                  features: [
                    { name: "Auxílio para ajudar nos deveres", included: true },
                    { name: "Reforço escolar para seus filhos", included: true },
                    { name: "Explicações simplificadas de conteúdos", included: true },
                    { name: "Sugestões de atividades adequadas", included: true },
                    { name: "Orientações pedagógicas para pais", included: true },
                    { name: "Acesso para até 3 perfis", included: true },
                  ],
                  limits: {
                    activeListings: -1,
                    activeSearches: -1,
                    matchesPerMonth: -1,
                    contactsPerMonth: -1
                  }
                },
                {
                  id: "instituicao",
                  name: "Profzi Institucional",
                  price: "Personalizado",
                  description: "Para escolas e instituições de ensino. Inclui ingestão de material próprio e recursos personalizados para colaboradores.",
                  features: [
                    { name: "Integração com material próprio", included: true },
                    { name: "Personalização para colaboradores", included: true },
                    { name: "Gestão de conteúdo educacional", included: true },
                    { name: "Base de conhecimento institucional", included: true },
                    { name: "Portal personalizado", included: true },
                    { name: "Suporte premium dedicado", included: true },
                  ],
                  limits: {
                    activeListings: -1,
                    activeSearches: -1,
                    matchesPerMonth: -1,
                    contactsPerMonth: -1
                  }
                }
              ]}
              currentPlanId={undefined}
              onSelectPlan={(planId) => {
                if (planId === "instituicao") {
                  navigate("/contact", { state: { subject: "Plano Institucional" } });
                } else {
                  navigate("/register", { state: { planId } });
                }
              }}
              showAllFeatures={true}
              compact={true}
            />
            <div className="text-center mt-6">
              <Link to="/plans">
                <Button variant="link" className="text-indigo-700 font-semibold underline">Veja detalhes e comparação de todos os planos</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter text-indigo-800">Perguntas Frequentes</h2>
              <p className="text-muted-foreground max-w-[700px] mx-auto">
                Tem dúvidas sobre funcionamento, segurança ou suporte? Veja abaixo.
              </p>
            </div>
            <div className="mx-auto max-w-2xl space-y-6">
              {faqs.map((faq, idx) => (
                <Card key={idx} className="shadow rounded-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-indigo-800">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">{faq.answer}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Newsletter/Contato */}
        <section id="contact" className="py-12 md:py-16 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6 text-center space-y-6">
            <h2 className="text-2xl font-bold text-indigo-800">Receba novidades, dicas e materiais exclusivos!</h2>
            <form className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Digite seu e-mail"
                className="h-11"
              />
              <Button className="h-11 bg-indigo-700 text-white font-bold" type="submit">Cadastrar</Button>
            </form>
            <p className="text-muted-foreground text-sm">Prometemos não enviar spam.</p>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="border-t py-10 md:py-12 bg-indigo-50 dark:bg-gray-900" id="about">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img src="/lovable-uploads/c36b1c8e-bb9e-4e4e-9a44-98fd7b4f15a6.png" alt="Logo Profzi" className="h-6 w-6" />
                <span className="text-lg font-bold text-indigo-700">Profzi</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Mais inovação e tempo livre para todos os envolvidos no processo educacional.
              </p>
              <div className="flex gap-3 mt-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-indigo-700">
                  <svg width="22" height="22" fill="currentColor"><path d="M20 11.07C20 6.05 15.96 2 11 2S2 6.05 2 11.07c0 4.29 3.18 7.85 7.3 8.72v-6.16H6.9v-2.56h2.4v-1.95c0-2.36 1.43-3.67 3.6-3.67 1.05 0 2.14.19 2.14.19v2.36h-1.21c-1.2 0-1.58.75-1.58 1.52v1.55h2.7l-.43 2.56h-2.27v6.17C16.82 18.93 20 15.36 20 11.07z"/></svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-indigo-700">
                  <svg width="22" height="22" fill="currentColor"><circle cx="11" cy="11" r="8"/><circle cx="11" cy="11" r="5"/><circle cx="16" cy="6" r="1"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="Linkedin" className="hover:text-indigo-700">
                  <svg width="22" height="22" fill="currentColor"><rect x="2" y="7" width="4" height="13"/><rect x="8" y="7" width="4" height="13"/><rect x="14" y="7" width="4" height="13"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-indigo-700">Políticas</h3>
              <ul className="text-sm space-y-1">
                <li>
                  <Link to="/terms" className="hover:text-indigo-700">Termos de Serviço</Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-indigo-700">Política de Privacidade</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-indigo-700">Contato</h3>
              <ul className="text-sm space-y-1">
                <li>Email: <a href="mailto:contato@profzi.com.br" className="hover:text-indigo-700">contato@profzi.com.br</a></li>
                <li>WhatsApp: <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-700">(11) 99999-9999</a></li>
              </ul>
              <div className="mt-4">
                <form className="flex gap-2">
                  <Input type="email" placeholder="E-mail para novidades" className="h-9" />
                  <Button className="h-9 bg-indigo-700 text-white font-bold" type="submit">Receber</Button>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Profzi. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton phoneNumber="5511999999" />
    </div>
  );
};

export default LandingPage;
