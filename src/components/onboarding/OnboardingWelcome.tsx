
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, Heart } from 'lucide-react';

interface OnboardingWelcomeProps {
  userName?: string;
  onNext: () => void;
}

export function OnboardingWelcome({ userName, onNext }: OnboardingWelcomeProps) {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {userName ? `Bem-vindo, ${userName.split(' ')[0]}!` : 'Bem-vindo ao ProfesZ!'}
          </CardTitle>
          <CardDescription className="text-lg">
            Sua plataforma educacional completa para criar, ensinar e aprender
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Materiais Educacionais</h3>
              <p className="text-sm text-muted-foreground">
                Crie planos de aula e atividades personalizadas
              </p>
            </div>
            
            <div className="text-center p-4">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Colaboração</h3>
              <p className="text-sm text-muted-foreground">
                Conecte professores, alunos e famílias
              </p>
            </div>
            
            <div className="text-center p-4">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Personalização</h3>
              <p className="text-sm text-muted-foreground">
                Adaptado às suas necessidades específicas
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              Vamos configurar sua conta em poucos passos simples para oferecer a melhor experiência personalizada.
            </p>
            
            <Button onClick={onNext} size="lg" className="w-full md:w-auto">
              Começar Configuração
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
