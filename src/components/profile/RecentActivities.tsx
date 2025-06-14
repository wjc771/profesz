
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Book, FileText, CheckCircle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

interface Activity {
  id: string;
  type: 'plano' | 'atividade' | 'correcao';
  title: string;
  date: string;
  status: 'concluido' | 'em_andamento' | 'pendente';
}

export function RecentActivities() {
  // Mock data - seria substituído por dados reais da API
  const activities: Activity[] = [
    {
      id: '1',
      type: 'plano',
      title: 'Plano de Aula - Matemática 5º Ano',
      date: '2024-06-14',
      status: 'concluido'
    },
    {
      id: '2',
      type: 'atividade',
      title: 'Lista de Exercícios - Frações',
      date: '2024-06-13',
      status: 'concluido'
    },
    {
      id: '3',
      type: 'correcao',
      title: 'Correção Automática - Português',
      date: '2024-06-12',
      status: 'em_andamento'
    }
  ];

  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'plano': return <Book className="h-4 w-4" />;
      case 'atividade': return <FileText className="h-4 w-4" />;
      case 'correcao': return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Activity['status']) => {
    switch (status) {
      case 'concluido':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'em_andamento':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Em andamento</Badge>;
      case 'pendente':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Pendente</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Atividades Recentes
        </CardTitle>
        <CardDescription>
          Suas últimas atividades na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getIcon(activity.type)}
                <div>
                  <p className="font-medium text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(activity.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(activity.status)}
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t">
            <Link to="/dashboard">
              <Button variant="outline" className="w-full">
                Ver Todas as Atividades
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
