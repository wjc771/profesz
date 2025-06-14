
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, FileText, BarChart3, Settings, Users, 
  CheckCircle, Play, ArrowRight, Lightbulb 
} from 'lucide-react';
import { UserType } from '@/types/profile';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  feature: string;
  action: string;
}

interface InteractiveTutorialProps {
  userType: UserType;
  onComplete: () => void;
  onBack: () => void;
}

export function InteractiveTutorial({ userType, onComplete, onBack }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const tutorialSteps: Record<UserType, TutorialStep[]> = {
    professor: [
      {
        id: 'plano-aula',
        title: 'Criar Plano de Aula',
        description: 'Aprenda a criar planos de aula personalizados com IA',
        icon: <BookOpen className="w-6 h-6" />,
        feature: 'Planejamento Pedagógico',
        action: 'Criar primeiro plano'
      },
      {
        id: 'atividades',
        title: 'Gerar Atividades',
        description: 'Crie exercícios e avaliações adaptadas ao nível dos alunos',
        icon: <FileText className="w-6 h-6" />,
        feature: 'Central de Atividades',
        action: 'Gerar atividade de exemplo'
      },
      {
        id: 'correcao',
        title: 'Correção Automática',
        description: 'Configure a correção automática para economizar tempo',
        icon: <CheckCircle className="w-6 h-6" />,
        feature: 'Correção Inteligente',
        action: 'Configurar correção'
      },
      {
        id: 'relatorios',
        title: 'Acompanhamento',
        description: 'Visualize relatórios de desempenho dos seus alunos',
        icon: <BarChart3 className="w-6 h-6" />,
        feature: 'Relatórios',
        action: 'Ver dashboard'
      }
    ],
    instituicao: [
      {
        id: 'usuarios',
        title: 'Gestão de Usuários',
        description: 'Adicione e gerencie professores e alunos da instituição',
        icon: <Users className="w-6 h-6" />,
        feature: 'Gerenciamento',
        action: 'Adicionar usuários'
      },
      {
        id: 'relatorios-inst',
        title: 'Relatórios Institucionais',
        description: 'Acesse estatísticas e relatórios da instituição',
        icon: <BarChart3 className="w-6 h-6" />,
        feature: 'Dashboard Administrativo',
        action: 'Ver relatórios'
      },
      {
        id: 'materiais',
        title: 'Padronização',
        description: 'Configure templates e padrões para materiais',
        icon: <BookOpen className="w-6 h-6" />,
        feature: 'Templates Institucionais',
        action: 'Configurar padrões'
      },
      {
        id: 'configuracoes',
        title: 'Configurações',
        description: 'Personalize configurações organizacionais',
        icon: <Settings className="w-6 h-6" />,
        feature: 'Configurações',
        action: 'Personalizar sistema'
      }
    ],
    aluno: [
      {
        id: 'atividades-aluno',
        title: 'Realizar Atividades',
        description: 'Acesse e complete atividades disponibilizadas',
        icon: <FileText className="w-6 h-6" />,
        feature: 'Atividades',
        action: 'Fazer primeira atividade'
      },
      {
        id: 'progresso',
        title: 'Acompanhar Progresso',
        description: 'Visualize suas notas e evolução',
        icon: <BarChart3 className="w-6 h-6" />,
        feature: 'Meu Progresso',
        action: 'Ver dashboard'
      },
      {
        id: 'materiais-estudo',
        title: 'Materiais de Estudo',
        description: 'Acesse recursos educacionais personalizados',
        icon: <BookOpen className="w-6 h-6" />,
        feature: 'Biblioteca',
        action: 'Explorar materiais'
      }
    ],
    pais: [
      {
        id: 'dashboard-pais',
        title: 'Dashboard Familiar',
        description: 'Visualize o progresso dos seus filhos',
        icon: <BarChart3 className="w-6 h-6" />,
        feature: 'Acompanhamento',
        action: 'Ver progresso'
      },
      {
        id: 'relatorios-pais',
        title: 'Relatórios Periódicos',
        description: 'Configure e receba relatórios automáticos',
        icon: <FileText className="w-6 h-6" />,
        feature: 'Relatórios',
        action: 'Configurar alertas'
      },
      {
        id: 'comunicacao',
        title: 'Comunicação',
        description: 'Entre em contato com professores e escola',
        icon: <Users className="w-6 h-6" />,
        feature: 'Comunicação',
        action: 'Configurar preferências'
      }
    ]
  };

  const steps = tutorialSteps[userType] || [];
  const step = steps[currentStep];

  const handleStepComplete = () => {
    if (step && !completedSteps.includes(step.id)) {
      setCompletedSteps([...completedSteps, step.id]);
    }
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkipTutorial = () => {
    onComplete();
  };

  if (!step) {
    onComplete();
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Tutorial Interativo</h2>
        <p className="text-muted-foreground">
          Conheça as principais funcionalidades da sua conta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Lista de Steps */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Próximos Passos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {steps.map((tutorialStep, index) => (
                <div 
                  key={tutorialStep.id}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    index === currentStep 
                      ? 'bg-primary/10 border border-primary/20' 
                      : completedSteps.includes(tutorialStep.id)
                      ? 'bg-green-50 text-green-700'
                      : 'bg-muted/50'
                  }`}
                >
                  <div className={`p-1 rounded ${
                    index === currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : completedSteps.includes(tutorialStep.id)
                      ? 'bg-green-500 text-white'
                      : 'bg-muted'
                  }`}>
                    {completedSteps.includes(tutorialStep.id) ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      tutorialStep.icon
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{tutorialStep.title}</p>
                    <p className="text-xs text-muted-foreground">{tutorialStep.feature}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo Principal */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  {step.icon}
                </div>
                <div>
                  <Badge variant="secondary" className="mb-2">
                    Passo {currentStep + 1} de {steps.length}
                  </Badge>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <CardDescription className="text-base">
                    {step.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Dica:</h4>
                    <p className="text-sm text-blue-800">
                      {step.feature} é uma das funcionalidades mais utilizadas. 
                      Este tutorial vai te ajudar a aproveitá-la ao máximo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Simulação da Interface */}
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center bg-muted/20">
                <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-medium mb-2">Demonstração Interativa</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Aqui você veria uma demonstração de como {step.action.toLowerCase()}
                </p>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Demo
                </Button>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  Voltar
                </Button>
                <Button variant="outline" onClick={handleSkipTutorial}>
                  Pular Tutorial
                </Button>
                <Button onClick={handleStepComplete} className="flex-1">
                  {currentStep < steps.length - 1 ? (
                    <>
                      Próximo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    'Finalizar'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
