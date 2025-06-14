
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function CentralAtividadesPage() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start gap-2">
          <Star className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          Central de Atividades
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-lg">
          Crie e gerencie avaliações e exercícios pedagógicos
        </p>
      </div>
      
      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Star className="h-5 w-5 text-primary" /> 
              Criar Avaliação
            </CardTitle>
            <CardDescription className="text-sm">
              Gere avaliações personalizadas com questões alinhadas aos seus objetivos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/dashboard/atividades/criar")} 
              className="w-full"
              size="default"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Avaliação
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Minhas Atividades
            </CardTitle>
            <CardDescription className="text-sm">Acesse suas avaliações criadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              <p className="mb-3 text-sm">Nenhuma atividade criada ainda.</p>
              <Button 
                variant="outline" 
                size="sm"
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
