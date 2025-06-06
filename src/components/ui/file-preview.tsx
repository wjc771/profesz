
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Edit, Eye, FileText, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FileDownloadService } from "@/utils/fileDownload";

interface FilePreviewProps {
  data: any;
  formats: string[];
  onDownload?: (format: string, content: string) => void;
}

export function FilePreview({ data, formats, onDownload }: FilePreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeFormat, setActiveFormat] = useState(formats[0] || 'txt');
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});

  const formatContent = (format: string): string => {
    switch (format) {
      case 'txt':
        return formatToText(data);
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'pdf':
        return formatToPdfPreview(data);
      case 'doc':
        return formatToDocPreview(data);
      default:
        return formatToText(data);
    }
  };

  const formatToText = (avaliacaoData: any): string => {
    if (!avaliacaoData || typeof avaliacaoData !== 'object') {
      return `ERRO: Dados de avaliação inválidos\n\nDados recebidos: ${JSON.stringify(avaliacaoData, null, 2)}`;
    }

    let texto = '';
    
    // Cabeçalho
    if (avaliacaoData.cabecalho) {
      texto += 'CABEÇALHO:\n\n';
      texto += 'ESCOLA: _________________________________\n';
      texto += `DISCIPLINA: ${avaliacaoData.cabecalho.disciplina || 'Não informada'}\n`;
      texto += `UNIDADE: ${avaliacaoData.cabecalho.unidade || 'Não informada'}`;
      if (avaliacaoData.cabecalho.capitulo) {
        texto += ` - CAPÍTULO: ${avaliacaoData.cabecalho.capitulo}`;
      }
      texto += '\n';
      texto += `TEMA: ${avaliacaoData.cabecalho.tema || 'Não informado'}\n`;
      texto += 'ALUNO: _________________________________\n';
      texto += 'DATA: ___/___/______\n';
      texto += `DURAÇÃO: ${avaliacaoData.cabecalho.duracao || avaliacaoData.metadata?.tempo_total + ' minutos' || 'Não informada'}\n\n`;
    }

    // Instruções
    if (avaliacaoData.instrucoes && Array.isArray(avaliacaoData.instrucoes) && avaliacaoData.instrucoes.length > 0) {
      texto += 'INSTRUÇÕES:\n\n';
      avaliacaoData.instrucoes.forEach((instrucao: string) => {
        texto += `${instrucao}\n`;
      });
      texto += '\n';
    }

    // Questões
    if (avaliacaoData.questoes && Array.isArray(avaliacaoData.questoes) && avaliacaoData.questoes.length > 0) {
      texto += 'QUESTÕES:\n\n';
      
      avaliacaoData.questoes.forEach((questao: any) => {
        texto += `QUESTÃO ${questao.numero} (${questao.pontuacao})\n`;
        texto += `${questao.enunciado}\n`;
        
        if (questao.alternativas && Array.isArray(questao.alternativas) && questao.alternativas.length > 0) {
          questao.alternativas.forEach((alt: any) => {
            texto += `${alt.letra}) ${alt.texto}\n`;
          });
        }
        
        texto += '\n__________\n\n';
      });
    }

    return texto;
  };

  const formatToPdfPreview = (data: any): string => {
    return `FORMATO PDF - VISUALIZAÇÃO\n${'='.repeat(50)}\n\n${formatToText(data)}`;
  };

  const formatToDocPreview = (data: any): string => {
    return `DOCUMENTO WORD - VISUALIZAÇÃO\n${'='.repeat(50)}\n\n${formatToText(data)}`;
  };

  const getCurrentContent = (format: string): string => {
    return editedContent[format] || formatContent(format);
  };

  const handleContentChange = (format: string, newContent: string) => {
    setEditedContent(prev => ({
      ...prev,
      [format]: newContent
    }));
  };

  const handleDownload = async (format: string) => {
    const content = getCurrentContent(format);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `avaliacao_${timestamp}.${format}`;

    if (onDownload) {
      onDownload(format, content);
    } else {
      await FileDownloadService.downloadFile({
        filename,
        content,
        type: format as 'pdf' | 'doc' | 'txt' | 'json'
      });
    }
  };

  const getFormatLabel = (format: string) => {
    const labels = {
      txt: 'Texto',
      json: 'JSON',
      pdf: 'PDF Preview',
      doc: 'Word Preview'
    };
    return labels[format as keyof typeof labels] || format.toUpperCase();
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json':
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Preview do Arquivo
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2"
            >
              {isEditing ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
              {isEditing ? 'Visualizar' : 'Editar'}
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {formats.map(format => (
            <Badge key={format} variant="secondary" className="gap-1">
              {getFormatIcon(format)}
              {getFormatLabel(format)}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeFormat} onValueChange={setActiveFormat}>
          <TabsList className="grid w-full grid-cols-4">
            {formats.map(format => (
              <TabsTrigger key={format} value={format} className="gap-2">
                {getFormatIcon(format)}
                {getFormatLabel(format)}
              </TabsTrigger>
            ))}
          </TabsList>

          {formats.map(format => (
            <TabsContent key={format} value={format} className="space-y-4">
              <div className="space-y-4">
                {isEditing ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Editando conteúdo do arquivo {getFormatLabel(format)}:
                    </label>
                    <Textarea
                      value={getCurrentContent(format)}
                      onChange={(e) => handleContentChange(format, e.target.value)}
                      className="min-h-[400px] font-mono text-sm"
                      placeholder="Conteúdo do arquivo..."
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Preview do arquivo {getFormatLabel(format)}:
                    </label>
                    <div className="border rounded-md p-4 bg-muted/30 max-h-[400px] overflow-auto">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {getCurrentContent(format)}
                      </pre>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleDownload(format)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Baixar {getFormatLabel(format)}
                  </Button>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
