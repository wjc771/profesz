
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Palette } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: string[];
}

const templates: Template[] = [
  {
    id: "moderno",
    name: "Moderno",
    description: "Design clean e minimalista com tipografia contemporânea",
    preview: "Clean e minimalista",
    colors: ["#3B82F6", "#E5E7EB", "#111827"]
  },
  {
    id: "classico",
    name: "Clássico",
    description: "Layout tradicional e elegante com elementos formais",
    preview: "Tradicional e elegante",
    colors: ["#1F2937", "#F9FAFB", "#6B7280"]
  },
  {
    id: "colorido",
    name: "Colorido",
    description: "Visual vibrante e dinâmico com cores chamativas",
    preview: "Vibrante e dinâmico",
    colors: ["#EC4899", "#10B981", "#F59E0B"]
  },
  {
    id: "institucional",
    name: "Institucional",
    description: "Formato formal e profissional para instituições",
    preview: "Formal e profissional",
    colors: ["#1E40AF", "#F3F4F6", "#374151"]
  }
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                {selectedTemplate === template.id && (
                  <Badge variant="default" className="text-xs">Selecionado</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{template.description}</p>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Paleta:</span>
                <div className="flex gap-1">
                  {template.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template.id);
                  }}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {previewTemplate && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Preview: {templates.find(t => t.id === previewTemplate)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/20 p-4 rounded-lg border border-dashed">
              <p className="text-sm text-center text-muted-foreground">
                Aqui seria exibido o preview do template selecionado
              </p>
              <div className="mt-2 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewTemplate(null)}
                >
                  Fechar Preview
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
