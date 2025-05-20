
import { useState, useEffect } from "react";
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, Book, Lightbulb } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { mockProfiles } from "@/lib/mockData";

export default function AjudaPage() {
  const { user } = useAuth();
  const [userType, setUserType] = useState<string>("aluno");
  const [question, setQuestion] = useState("");
  
  useEffect(() => {
    const getUserType = async () => {
      if (!user) return;
      const mockProfile = mockProfiles.find(profile => profile.id === user.id);
      if (mockProfile) {
        setUserType(mockProfile.type);
      }
    };
    getUserType();
  }, [user]);

  // Mock recommended resources
  const recommendedResources = [
    {
      title: "Matemática Básica: Frações",
      description: "Vídeo tutorial sobre operações com frações",
      type: "video"
    },
    {
      title: "Exercícios de Gramática",
      description: "Conjunto de exercícios para praticar concordância verbal",
      type: "worksheet"
    },
    {
      title: "História do Brasil: Período Colonial",
      description: "Material de leitura com resumos e mapas mentais",
      type: "reading"
    }
  ];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-2 md:px-6 py-4">
      <section className="w-full mb-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-0.5">
          Central de Ajuda
        </h1>
        <p className="text-muted-foreground text-sm">
          {userType === "pais" 
            ? "Obtenha ajuda para apoiar os estudos do seu filho" 
            : "Tire dúvidas e encontre recursos para aprender melhor"}
        </p>
      </section>
      
      <TabNavigation />
      
      {/* Ask Question Box */}
      <Card className="w-full mb-6 mt-4">
        <CardHeader>
          <div className="flex items-center">
            <HelpCircle className="h-5 w-5 text-primary mr-2" />
            <CardTitle>Tire uma dúvida</CardTitle>
          </div>
          <CardDescription>
            {userType === "pais" 
              ? "Faça uma pergunta para ajudar seu filho nas tarefas escolares" 
              : "Descreva sua dúvida e receba ajuda personalizada"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder={
              userType === "pais" 
                ? "Ex: Como ajudar meu filho com frações?" 
                : "Ex: Como resolver equações de segundo grau?"
            }
            className="mb-4"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Use linguagem clara e específica para melhores respostas
            </div>
            <Button>
              <Search className="h-4 w-4 mr-2" />
              Enviar Pergunta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Resources */}
      <Card className="w-full mb-6">
        <CardHeader>
          <div className="flex items-center">
            <Book className="h-5 w-5 text-green-500 mr-2" />
            <CardTitle>Recursos Recomendados</CardTitle>
          </div>
          <CardDescription>
            Materiais de aprendizagem selecionados para você
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendedResources.map((resource, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Acessar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Tips */}
      <Card className="w-full mb-6">
        <CardHeader>
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
            <CardTitle>
              {userType === "pais" ? "Dicas para Pais" : "Dicas de Estudo"}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            {userType === "pais" ? (
              <>
                <li>Estabeleça uma rotina de estudos consistente para seu filho.</li>
                <li>Crie um ambiente de estudo tranquilo e livre de distrações.</li>
                <li>Incentive pequenas pausas entre períodos de estudo intenso.</li>
                <li>Reconheça e celebre os progressos, mesmo os pequenos.</li>
              </>
            ) : (
              <>
                <li>Divida o conteúdo em partes menores e estude um pouco por dia.</li>
                <li>Faça resumos e mapas mentais para visualizar melhor o conteúdo.</li>
                <li>Pratique com exercícios depois de estudar um novo conceito.</li>
                <li>Explique o que você aprendeu para alguém ou para você mesmo.</li>
              </>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
