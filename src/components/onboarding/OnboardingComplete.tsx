
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { UserType } from '@/types/profile';

interface Mission {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  reward?: string;
}

interface OnboardingCompleteProps {
  userType: UserType;
  userName?: string;
  onFinish: () => void;
}

export function OnboardingComplete({ userType, userName, onFinish }: OnboardingCompleteProps) {
  const missions: Mission[] = [
    {
      id: 'profile',
      title: 'Perfil Completo',
      description: 'Configurou suas informações pessoais',
      completed: true
    },
    {
      id: 'preferences',
      title: 'Preferências Definidas',
      description: 'Configurou suas preferências de uso',
      completed: true
    },
    {
      id: 'tutorial',
      title: 'Tutorial Concluído',
      description: 'Conheceu as principais funcionalidades',
      completed: true
    },
    {
      id: 'first-material',
      title: 'Primeiro Material',
      description: 'Pronto para criar seu primeiro conteúdo',
      completed: false,
      reward: '🎁 Acesso a templates premium por 7 dias'
    }
  ];

  const getWelcomeMessage = () => {
    switch (userType) {
      case 'professor':
        return 'Sua jornada educacional personalizada está pronta! Comece criando seu primeiro plano de aula.';
      case 'instituicao':
        return 'Sua plataforma institucional está configurada! Adicione usuários e explore os relatórios.';
      case 'aluno':
        return 'Seu ambiente de estudos está preparado! Comece explorando as atividades disponíveis.';
      case 'pais':
        return 'Seu dashboard familiar está ativo! Acompanhe o progresso educacional dos seus filhos.';
      default:
        return 'Bem-vindo ao ProfesZ! Sua conta está configurada e pronta para uso.';
    }
  };

  const getNextSteps = () => {
    switch (userType) {
      case 'professor':
        return [
          { action: 'Criar primeiro plano de aula', path: '/plano-de-aula' },
          { action: 'Explorar biblioteca de recursos', path: '/dashboard/materiais' },
          { action: 'Configurar turmas', path: '/settings' }
        ];
      case 'instituicao':
        return [
          { action: 'Adicionar professores', path: '/users' },
          { action: 'Ver relatórios institucionais', path: '/dashboard' },
          { action: 'Configurar padrões', path: '/settings' }
        ];
      case 'aluno':
        return [
          { action: 'Ver atividades disponíveis', path: '/dashboard/atividades' },
          { action: 'Acompanhar progresso', path: '/dashboard' },
          { action: 'Explorar materiais', path: '/dashboard/materiais' }
        ];
      case 'pais':
        return [
          { action: 'Ver progresso dos filhos', path: '/dashboard' },
          { action: 'Configurar alertas', path: '/settings' },
          { action: 'Explorar relatórios', path: '/dashboard/acompanhamento' }
        ];
      default:
        return [{ action: 'Ir para dashboard', path: '/dashboard' }];
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Card className="text-center">
        <CardHeader className="space-y-6">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <Trophy className="w-10 h-10 text-green-600" />
          </div>
          
          <div>
            <CardTitle className="text-3xl font-bold mb-2">
              🎉 Parabéns, {userName ? userName.split(' ')[0] : 'usuário'}!
            </CardTitle>
            <CardDescription className="text-lg">
              Seu onboarding foi concluído com sucesso
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
            <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
            <p className="text-base text-gray-700">
              {getWelcomeMessage()}
            </p>
          </div>

          {/* Missões Concluídas */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Missões Concluídas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missions.map((mission) => (
                <div 
                  key={mission.id}
                  className={`p-3 rounded-lg border text-left ${
                    mission.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-yellow-50 border-yellow-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {mission.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-yellow-400 rounded-full" />
                    )}
                    <span className="font-medium text-sm">{mission.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {mission.description}
                  </p>
                  {mission.reward && (
                    <Badge variant="secondary" className="text-xs">
                      {mission.reward}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Próximos Passos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Próximos Passos Sugeridos</h3>
            <div className="space-y-2">
              {getNextSteps().map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="flex-1 text-sm font-medium">{step.action}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t">
            <Button onClick={onFinish} size="lg" className="w-full md:w-auto">
              Começar a usar o ProfesZ
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <p className="text-xs text-muted-foreground mt-4">
              Você pode sempre acessar este tutorial novamente em Configurações → Ajuda
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
