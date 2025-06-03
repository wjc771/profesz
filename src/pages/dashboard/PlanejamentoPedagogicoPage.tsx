
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, GraduationCap, Plus, FileText, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PlanejamentoPedagogicoPage() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Book className="h-8 w-8 text-primary" />
          Planejamento Pedagógico
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Crie e gerencie seus planos de aula personalizados e modelos de competição
        </p>
      </div>
      
      {/* Tab Navigation */}
      <TabNavigation />
      
      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-card/50 border-b">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" /> 
              Gerador de Planos
            </CardTitle>
            <CardDescription>
              Gere rapidamente planos de aula personalizados, alinhados à BNCC e adaptados à sua turma.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button 
              onClick={() => navigate("/plano-de-aula")} 
              className="w-full"
              variant="default"
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Novo Plano
            </Button>
          </CardContent>
        </Card>

        <Card className="border shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-card/50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Modelos de Competição
            </CardTitle>
            <CardDescription>
              Crie planos focados em vestibulares, olimpíadas e competições acadêmicas.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button 
              onClick={() => navigate("/plano-de-aula?modelo=competicao")} 
              className="w-full"
              variant="outline"
              size="lg"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Explorar Modelos
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-card/50 border-b">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Meus Planos
            </CardTitle>
            <CardDescription>Acesse seus planos de aula recentes</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              <p className="mb-2">Nenhum plano criado ainda.</p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/plano-de-aula")}
              >
                Criar meu primeiro plano
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
