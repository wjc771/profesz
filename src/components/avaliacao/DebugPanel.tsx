
import { Info } from "lucide-react";

interface DebugPanelProps {
  debugInfo: any;
}

export function DebugPanel({ debugInfo }: DebugPanelProps) {
  if (!debugInfo) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
      <div className="flex items-start gap-2">
        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Debug da Resposta Recebida</p>
          <div className="space-y-2">
            <p><strong>Tipo:</strong> {debugInfo.responseType}</p>
            <p><strong>É Array:</strong> {debugInfo.isArray ? 'Sim' : 'Não'}</p>
            <p><strong>Chaves disponíveis:</strong> {debugInfo.keys.join(', ')}</p>
            <details className="mt-2">
              <summary className="cursor-pointer font-medium">Ver resposta completa</summary>
              <pre className="mt-2 p-2 bg-white rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(debugInfo.originalResponse, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
