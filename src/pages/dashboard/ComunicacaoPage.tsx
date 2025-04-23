
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const comunicadoTemplates = [
  {
    id: "reuniao",
    title: "Reunião de Pais",
    content: "Prezados responsáveis, convidamos para reunião de pais e mestres que acontecerá no dia [DATA] às [HORA] no [LOCAL]. Sua presença é muito importante para o desenvolvimento do aluno."
  },
  {
    id: "evento",
    title: "Evento Escolar",
    content: "Informamos que no dia [DATA] acontecerá [NOME DO EVENTO]. Os alunos devem [INSTRUÇÕES]. Contamos com a participação de todos!"
  },
  {
    id: "lembrete",
    title: "Lembrete de Tarefa",
    content: "Lembramos aos alunos e responsáveis que a entrega do trabalho de [MATÉRIA] está marcada para [DATA]. Os critérios de avaliação foram compartilhados em sala."
  }
];

export default function ComunicacaoPage() {
  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-2 md:px-6 py-4">
      <section className="w-full mb-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-0.5">
          Comunicação
        </h1>
        <p className="text-muted-foreground text-sm">
          Mensagens e comunicados para a comunidade escolar
        </p>
      </section>
      
      <TabNavigation />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> 
              Comunicador Inteligente
            </CardTitle>
            <CardDescription>
              Modelos prontos e editáveis para recados, avisos e comunicados escolares.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="meus">Meus Comunicados</TabsTrigger>
              </TabsList>
              
              <TabsContent value="templates" className="space-y-4">
                {comunicadoTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{template.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">{template.content}</p>
                    </CardContent>
                    <CardFooter className="bg-muted/50 flex justify-end border-t">
                      <Button size="sm">Usar Template</Button>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="meus">
                <div className="text-center py-8 text-muted-foreground">
                  <p>Você ainda não criou nenhum comunicado.</p>
                  <Button variant="link">Criar primeiro comunicado</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
