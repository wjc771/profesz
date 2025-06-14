
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, FileText, CheckCircle, Clock } from "lucide-react";

export function UserStats() {
  // Mock data - seria substituído por dados reais da API
  const stats = {
    planosDeAula: { current: 12, limit: 50 },
    atividades: { current: 8, limit: 30 },
    correcoes: { current: 15, total: 20 },
    horasEconomizadas: 24
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Suas Estatísticas</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Book className="h-4 w-4 text-primary" />
              Planos de Aula
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Criados este mês</span>
                <span className="font-medium">{stats.planosDeAula.current}/{stats.planosDeAula.limit}</span>
              </div>
              <Progress value={(stats.planosDeAula.current / stats.planosDeAula.limit) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-blue-500" />
              Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Geradas este mês</span>
                <span className="font-medium">{stats.atividades.current}/{stats.atividades.limit}</span>
              </div>
              <Progress value={(stats.atividades.current / stats.atividades.limit) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Correções
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Realizadas</span>
                <span className="font-medium">{stats.correcoes.current}</span>
              </div>
              <p className="text-xs text-muted-foreground">Total de {stats.correcoes.total} atividades corrigidas</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-orange-500" />
              Tempo Economizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold text-orange-500">{stats.horasEconomizadas}h</p>
              <p className="text-xs text-muted-foreground">Este mês com automação</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
