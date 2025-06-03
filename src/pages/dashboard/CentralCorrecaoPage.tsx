
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Upload, FileText, BookCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CentralCorrecaoPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <CheckCircle className="h-8 w-8 text-primary" />
          Central de Correção
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Corrija automaticamente atividades e forneça feedback personalizado
        </p>
      </div>
      
      {/* Tab Navigation */}
      <TabNavigation />
      
      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-card/50 border-b">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" /> 
              Correção Automática
            </CardTitle>
            <CardDescription>
              Faça upload de atividades para correção automática com IA.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Button 
              className="w-full"
              variant="default"
              size="lg"
              disabled
            >
              <Upload className="mr-2 h-4 w-4" />
              Fazer Upload
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Em breve
            </p>
          </CardContent>
        </Card>
        
        <Card className="border shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-card/50 border-b">
            <CardTitle className="flex items-center gap-2">
              <BookCheck className="h-5 w-5 text-primary" />
              Histórico de Correções
            </CardTitle>
            <CardDescription>Acesse o histórico de correções realizadas</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              <p className="mb-2">Nenhuma correção realizada ainda.</p>
              <p className="text-sm">Este recurso estará disponível em breve!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
