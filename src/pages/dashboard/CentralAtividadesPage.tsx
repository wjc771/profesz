
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Plus, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CentralAtividadesPage() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Star className="h-8 w-8 text-primary" />
          Central de Atividades
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Crie e gerencie avaliações, exercícios e atividades pedagógicas
        </p>
      </div>
      
      {/* Tab Navigation */}
      <TabNavigation />
      
      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-card/50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-primary" /> 
              Criar Avaliação
            </CardTitle>
            <CardDescription>
              Gere avaliações personalizadas com questões alinhadas aos seus objetivos pedagógicos.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button 
              onClick={() => navigate("/dashboard/atividades/criar")} 
              className="w-full"
              variant="default"
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Avaliação
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-card/50 border-b">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Minhas Atividades
            </CardTitle>
            <CardDescription>Acesse suas avaliações e atividades criadas</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              <p className="mb-2">Nenhuma atividade criada ainda.</p>
              <Button 
                variant="outline" 
                onClick={() => navigate("/dashboard/atividades/criar")}
              >
                Criar primeira atividade
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
