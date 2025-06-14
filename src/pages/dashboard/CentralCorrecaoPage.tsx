
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CentralCorrecaoPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start gap-2">
          <CheckCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          Central de Correção
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-lg">
          Corrija automaticamente atividades com feedback personalizado
        </p>
      </div>
      
      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="h-5 w-5 text-primary" /> 
              Correção Automática
            </CardTitle>
            <CardDescription className="text-sm">
              Faça upload de atividades para correção automática com IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              variant="default"
              size="default"
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
        
        <Card className="border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Histórico de Correções
            </CardTitle>
            <CardDescription className="text-sm">Acesse o histórico de correções realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
              <p className="mb-3 text-sm">Nenhuma correção realizada ainda.</p>
              <p className="text-xs">Este recurso estará disponível em breve!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
