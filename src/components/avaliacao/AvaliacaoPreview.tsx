
import { CheckCircle } from "lucide-react";
import { FilePreview } from "@/components/ui/file-preview";

interface AvaliacaoPreviewProps {
  avaliacaoGerada: any;
  formatoSaida: string[];
}

export function AvaliacaoPreview({ avaliacaoGerada, formatoSaida }: AvaliacaoPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <div className="flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="text-sm text-green-800">
            <p className="font-medium mb-1">Avaliação gerada com sucesso!</p>
            <p>Sua avaliação foi criada e está pronta para download.</p>
          </div>
        </div>
      </div>

      <FilePreview 
        data={avaliacaoGerada}
        formats={formatoSaida || ['pdf']}
      />
    </div>
  );
}
