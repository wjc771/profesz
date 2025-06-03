
import { UseFormReturn } from "react-hook-form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Send, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface ResumoFinalStepProps {
  form: UseFormReturn<any>;
}

export function ResumoFinalStep({ form }: ResumoFinalStepProps) {
  const [showWebhookConfig, setShowWebhookConfig] = useState(false);
  const formValues = form.getValues();

  const exportToJSON = () => {
    const dataToExport = {
      ...formValues,
      timestamp: new Date().toISOString(),
      version: "1.0"
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano_de_aula_${formValues.titulo || 'sem_titulo'}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendToWebhook = async () => {
    const webhookUrl = form.getValues("webhookUrl");
    if (!webhookUrl) return;
    
    const dataToSend = {
      ...formValues,
      timestamp: new Date().toISOString(),
      version: "1.0"
    };
    
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });
      
      alert('Dados enviados com sucesso!');
    } catch (error) {
      alert('Erro ao enviar dados. Verifique a URL do webhook.');
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Resumo Final
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        
        {/* Summary Sections */}
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Informações Básicas</h4>
            <div className="bg-muted/30 p-3 rounded-md space-y-1">
              <p><strong>Título:</strong> {formValues.titulo || 'Não informado'}</p>
              <p><strong>Disciplina:</strong> {formValues.disciplina || 'Não informada'}</p>
              <p><strong>Nível:</strong> {formValues.nivelEnsino || 'Não informado'}</p>
              <p><strong>Duração:</strong> {formValues.duracao || 'Não informada'}</p>
            </div>
          </div>

          {formValues.tipoCompeticao && (
            <div>
              <h4 className="font-medium mb-2">Modelo de Competição</h4>
              <div className="bg-muted/30 p-3 rounded-md">
                <p><strong>Tipo:</strong> {formValues.tipoCompeticao}</p>
                {formValues.modelosCompeticao && formValues.modelosCompeticao.length > 0 && (
                  <div className="mt-2">
                    <strong>Modelos:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formValues.modelosCompeticao.map((modelo: string) => (
                        <Badge key={modelo} variant="secondary">{modelo}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-2">Objetivos de Aprendizagem</h4>
            <div className="bg-muted/30 p-3 rounded-md">
              <p className="text-sm">{formValues.objetivosAprendizagem || 'Não informado'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Tema Central</h4>
            <div className="bg-muted/30 p-3 rounded-md">
              <p className="text-sm">{formValues.temaCentral || 'Não informado'}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Export Options */}
        <div className="space-y-4">
          <h4 className="font-medium">Exportar Dados</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              onClick={exportToJSON}
              variant="outline" 
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar JSON
            </Button>
            
            <Button 
              onClick={() => setShowWebhookConfig(!showWebhookConfig)}
              variant="outline" 
              className="w-full"
            >
              <Send className="mr-2 h-4 w-4" />
              Enviar via Webhook
            </Button>
          </div>

          {showWebhookConfig && (
            <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
              <FormField
                control={form.control}
                name="webhookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL do Webhook</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://api.exemplo.com/webhook" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                onClick={sendToWebhook}
                className="w-full"
                disabled={!form.getValues("webhookUrl")}
              >
                <Send className="mr-2 h-4 w-4" />
                Enviar Dados
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Preview Note */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Visualização Completa</p>
              <p>Após finalizar, você poderá visualizar o plano de aula completo formatado e fazer download em PDF.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}
