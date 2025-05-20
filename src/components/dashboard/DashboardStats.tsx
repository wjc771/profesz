
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserType } from "@/types/profile";
import { Home, Building, User, Users, Search, Heart, MessageSquare, Check, Book, FileText, Star, Award, Clock } from "lucide-react";

interface DashboardStatsProps {
  userType: UserType;
}

export const DashboardStats = ({ userType }: DashboardStatsProps) => {
  const statsConfig = {
    professor: [
      { title: 'Planos de Aula', value: '8', icon: <Book className="h-6 w-6 text-primary" /> },
      { title: 'Questões Criadas', value: '24', icon: <FileText className="h-6 w-6 text-violet-500" /> },
      { title: 'Avaliações', value: '5', icon: <Star className="h-6 w-6 text-amber-500" /> },
      { title: 'Materiais Adaptados', value: '12', icon: <Award className="h-6 w-6 text-green-500" /> }
    ],
    instituicao: [
      { title: 'Professores Ativos', value: '15', icon: <Users className="h-6 w-6 text-primary" /> },
      { title: 'Conteúdos Criados', value: '47', icon: <FileText className="h-6 w-6 text-violet-500" /> },
      { title: 'Avaliações', value: '12', icon: <Star className="h-6 w-6 text-amber-500" /> },
      { title: 'Materiais Compartilhados', value: '36', icon: <Award className="h-6 w-6 text-green-500" /> }
    ],
    aluno: [
      { title: 'Tarefas Concluídas', value: '7', icon: <Check className="h-6 w-6 text-green-500" /> },
      { title: 'Tarefas Pendentes', value: '3', icon: <Clock className="h-6 w-6 text-amber-500" /> },
      { title: 'Questões Praticadas', value: '18', icon: <FileText className="h-6 w-6 text-violet-500" /> },
      { title: 'Materiais Acessados', value: '5', icon: <Book className="h-6 w-6 text-primary" /> }
    ],
    pais: [
      { title: 'Tarefas Acompanhadas', value: '5', icon: <Check className="h-6 w-6 text-green-500" /> },
      { title: 'Novas Atividades', value: '3', icon: <Clock className="h-6 w-6 text-amber-500" /> },
      { title: 'Sugestões de Estudo', value: '7', icon: <FileText className="h-6 w-6 text-violet-500" /> },
      { title: 'Materiais Disponíveis', value: '12', icon: <Book className="h-6 w-6 text-primary" /> }
    ]
  };

  // Use the correct stats based on user type, defaulting to professor if type not found
  const stats = statsConfig[userType] || statsConfig.professor;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
