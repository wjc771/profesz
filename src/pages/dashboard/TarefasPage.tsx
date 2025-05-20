
import { useState, useEffect } from "react";
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, HelpCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { mockProfiles } from "@/lib/mockData";

export default function TarefasPage() {
  const { user } = useAuth();
  const [userType, setUserType] = useState<string>("aluno");
  
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

  // Mock tasks data
  const pendingTasks = [
    { id: 1, title: "Matemática - Equações de 2º Grau", deadline: "Amanhã", subject: "Matemática" },
    { id: 2, title: "História - Revolução Industrial", deadline: "24/05/2025", subject: "História" },
    { id: 3, title: "Geografia - Clima e Vegetação", deadline: "26/05/2025", subject: "Geografia" }
  ];

  const completedTasks = [
    { id: 4, title: "Português - Análise de Texto", completedDate: "18/05/2025", subject: "Português" },
    { id: 5, title: "Ciências - Sistema Solar", completedDate: "15/05/2025", subject: "Ciências" }
  ];

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-2 md:px-6 py-4">
      <section className="w-full mb-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-0.5">
          {userType === "pais" ? "Acompanhamento de Tarefas" : "Minhas Tarefas"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {userType === "pais" 
            ? "Acompanhe e ajude seu filho nas tarefas escolares" 
            : "Organize e complete suas tarefas escolares"}
        </p>
      </section>
      
      <TabNavigation />
      
      {/* Pending Tasks */}
      <Card className="w-full mb-6 mt-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-500 mr-2" />
              <CardTitle>Tarefas Pendentes</CardTitle>
            </div>
            {userType === "aluno" && (
              <Button variant="outline" size="sm">
                Marcar como concluída
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {pendingTasks.length > 0 ? (
            <div className="space-y-4">
              {pendingTasks.map(task => (
                <div key={task.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">Prazo: {task.deadline}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="h-8">
                        <HelpCircle className="h-4 w-4 mr-1" />
                        {userType === "pais" ? "Ajudar" : "Pedir ajuda"}
                      </Button>
                      {userType === "aluno" && (
                        <Button size="sm" variant="outline" className="h-8">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Concluir
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma tarefa pendente.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Completed Tasks */}
      <Card className="w-full mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <CardTitle>Tarefas Concluídas</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {completedTasks.length > 0 ? (
            <div className="space-y-4">
              {completedTasks.map(task => (
                <div key={task.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">Concluída em: {task.completedDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma tarefa concluída ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
