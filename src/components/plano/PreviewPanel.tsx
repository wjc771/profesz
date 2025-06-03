
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, FileText, Palette } from "lucide-react";

interface PreviewPanelProps {
  formData: any;
  template: string;
}

export function PreviewPanel({ formData, template }: PreviewPanelProps) {
  const getTemplateStyles = (templateId: string) => {
    switch (templateId) {
      case "moderno":
        return {
          headerBg: "bg-blue-500",
          accent: "text-blue-600",
          border: "border-blue-200"
        };
      case "classico":
        return {
          headerBg: "bg-gray-700",
          accent: "text-gray-600",
          border: "border-gray-200"
        };
      case "colorido":
        return {
          headerBg: "bg-gradient-to-r from-pink-500 to-emerald-500",
          accent: "text-emerald-600",
          border: "border-emerald-200"
        };
      case "institucional":
        return {
          headerBg: "bg-blue-700",
          accent: "text-blue-700",
          border: "border-blue-200"
        };
      default:
        return {
          headerBg: "bg-primary",
          accent: "text-primary",
          border: "border-primary/20"
        };
    }
  };

  const styles = getTemplateStyles(template);

  return (
    <Card className="max-h-96 overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          Preview em Tempo Real
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`border rounded-lg overflow-hidden ${styles.border}`}>
          {/* Header do plano */}
          <div className={`${styles.headerBg} text-white p-4`}>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <div>
                <h3 className="font-bold text-lg">
                  {formData.titulo || "Título do Plano de Aula"}
                </h3>
                <p className="text-sm opacity-90">
                  {formData.disciplina || "Disciplina"} • {formData.nivelEnsino || "Nível"} • {formData.duracao || "Duração"}
                </p>
              </div>
            </div>

            {formData.cabecalhoPersonalizado && (
              <div className="mt-3 p-2 bg-white/10 rounded text-sm">
                {formData.cabecalhoPersonalizado}
              </div>
            )}
          </div>

          {/* Conteúdo principal */}
          <div className="p-4 space-y-4">
            {formData.objetivosAprendizagem && (
              <div>
                <h4 className={`font-semibold mb-2 ${styles.accent}`}>Objetivos de Aprendizagem</h4>
                <p className="text-sm text-muted-foreground">{formData.objetivosAprendizagem}</p>
              </div>
            )}

            {formData.temaCentral && (
              <div>
                <h4 className={`font-semibold mb-2 ${styles.accent}`}>Tema Central</h4>
                <p className="text-sm text-muted-foreground">{formData.temaCentral}</p>
              </div>
            )}

            {formData.tipoCompeticao && (
              <div>
                <h4 className={`font-semibold mb-2 ${styles.accent}`}>Modelo de Competição</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline">{formData.tipoCompeticao}</Badge>
                  {formData.modelosCompeticao?.map((modelo: string) => (
                    <Badge key={modelo} variant="secondary" className="text-xs">{modelo}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Links institucionais */}
            {(formData.linkSiteInstituicao || formData.linkPortalAluno) && (
              <div>
                <h4 className={`font-semibold mb-2 ${styles.accent}`}>Links Institucionais</h4>
                <div className="space-y-1 text-sm">
                  {formData.linkSiteInstituicao && (
                    <div>Site: <span className="text-blue-600">{formData.linkSiteInstituicao}</span></div>
                  )}
                  {formData.linkPortalAluno && (
                    <div>Portal: <span className="text-blue-600">{formData.linkPortalAluno}</span></div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Rodapé personalizado */}
          {formData.rodapePersonalizado && (
            <div className={`border-t p-3 bg-muted/20 ${styles.border}`}>
              <p className="text-xs text-muted-foreground text-center">
                {formData.rodapePersonalizado}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Template: {template || "Padrão"}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            O preview será atualizado automaticamente conforme você preenche o formulário.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
