
import { PlanoDeAulaForm } from "@/components/plano/PlanoDeAulaForm";

export default function PlanoDeAula() {
  // Simulação: obtenha o plano a partir do localStorage, Auth, ou props no futuro.
  // Troque para 'essencial', 'maestro', 'institucional' para testar.
  const planoAtual = "inicial";

  return (
    <div className="min-h-screen bg-background py-8 px-3">
      <PlanoDeAulaForm plano={planoAtual} />
    </div>
  )
}
