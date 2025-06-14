
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface AvaliacaoRedacoesProps {
  onBack: () => void;
}

export function AvaliacaoRedacoes({ onBack }: AvaliacaoRedacoesProps) {
  const [step, setStep] = useState<'setup' | 'upload' | 'results'>('setup');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Avaliação de Redações</h1>
          <p className="text-muted-foreground">
            Configure os critérios de avaliação e faça upload das redações
          </p>
        </div>
      </div>

      {step === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Critérios de Avaliação
            </CardTitle>
            <CardDescription>
              Defina os parâmetros para análise das redações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="theme">Tema da Redação</Label>
              <Input id="theme" placeholder="Ex: A importância da educação digital" />
            </div>
            
            <div>
              <Label htmlFor="type">Tipo de Texto</Label>
              <Input id="type" placeholder="Ex: Dissertativo-argumentativo" />
            </div>
            
            <div>
              <Label htmlFor="instructions">Instruções Específicas</Label>
              <Textarea 
                id="instructions" 
                placeholder="Ex: Mínimo de 20 linhas, máximo de 30. Deve conter introdução, desenvolvimento e conclusão."
                className="min-h-24"
              />
            </div>

            <div>
              <Label className="text-base font-medium">Critérios de Análise</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {[
                  'Coerência e coesão',
                  'Argumentação',
                  'Uso da norma culta',
                  'Estrutura textual',
                  'Criatividade',
                  'Adequação ao tema'
                ].map((criteria) => (
                  <div key={criteria} className="flex items-center space-x-2">
                    <Checkbox id={criteria} defaultChecked />
                    <Label htmlFor={criteria} className="text-sm">{criteria}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => setStep('upload')} className="w-full">
              Próximo: Upload das Redações
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload das Redações
            </CardTitle>
            <CardDescription>
              Faça upload das redações para análise automática
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium">Arraste redações aqui ou clique para selecionar</p>
              <p className="text-sm text-muted-foreground">
                Suporte para imagens (JPG, PNG), PDFs e documentos de texto
              </p>
              <Button variant="outline" className="mt-4">
                Selecionar Arquivos
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('setup')}>
                Voltar
              </Button>
              <Button onClick={() => setStep('results')} className="flex-1">
                Iniciar Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'results' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Resultados da Avaliação
            </CardTitle>
            <CardDescription>
              Feedback detalhado e estruturado para cada redação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">
                📝 Avaliação Concluída
              </h3>
              <p className="text-sm text-blue-700">
                Análise detalhada disponível com feedback construtivo para cada critério.
              </p>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Redação - João Silva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Coerência:</span>
                      <span className="ml-2 text-green-600">Muito Bom</span>
                    </div>
                    <div>
                      <span className="font-medium">Argumentação:</span>
                      <span className="ml-2 text-yellow-600">Bom</span>
                    </div>
                    <div>
                      <span className="font-medium">Estrutura:</span>
                      <span className="ml-2 text-green-600">Excelente</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <strong>Feedback:</strong> Texto bem estruturado com introdução clara. 
                    Sugestão: desenvolver melhor os argumentos no segundo parágrafo...
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('setup')}>
                Nova Avaliação
              </Button>
              <Button variant="outline">
                Baixar Relatórios
              </Button>
              <Button onClick={onBack}>
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
