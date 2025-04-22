
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Book, Check, AlertCircle, FileText } from "lucide-react";

const planosLimites = {
  inicial: 3,
  essencial: 30,
  maestro: -1,
  institucional: -1,
};

const getPlanoLabel = (plano: string) => {
  switch (plano) {
    case "inicial":
      return "Inicial";
    case "essencial":
      return "Essencial";
    case "maestro":
      return "Maestro";
    case "institucional":
      return "Institucional";
    default:
      return "Plano desconhecido";
  }
};

const getRecursosPlano = (plano: string) => {
  switch (plano) {
    case "inicial":
      return [
        { name: "Limite de 3 planos/mês", included: true },
        { name: "Interface básica", included: true },
        { name: "Sem alinhamento BNCC", included: false },
      ];
    case "essencial":
      return [
        { name: "Limite de 30 planos/mês", included: true },
        { name: "Interface completa", included: true },
        { name: "Alinhamento BNCC básico", included: true },
      ];
    case "maestro":
      return [
        { name: "Uso ilimitado", included: true },
        { name: "Alinhamento BNCC completo", included: true },
        { name: "Histórico de planos", included: true },
        { name: "Templates personalizados", included: true },
      ];
    case "institucional":
      return [
        { name: "Todos os recursos", included: true },
        { name: "Integração com currículo institucional", included: true },
      ];
    default:
      return [];
  }
};

export function PlanoDeAulaForm({ plano = "inicial" }: { plano: string }) {
  const [tema, setTema] = useState("");
  const [serie, setSerie] = useState("");
  const [objetivos, setObjetivos] = useState("");
  const [planosGerados, setPlanosGerados] = useState<{ tema: string; serie: string; objetivos: string; conteudo: string; }[]>([]);

  const limite = planosLimites[plano as keyof typeof planosLimites];
  const atingiuLimite = limite > 0 && planosGerados.length >= limite;

  const handleGerarPlano = (e: React.FormEvent) => {
    e.preventDefault();
    if (atingiuLimite) return;
    // Simular um plano gerado simples
    setPlanosGerados([
      {
        tema,
        serie,
        objetivos,
        conteudo: `Plano de aula de ${tema} para ${serie}\n\nObjetivos: ${objetivos}\n\nConteúdo programático e sugestões...`,
      },
      ...planosGerados,
    ]);
    setTema("");
    setSerie("");
    setObjetivos("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8 border rounded-xl p-4 bg-card shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Book className="text-primary" />
          <h1 className="font-bold text-xl">
            Gerador de Planos de Aula ({getPlanoLabel(plano)})
          </h1>
        </div>
        <div className="flex flex-wrap gap-3 mt-1 mb-3">
          {getRecursosPlano(plano).map((r, i) =>
            r.included ? (
              <span key={i} className="px-2 py-1 flex items-center text-xs font-medium rounded bg-green-100 text-green-800 gap-1">
                <Check className="h-3 w-3" /> {r.name}
              </span>
            ) : (
              <span key={i} className="px-2 py-1 flex items-center text-xs font-medium rounded bg-muted text-muted-foreground gap-1 opacity-70 line-through">
                <AlertCircle className="h-3 w-3" /> {r.name}
              </span>
            )
          )}
        </div>
        <form className="space-y-4" onSubmit={handleGerarPlano}>
          <div>
            <Label>Tema</Label>
            <Input
              value={tema}
              onChange={(e) => setTema(e.target.value)}
              required
              placeholder="Ex: Meio Ambiente"
              disabled={atingiuLimite}
            />
          </div>
          <div>
            <Label>Série/ano</Label>
            <Input
              value={serie}
              onChange={(e) => setSerie(e.target.value)}
              required
              placeholder="Ex: 5º ano"
              disabled={atingiuLimite}
            />
          </div>
          <div>
            <Label>Objetivos</Label>
            <Textarea
              value={objetivos}
              onChange={(e) => setObjetivos(e.target.value)}
              required
              placeholder="Descreva os objetivos da aula..."
              disabled={atingiuLimite}
            />
          </div>
          {atingiuLimite && (
            <p className="text-red-500 text-sm">
              Você atingiu o limite do seu plano ({limite} planos/mês).
            </p>
          )}
          <Button type="submit" disabled={atingiuLimite} className="w-full">
            Gerar plano
          </Button>
        </form>
      </div>
      <div>
        <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
          <FileText className="text-muted-foreground" /> Planos gerados
        </h2>
        {planosGerados.length === 0 ? (
          <p className="text-muted-foreground mb-5">Nenhum plano gerado ainda.</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {planosGerados.map((plano, idx) => (
              <li key={idx} className="p-4 border rounded-xl bg-card relative">
                <div className="mb-1 font-semibold">{plano.tema} – {plano.serie}</div>
                <div className="text-sm whitespace-pre-line mb-2">{plano.conteudo}</div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-xs px-2">Editar</Button>
                  <Button variant="secondary" size="sm" className="text-xs px-2">Exportar</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
