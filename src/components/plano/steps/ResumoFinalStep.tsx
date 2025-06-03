
import { UseFormReturn } from "react-hook-form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { JsonExporter } from "../JsonExporter";
import { WebhookService } from "@/utils/webhookService";

interface ResumoFinalStepProps {
  form: UseFormReturn<any>;
}

export function ResumoFinalStep({ form }: ResumoFinalStepProps) {
  const formValues = form.getValues();

  const handleSendWebhook = async (webhookUrl: string) => {
    const sanitizedData = WebhookService.sanitizeData(formValues);
    await WebhookService.sendData(webhookUrl, sanitizedData);
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

          {formValues.templatePersonalizado && (
            <div>
              <h4 className="font-medium mb-2">Personalização</h4>
              <div className="bg-muted/30 p-3 rounded-md">
                <p><strong>Template:</strong> {formValues.templatePersonalizado}</p>
                {formValues.linkSiteInstituicao && (
                  <p><strong>Site Institucional:</strong> {formValues.linkSiteInstituicao}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Export Options */}
        <JsonExporter 
          data={formValues}
          onSendWebhook={handleSendWebhook}
        />

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
