
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, FilePen, PieChart, FileText, Book, User, Star, MessageSquare, Building, Database, CheckCircle, Clock, Target, Users, Zap, Shield, Play } from 'lucide-react';
import PlanSelection from '@/components/subscription/PlanSelection';
import WhatsAppButton from '@/components/landing/WhatsAppButton';
import FeatureCard from '@/components/landing/FeatureCard';
import TestimonialCard from '@/components/landing/TestimonialCard';

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

  const funcionalidades = [
    {
      icon: ClipboardList,
      title: 'Planos de Aula Completos',
      description: 'Infantil ao médio: objetivos, metodologia, recursos e avaliação. Tudo alinhado à BNCC em minutos.'
    },
    {
      icon: PieChart,
      title: 'Provas e Avaliações',
      description: 'Quiz, provas dissertativas, múltipla escolha. Escolha dificuldade, quantidade de questões e formato.'
    },
    {
      icon: FileText,
      title: 'Listas de Exercícios',
      description: 'Exercícios organizados por conteúdo, série e nível. Cria listas de fixação, revisão ou aprofundamento.'
    },
    {
      icon: Target,
      title: 'Simulados Personalizados',
      description: 'Prepara seus alunos para ENEM, vestibular ou provas internas com simulados customizados.'
    },
    {
      icon: Star,
      title: 'Atividades Criativas',
      description: 'Educação infantil: jogos, brincadeiras e atividades lúdicas. Fundamental e médio: projetos e dinâmicas.'
    },
    {
      icon: CheckCircle,
      title: 'Verificação com Gabarito',
      description: 'Upload de respostas digitais, verificação automática e relatório de desempenho instantâneo.'
    },
    {
      icon: FilePen,
      title: 'Avaliação de Redações',
      description: 'IA analisa redações e oferece feedback estruturado sobre coerência, coesão e argumentação.'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Professora de Matemática, RJ',
      content: 'Gero uma prova completa de Matemática com 20 questões em 5 minutos! Nunca pensei que seria possível.',
      image: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    {
      name: 'Ana Costa',
      role: 'Professora de Português, SP',
      content: 'Os simulados ENEM que crio ajudaram 80% dos meus alunos melhorarem a nota. O Profzi mudou minha prática!',
      image: 'https://randomuser.me/api/portraits/women/33.jpg'
    },
    {
      name: 'Pedro Ventura',
      role: 'Diretor Escolar, MG',
      content: 'Nossa equipe pedagógica economiza 15 horas por semana. Mais tempo para inovar e acompanhar os alunos.',
      image: 'https://randomuser.me/api/portraits/men/56.jpg'
    }
  ];

  const nivelEducacional = [
    {
      titulo: 'Educação Infantil (3-5 anos)',
      itens: [
        '🎨 Atividades lúdicas e criativas',
        '🎲 Jogos educativos',
        '🎭 Brincadeiras pedagógicas',
        '📖 Contação de histórias estruturada'
      ]
    },
    {
      titulo: 'Fundamental I (6-10 anos)',
      itens: [
        '📝 Planos interdisciplinares',
        '🔢 Listas de exercícios ilustradas',
        '🎯 Quiz interativos',
        '📊 Avaliações diagnósticas'
      ]
    },
    {
      titulo: 'Fundamental II (11-14 anos)',
      itens: [
        '📚 Planos por disciplina',
        '📋 Provas estruturadas',
        '🎮 Simulados temáticos',
        '💡 Projetos colaborativos'
      ]
    },
    {
      titulo: 'Ensino Médio (15-17 anos)',
      itens: [
        '🎓 Preparação ENEM/vestibular',
        '📊 Simulados completos',
        '📖 Análise de redações',
        '🔬 Atividades práticas'
      ]
    }
  ];

  const faqs = [
    {
      question: "Que tipos de atividade posso gerar?",
      answer: "Planos de aula, provas, quiz, listas de exercícios, simulados, atividades avaliativas e conteúdo criativo para todas as idades."
    },
    {
      question: "Funciona para educação infantil?",
      answer: "Sim! Temos atividades lúdicas, jogos educativos e brincadeiras específicas para primeira infância."
    },
    {
      question: "Como funciona a verificação de provas?",
      answer: "Upload das respostas digitais + gabarito pré-configurado = relatório automático de desempenho."
    },
    {
      question: "Avalia redações?",
      answer: "Sim! Nossa IA analisa redações e oferece feedback estruturado sobre argumentação, coerência e coesão."
    },
    {
      question: "Trabalho em várias escolas com níveis diferentes?",
      answer: "Perfeito! Gere conteúdo específico para cada contexto: infantil, fundamental e médio na mesma conta."
    },
    {
      question: "Funciona offline?",
      answer: "Não. PROFZI precisa de internet para gerar conteúdo atualizado e verificar atividades."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/4ef9779b-e5f9-48f1-b21b-1557995e0fff.png" alt="Logo Profzi" className="h-8 w-8" />
            <span className="text-xl font-bold text-indigo-700">Profzi</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a onClick={() => scrollToSection('funcionalidades')} className="text-sm font-medium cursor-pointer hover:text-primary">Funcionalidades</a>
            <a onClick={() => scrollToSection('pricing')} className="text-sm font-medium cursor-pointer hover:text-primary">Planos</a>
            <a onClick={() => scrollToSection('tipos-conteudo')} className="text-sm font-medium cursor-pointer hover:text-primary">Tipos de Conteúdo</a>
            <a onClick={() => scrollToSection('depoimentos')} className="text-sm font-medium cursor-pointer hover:text-primary">Depoimentos</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
            <Button onClick={handleGetStarted} className="bg-indigo-700 text-white font-bold">
              Começar a Gerar Conteúdo
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section Reformulado */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <Badge className="px-4 py-2 text-sm bg-indigo-100 text-indigo-800 font-semibold shadow-sm">
              🏆 Primeiras 100 professoras: preço promocional até janeiro
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-tight">
              Gere planos de aula, provas e atividades <br className="hidden sm:block" />
              <span className="text-indigo-700">em minutos, não horas</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl">
              Da educação infantil ao ensino médio: quiz, listas de exercícios, simulados e atividades avaliativas personalizadas. Tudo alinhado à BNCC.
            </p>
            <p className="text-lg font-medium text-indigo-800">
              Planos completos, provas estruturadas e atividades criativas em poucos cliques
            </p>
            <div className="flex flex-col sm:flex-row w-full max-w-md gap-3 mx-auto mt-8">
              <Input
                placeholder="Seu e-mail profissional"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-lg"
              />
              <Button onClick={handleGetStarted} size="lg" className="h-12 bg-indigo-700 text-white font-bold text-lg px-8">
                Começar a Gerar Conteúdo Agora
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button variant="secondary" onClick={() => scrollToSection('funcionalidades')} className="font-medium">
                Ver Funcionalidades Completas
              </Button>
              <Button variant="outline" onClick={() => scrollToSection('video')} className="font-medium">
                Ver Como Funciona
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-700">1.200+</div>
                <div className="text-sm text-muted-foreground">Educadoras</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-700">10.000+</div>
                <div className="text-sm text-muted-foreground">Planos/mês</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-700">50.000+</div>
                <div className="text-sm text-muted-foreground">Estudantes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-indigo-700">12</div>
                <div className="text-sm text-muted-foreground">Estados</div>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Vídeo */}
        <section id="video" className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-indigo-800">
                Veja como é simples gerar conteúdo profissional
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Em poucos minutos você terá planos de aula completos, provas estruturadas e atividades criativas
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center relative overflow-hidden shadow-2xl">
                <img 
                  src="/lovable-uploads/d1692790-1887-44f3-9157-6cd1ade4b2a6.png" 
                  alt="Professora usando PROFZI" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button size="lg" className="bg-white/90 text-indigo-700 hover:bg-white font-bold text-lg px-8 py-4 rounded-full">
                    <Play className="h-6 w-6 mr-2" />
                    Assistir Demonstração
                  </Button>
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6 mt-8 text-center">
                <div>
                  <Clock className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">3 minutos</div>
                  <div className="text-sm text-muted-foreground">Plano de aula completo</div>
                </div>
                <div>
                  <Zap className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">5 minutos</div>
                  <div className="text-sm text-muted-foreground">Lista de 20 exercícios</div>
                </div>
                <div>
                  <Target className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">10 minutos</div>
                  <div className="text-sm text-muted-foreground">Quiz interativo completo</div>
                </div>
                <div>
                  <Star className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
                  <div className="text-lg font-bold">15 minutos</div>
                  <div className="text-sm text-muted-foreground">Simulado ENEM completo</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proposta de Valor */}
        <section className="py-16 md:py-20 bg-indigo-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-indigo-800">
                Tudo que você precisa em uma plataforma
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Feito por quem entende sua rotina. Transforme sua experiência pedagógica em conteúdo profissional rapidamente.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-t-blue-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="h-6 w-6 text-blue-600" />
                    Para Rede Pública
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Planos de aula baseados na BNCC, sempre atualizados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Atividades da educação infantil ao ensino médio</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Quiz e simulados para preparação de avaliações</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-t-green-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-6 w-6 text-green-600" />
                    Para Rede Privada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Integra com o material da sua escola automaticamente</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Provas e listas personalizadas por nível</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Atividades avaliativas que impressionam coordenação</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow border-t-4 border-t-purple-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-purple-600" />
                    Para Todas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Verificação automática com gabarito digital</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Avaliação inteligente de redações</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Mais tempo para sua família e projetos pessoais</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Funcionalidades Detalhadas */}
        <section id="funcionalidades" className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-indigo-800">
                O que você pode gerar hoje:
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Todas as ferramentas que você precisa para transformar sua prática pedagógica
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {funcionalidades.map((funcionalidade, index) => (
                <FeatureCard
                  key={index}
                  icon={funcionalidade.icon}
                  title={funcionalidade.title}
                  description={funcionalidade.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Diferenciação */}
        <section className="py-16 md:py-20 bg-indigo-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-indigo-800">
                O que torna PROFZI único:
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Zap className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Geração Completa de Conteúdo</h3>
                      <p className="text-muted-foreground">Da educação infantil ao ensino médio - todos os tipos de atividade em uma plataforma</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">BNCC Nativa</h3>
                      <p className="text-muted-foreground">Único sistema que gera conteúdo já alinhado com a Base Nacional</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Verificação Inteligente</h3>
                      <p className="text-muted-foreground">Gabarito digital + avaliação de redações em português</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">4 Perfis Integrados</h3>
                      <p className="text-muted-foreground">Conecta professora, estudantes, famílias e escola em um só lugar</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <img
                  src="/lovable-uploads/2f4ede20-376a-4df2-9888-472dce876203.png"
                  alt="Professora usando PROFZI"
                  className="rounded-xl shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border">
                  <div className="text-2xl font-bold text-indigo-700">20+</div>
                  <div className="text-sm text-muted-foreground">atividades por semana</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tipos de Conteúdo por Nível */}
        <section id="tipos-conteudo" className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-indigo-800">
                Conteúdo para cada nível educacional
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Da primeira infância ao vestibular, temos o conteúdo certo para cada fase
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {nivelEducacional.map((nivel, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg text-center text-indigo-800">
                      {nivel.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {nivel.itens.map((item, idx) => (
                        <li key={idx} className="text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Prova Social */}
        <section className="py-16 md:py-20 bg-indigo-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-indigo-800">
                Resultados que falam por si:
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Milhares de educadoras já descobriram o poder do PROFZI
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="text-3xl font-bold text-indigo-700 mb-2">1.200+</div>
                <div className="text-sm text-muted-foreground">educadoras geram 50+ atividades por semana</div>
              </Card>
              <Card className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="text-3xl font-bold text-green-700 mb-2">10.000+</div>
                <div className="text-sm text-muted-foreground">planos de aula gerados mensalmente</div>
              </Card>
              <Card className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20">
                <div className="text-3xl font-bold text-purple-700 mb-2">12</div>
                <div className="text-sm text-muted-foreground">estados brasileiros atendidos</div>
              </Card>
              <Card className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                <div className="text-3xl font-bold text-orange-700 mb-2">50.000+</div>
                <div className="text-sm text-muted-foreground">estudantes beneficiados</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Depoimentos */}
        <section id="depoimentos" className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-indigo-800">
                O que as educadoras dizem
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Resultados reais de quem já transformou sua prática pedagógica
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

        {/* Planos e Preços Reformulados */}
        <section id="pricing" className="py-16 md:py-20 bg-indigo-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-indigo-800">
                Investimento que transforma sua prática:
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Escolha o plano ideal para você
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="shadow-lg hover:shadow-xl transition-shadow relative">
                <CardHeader>
                  <CardTitle className="text-xl">👨‍🎓 PROFZI Estudante</CardTitle>
                  <div className="text-3xl font-bold text-indigo-700">R$ 0,00<span className="text-lg text-muted-foreground">/mês</span></div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Auxílio em tarefas, preparação para provas e materiais de estudo. Funcionalidades básicas.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Auxílio em tarefas escolares</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Preparação para avaliações</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Materiais de estudo</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Suporte básico</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/register', { state: { planId: 'estudante' }})}>
                    Começar Agora
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow relative border-indigo-200">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-indigo-700 text-white px-4 py-1">Mais Popular</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">👩‍🏫 PROFZI Professora</CardTitle>
                  <div className="text-3xl font-bold text-indigo-700">R$ 0,00<span className="text-lg text-muted-foreground">/mês</span></div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Gere planos, provas, quiz, listas e atividades ilimitadas. Funcionalidades essenciais.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Planos de aula automatizados</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Provas e avaliações personalizadas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Verificação com gabarito</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Suporte dedicado</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-indigo-700" onClick={() => navigate('/register', { state: { planId: 'professor' }})}>
                    Começar Agora
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="shadow-lg hover:shadow-xl transition-shadow relative">
                <CardHeader>
                  <CardTitle className="text-xl">👨‍👩‍👧‍👦 PROFZI Família</CardTitle>
                  <div className="text-3xl font-bold text-indigo-700">R$ 0,00<span className="text-lg text-muted-foreground">/mês</span></div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Para pais acompanharem até 3 filhos. Funcionalidades básicas incluídas.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Auxílio para ajudar nos deveres</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Reforço escolar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Até 3 perfis de filhos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm">Orientações pedagógicas</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => navigate('/register', { state: { planId: 'familia' }})}>
                    Começar Agora
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div className="text-center bg-green-50 dark:bg-green-900/20 rounded-xl p-8">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                Garantia de 7 dias
              </h3>
              <p className="text-green-700 dark:text-green-300 max-w-2xl mx-auto">
                7 dias para testar. Se não conseguir gerar pelo menos 20 atividades de qualidade por semana, devolvemos seu dinheiro.
              </p>
            </div>
            
            {/* Seção Institucional */}
            <div className="mt-16">
              <Card className="max-w-4xl mx-auto bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-indigo-200 dark:border-indigo-800">
                <CardContent className="p-8 text-center">
                  <Building className="w-16 h-16 text-indigo-600 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-indigo-800 mb-4">
                    🏫 PROFZI Escola - Valor personalizado
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Para instituições. Solicite proposta comercial para funcionalidades avançadas.
                  </p>
                  <Button 
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                    onClick={() => navigate('/register', { state: { planId: 'institucional' }})}
                  >
                    Solicitar Proposta Institucional
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Atualizado */}
        <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-indigo-800 mb-4">
                Dúvidas frequentes:
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Esclarecemos as principais dúvidas sobre o PROFZI
              </p>
            </div>
            <div className="mx-auto max-w-3xl space-y-6">
              {faqs.map((faq, idx) => (
                <Card key={idx} className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg text-indigo-800">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground">{faq.answer}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16 md:py-20 bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Pare de perder tempo criando do zero
              </h2>
              <p className="text-xl text-indigo-100 max-w-3xl mx-auto">
                Milhares de professoras já descobriram: PROFZI gera em minutos o que levaria horas para criar. 
                Planos de aula profissionais, provas equilibradas, listas criativas e simulados eficazes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
                <Button 
                  size="lg" 
                  className="bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-lg px-8"
                  onClick={handleGetStarted}
                >
                  Começar a Gerar Meu Conteúdo
                </Button>
              </div>
              <p className="text-sm text-indigo-200 mt-4">
                ✅ 7 dias para testar todas as funcionalidades. Se não ficar satisfeita, devolvemos 100% do valor.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="border-t py-10 md:py-12 bg-indigo-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/lovable-uploads/4ef9779b-e5f9-48f1-b21b-1557995e0fff.png" alt="Logo Profzi" className="h-8 w-8" />
                <span className="text-xl font-bold text-indigo-700">Profzi</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs mb-4">
                A plataforma que transforma experiência pedagógica em conteúdo profissional rapidamente.
              </p>
              <div className="flex gap-3">
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
              <h3 className="font-semibold mb-3 text-indigo-700">Recursos</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <a onClick={() => scrollToSection('funcionalidades')} className="hover:text-indigo-700 cursor-pointer">Funcionalidades</a>
                </li>
                <li>
                  <a onClick={() => scrollToSection('tipos-conteudo')} className="hover:text-indigo-700 cursor-pointer">Tipos de Conteúdo</a>
                </li>
                <li>
                  <a onClick={() => scrollToSection('pricing')} className="hover:text-indigo-700 cursor-pointer">Planos</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-indigo-700">Empresa</h3>
              <ul className="text-sm space-y-2">
                <li>
                  <Link to="/terms" className="hover:text-indigo-700">Termos de Serviço</Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-indigo-700">Política de Privacidade</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Profzi. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton phoneNumber="5511999999" message="Olá! Tenho interesse no PROFZI para gerar conteúdo educacional." />
    </div>
  );
};

export default LandingPage;
