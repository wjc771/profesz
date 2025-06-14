
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Building, User, Users } from 'lucide-react';
import { UserType } from '@/types/profile';

interface UserTypeOption {
  type: UserType;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

interface UserTypeSelectorProps {
  selectedType?: UserType;
  onSelect: (type: UserType) => void;
  onNext: () => void;
}

export function UserTypeSelector({ selectedType, onSelect, onNext }: UserTypeSelectorProps) {
  const userTypes: UserTypeOption[] = [
    {
      type: 'professor',
      title: 'Professor(a)',
      description: 'Crie materiais educacionais e gerencie suas turmas',
      icon: <GraduationCap className="w-8 h-8" />,
      features: [
        'Criar planos de aula personalizados',
        'Gerar atividades e avaliações',
        'Correção automática',
        'Relatórios de desempenho'
      ]
    },
    {
      type: 'instituicao',
      title: 'Instituição de Ensino',
      description: 'Gerencie professores, alunos e recursos institucionais',
      icon: <Building className="w-8 h-8" />,
      features: [
        'Gestão de múltiplos usuários',
        'Relatórios institucionais',
        'Padronização de materiais',
        'Dashboard administrativo'
      ]
    },
    {
      type: 'aluno',
      title: 'Aluno(a)',
      description: 'Acesse atividades e acompanhe seu progresso',
      icon: <User className="w-8 h-8" />,
      features: [
        'Realizar atividades interativas',
        'Acompanhar notas e progresso',
        'Acesso a materiais de estudo',
        'Feedback personalizado'
      ]
    },
    {
      type: 'pais',
      title: 'Pais/Responsáveis',
      description: 'Acompanhe o progresso educacional dos seus filhos',
      icon: <Users className="w-8 h-8" />,
      features: [
        'Visualizar progresso dos filhos',
        'Receber relatórios periódicos',
        'Comunicação com escola',
        'Alertas personalizados'
      ]
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Como você vai usar o Profzi?</h2>
        <p className="text-muted-foreground">
          Selecione a opção que melhor descreve seu perfil para personalizar sua experiência
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {userTypes.map((option) => (
          <Card 
            key={option.type}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedType === option.type ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelect(option.type)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  selectedType === option.type 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {option.icon}
                </div>
                <div>
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-2">
                {option.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button 
          onClick={onNext} 
          disabled={!selectedType}
          size="lg"
          className="w-full md:w-auto"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}
