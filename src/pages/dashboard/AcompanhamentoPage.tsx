
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, BookOpen, Award, TrendingUp, Calendar } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AcompanhamentoPage() {
  // Mock student data
  const student = {
    name: "Lucas Silva",
    grade: "8º Ano - Ensino Fundamental",
    subjects: [
      { name: "Matemática", progress: 75, lastActivity: "19/05/2025" },
      { name: "Português", progress: 82, lastActivity: "20/05/2025" },
      { name: "Ciências", progress: 65, lastActivity: "18/05/2025" },
      { name: "História", progress: 70, lastActivity: "17/05/2025" },
      { name: "Geografia", progress: 68, lastActivity: "16/05/2025" }
    ],
    upcomingEvents: [
      { id: 1, title: "Prova de Matemática", date: "25/05/2025" },
      { id: 2, title: "Entrega do Trabalho de Geografia", date: "27/05/2025" },
      { id: 3, title: "Reunião de Pais e Mestres", date: "30/05/2025" }
    ]
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-2 md:px-6 py-4">
      <section className="w-full mb-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-0.5">
          Acompanhamento Escolar
        </h1>
        <p className="text-muted-foreground text-sm">
          Acompanhe o progresso acadêmico do seu filho
        </p>
      </section>
      
      <TabNavigation />
      
      {/* Student Overview */}
      <Card className="w-full mb-6 mt-4">
        <CardHeader>
          <div className="flex items-center">
            <UserCheck className="h-5 w-5 text-primary mr-2" />
            <CardTitle>Visão Geral do Aluno</CardTitle>
          </div>
          <CardDescription>
            Informações sobre o desempenho escolar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-accent p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{student.name}</h3>
              <p className="text-muted-foreground">{student.grade}</p>
            </div>
            
            <h4 className="font-medium flex items-center mt-4">
              <BookOpen className="h-4 w-4 mr-2" /> Desempenho por Disciplina
            </h4>
            
            <div className="space-y-4">
              {student.subjects.map((subject, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{subject.name}</span>
                    <span className="text-sm">{subject.progress}%</span>
                  </div>
                  <Progress value={subject.progress} className="h-2" />
                  <div className="text-sm text-muted-foreground">
                    Última atividade: {subject.lastActivity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Upcoming Events */}
      <Card className="w-full mb-6">
        <CardHeader>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-500 mr-2" />
            <CardTitle>Próximos Eventos</CardTitle>
          </div>
          <CardDescription>
            Datas importantes e compromissos escolares
          </CardDescription>
        </CardHeader>
        <CardContent>
          {student.upcomingEvents.length > 0 ? (
            <div className="space-y-4">
              {student.upcomingEvents.map(event => (
                <div key={event.id} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">Data: {event.date}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Lembrete
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhum evento próximo.
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Tips for Parents */}
      <Card className="w-full mb-6">
        <CardHeader>
          <div className="flex items-center">
            <Award className="h-5 w-5 text-amber-500 mr-2" />
            <CardTitle>Como Ajudar seu Filho</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Verifique diariamente as tarefas escolares e ofereça suporte quando necessário.</li>
            <li>Crie um ambiente de estudo adequado, silencioso e organizado.</li>
            <li>Estabeleça uma rotina consistente para estudos e atividades escolares.</li>
            <li>Comunique-se regularmente com os professores para acompanhar o progresso.</li>
            <li>Incentive a leitura e atividades que estimulem o aprendizado.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
