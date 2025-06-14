
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VerificacaoGabarito } from "@/components/verificacao/VerificacaoGabarito";
import { AvaliacaoRedacoes } from "@/components/verificacao/AvaliacaoRedacoes";
import { useState } from "react";

export default function CentralVerificacaoPage() {
  const [activeFeature, setActiveFeature] = useState<'overview' | 'gabarito' | 'redacoes'>('overview');

  if (activeFeature === 'gabarito') {
    return <VerificacaoGabarito onBack={() => setActiveFeature('overview')} />;
  }

  if (activeFeature === 'redacoes') {
    return <AvaliacaoRedacoes onBack={() => setActiveFeature('overview')} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center md:justify-start gap-2">
          <Search className="h-6 w-6 md:h-8 md:w-8 text-primary" />
          Central de Verificação
        </h1>
        <p className="text-muted-foreground mt-2 text-sm md:text-lg">
          Verificação automática de atividades e avaliação inteligente de redações
        </p>
      </div>
      
      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveFeature('gabarito')}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Search className="h-5 w-5 text-primary" /> 
              Verificação com Gabarito
            </CardTitle>
            <CardDescription className="text-sm">
              Upload de respostas digitais, verificação automática e relatório de desempenho instantâneo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              variant="default"
              size="default"
              onClick={() => setActiveFeature('gabarito')}
            >
              <Upload className="mr-2 h-4 w-4" />
              Iniciar Verificação
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Ideal para provas objetivas e exercícios
            </p>
          </CardContent>
        </Card>
        
        <Card className="border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveFeature('redacoes')}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-primary" />
              Avaliação de Redações
            </CardTitle>
            <CardDescription className="text-sm">
              IA analisa redações e oferece feedback estruturado sobre coerência, coesão e argumentação.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              variant="default"
              size="default"
              onClick={() => setActiveFeature('redacoes')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Avaliar Redações
            </Button>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Feedback construtivo e detalhado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
          📋 Importante: Ferramenta de Apoio Pedagógico
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
          Esta ferramenta oferece verificação automatizada e feedback estruturado para auxiliar no processo de avaliação.
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          A avaliação final e as decisões pedagógicas sempre cabem ao professor.
        </p>
      </div>
    </div>
  );
}
