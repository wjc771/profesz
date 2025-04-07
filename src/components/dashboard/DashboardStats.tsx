
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserType } from "@/types/profile";
import { Home, Building, User, Users, Search, Heart, MessageSquare, Check } from "lucide-react";

interface DashboardStatsProps {
  userType: UserType;
}

export const DashboardStats = ({ userType }: DashboardStatsProps) => {
  const statsConfig = {
    buyer: [
      { title: 'Buscas Ativas', value: '3', icon: <Search className="h-6 w-6 text-primary" /> },
      { title: 'Matches', value: '12', icon: <Heart className="h-6 w-6 text-red-500" /> },
      { title: 'Contatos Realizados', value: '4', icon: <MessageSquare className="h-6 w-6 text-blue-500" /> },
      { title: 'Imóveis Visitados', value: '2', icon: <Check className="h-6 w-6 text-green-500" /> }
    ],
    owner: [
      { title: 'Imóveis Publicados', value: '5', icon: <Home className="h-6 w-6 text-primary" /> },
      { title: 'Matches', value: '8', icon: <Heart className="h-6 w-6 text-red-500" /> },
      { title: 'Contatos Recebidos', value: '6', icon: <MessageSquare className="h-6 w-6 text-blue-500" /> },
      { title: 'Visitas Agendadas', value: '3', icon: <Check className="h-6 w-6 text-green-500" /> }
    ],
    agent: [
      { title: 'Imóveis Gerenciados', value: '12', icon: <Home className="h-6 w-6 text-primary" /> },
      { title: 'Clientes Ativos', value: '7', icon: <User className="h-6 w-6 text-violet-500" /> },
      { title: 'Matches Gerados', value: '23', icon: <Heart className="h-6 w-6 text-red-500" /> },
      { title: 'Negócios Fechados', value: '4', icon: <Check className="h-6 w-6 text-green-500" /> }
    ],
    agency: [
      { title: 'Imóveis Cadastrados', value: '35', icon: <Building className="h-6 w-6 text-primary" /> },
      { title: 'Corretores', value: '8', icon: <Users className="h-6 w-6 text-violet-500" /> },
      { title: 'Matches Totais', value: '47', icon: <Heart className="h-6 w-6 text-red-500" /> },
      { title: 'Negócios Realizados', value: '12', icon: <Check className="h-6 w-6 text-green-500" /> }
    ]
  };

  const stats = statsConfig[userType] || statsConfig.buyer;

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
