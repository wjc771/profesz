
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function PlanosPage() {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-2 md:px-6 py-4">
      <section className="w-full mb-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-0.5">
          Planos de Aula
        </h1>
        <p className="text-muted-foreground text-sm">
          Crie e gerencie seus planos de aula
        </p>
      </section>
      
      <TabNavigation />
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" /> 
              Gerador de Planos
            </CardTitle>
            <CardDescription>
              Gere rapidamente planos de aula personalizados, alinhados à BNCC e adaptados à sua turma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/plano-de-aula")} className="w-full">
              Criar Novo Plano
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Meus Planos</CardTitle>
            <CardDescription>Planos de aula recentes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Nenhum plano criado ainda.</p>
              <Button 
                variant="link" 
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
