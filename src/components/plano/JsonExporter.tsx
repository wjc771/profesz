
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Send, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JsonExporterProps {
  data: any;
  onSendWebhook?: (webhookUrl: string) => Promise<void>;
}

export function JsonExporter({ data, onSendWebhook }: JsonExporterProps) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const exportToJSON = () => {
    const dataToExport = {
      ...data,
      timestamp: new Date().toISOString(),
      version: "1.0",
      platform: "ProfesZ"
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plano_de_aula_${data.titulo || 'sem_titulo'}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download iniciado",
      description: "O arquivo JSON está sendo baixado.",
    });
  };

  const copyToClipboard = async () => {
    const dataToExport = {
      ...data,
      timestamp: new Date().toISOString(),
      version: "1.0",
      platform: "ProfesZ"
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(dataToExport, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copiado!",
        description: "JSON copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao copiar",
        description: "Não foi possível copiar o JSON.",
      });
    }
  };

  const sendToWebhook = async () => {
    if (!webhookUrl || !onSendWebhook) return;
    
    setIsLoading(true);
    try {
      await onSendWebhook(webhookUrl);
      toast({
        title: "Enviado com sucesso!",
        description: "Os dados foram enviados para o webhook.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no envio",
        description: "Não foi possível enviar os dados. Verifique a URL do webhook.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Exportar Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Opções de export */}
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
            onClick={copyToClipboard}
            variant="outline" 
            className="w-full"
          >
            {copied ? (
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied ? "Copiado!" : "Copiar JSON"}
          </Button>
        </div>

        {/* Configuração de webhook */}
        <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
          <Label htmlFor="webhook-url" className="text-sm font-medium">
            Enviar via Webhook
          </Label>
          
          <Input
            id="webhook-url"
            placeholder="https://api.exemplo.com/webhook"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          
          <Button 
            onClick={sendToWebhook}
            className="w-full"
            disabled={!webhookUrl || isLoading}
          >
            <Send className="mr-2 h-4 w-4" />
            {isLoading ? "Enviando..." : "Enviar Dados"}
          </Button>
          
          <p className="text-xs text-muted-foreground">
            Cole a URL do seu webhook para receber os dados do plano de aula automaticamente.
          </p>
        </div>

        {/* Preview dos dados */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Preview dos dados:</Label>
          <div className="bg-muted/30 p-3 rounded-md max-h-32 overflow-y-auto">
            <pre className="text-xs text-muted-foreground">
              {JSON.stringify({ 
                titulo: data.titulo || "Título do plano",
                disciplina: data.disciplina || "Disciplina",
                timestamp: new Date().toISOString(),
                "...": "outros campos"
              }, null, 2)}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
