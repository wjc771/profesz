
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function MateriaisPage() {
  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-2 md:px-6 py-4">
      <section className="w-full mb-3">
        <h1 className="text-2xl md:text-3xl font-bold mb-0.5">
          Adaptador de Materiais
        </h1>
        <p className="text-muted-foreground text-sm">
          Adapte materiais para diferentes públicos
        </p>
      </section>
      
      <TabNavigation />
      
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> 
              Adaptador de Materiais
            </CardTitle>
            <CardDescription>
              Adapte rapidamente textos, atividades ou slides para diferentes públicos e dificuldades.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>Este recurso estará disponível em breve!</p>
              <p className="text-sm mt-1">Estamos trabalhando para trazer esta funcionalidade para você.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
