
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface VerificacaoGabaritoProps {
  onBack: () => void;
}

export function VerificacaoGabarito({ onBack }: VerificacaoGabaritoProps) {
  const [step, setStep] = useState<'setup' | 'upload' | 'results'>('setup');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Verificação com Gabarito</h1>
          <p className="text-muted-foreground">
            Configure o gabarito e faça upload das respostas para verificação automática
          </p>
        </div>
      </div>

      {step === 'setup' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Configurar Gabarito
            </CardTitle>
            <CardDescription>
              Defina as respostas corretas para a verificação automática
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título da Atividade</Label>
              <Input id="title" placeholder="Ex: Prova de Matemática - 1º Bimestre" />
            </div>
            
            <div>
              <Label htmlFor="subject">Matéria</Label>
              <Input id="subject" placeholder="Ex: Matemática" />
            </div>
            
            <div>
              <Label htmlFor="answers">Gabarito (uma resposta por linha)</Label>
              <Textarea 
                id="answers" 
                placeholder="1. A&#10;2. B&#10;3. C&#10;4. D&#10;5. A"
                className="min-h-32"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Digite cada resposta em uma linha. Ex: "1. A" ou apenas "A"
              </p>
            </div>

            <Button onClick={() => setStep('upload')} className="w-full">
              Próximo: Upload de Respostas
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload das Respostas
            </CardTitle>
            <CardDescription>
              Faça upload das imagens ou PDFs com as respostas dos alunos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium">Arraste arquivos aqui ou clique para selecionar</p>
              <p className="text-sm text-muted-foreground">
                Suporte para imagens (JPG, PNG) e PDFs
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
                Iniciar Verificação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'results' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Resultados da Verificação
            </CardTitle>
            <CardDescription>
              Análise completa das respostas verificadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">
                ✅ Verificação Concluída
              </h3>
              <p className="text-sm text-green-700">
                Processamento realizado com sucesso. Relatório detalhado disponível.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-muted-foreground">Aproveitamento Médio</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Provas Analisadas</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-muted-foreground">Questões com Mais Erros</div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('setup')}>
                Nova Verificação
              </Button>
              <Button variant="outline">
                Baixar Relatório
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
