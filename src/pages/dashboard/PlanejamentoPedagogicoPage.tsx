
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, GraduationCap, Plus, FileText, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PlanejamentoPedagogicoPage() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start gap-2">
          <Book className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          Planejamento Pedagógico
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-lg">
          Crie e gerencie seus planos de aula personalizados
        </p>
      </div>
      
      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <GraduationCap className="h-5 w-5 text-primary" /> 
              Gerador de Planos
            </CardTitle>
            <CardDescription className="text-sm">
              Gere rapidamente planos de aula personalizados, alinhados à BNCC.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/plano-de-aula")} 
              className="w-full"
              size="default"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Novo Plano
            </Button>
          </CardContent>
        </Card>

        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Trophy className="h-5 w-5 text-primary" />
              Modelos de Competição
            </CardTitle>
            <CardDescription className="text-sm">
              Crie planos focados em vestibulares e olimpíadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate("/plano-de-aula?modelo=competicao")} 
              className="w-full"
              variant="outline"
              size="default"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Explorar Modelos
            </Button>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Meus Planos
            </CardTitle>
            <CardDescription className="text-sm">Acesse seus planos recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              <p className="mb-3 text-sm">Nenhum plano criado ainda.</p>
              <Button 
                variant="outline" 
                size="sm"
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
