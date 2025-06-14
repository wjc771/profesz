
import { PlanoFormValues } from "@/hooks/usePlanoForm";

export function getCurrentStepFields(step: number): string[] {
  switch (step) {
    case 1:
      return ['titulo', 'disciplina', 'nivelEnsino', 'anoSerie', 'duracao'];
    case 2:
      return ['objetivosAprendizagem', 'habilidadesBncc'];
    case 3:
      return ['temaCentral', 'topicos', 'abordagemPedagogica'];
    case 4:
      return ['introducao', 'desenvolvimento', 'fechamento', 'diferenciacaoAlunos'];
    case 5:
      return ['metodoAvaliacao', 'atividadesSala', 'atividadesCasa', 'rubricas'];
    case 6:
      return ['recursos', 'materiaisComplementares'];
    case 7:
      return ['tipoCompeticao', 'modelosCompeticao', 'estrategiaCompeticao', 'cronogramaPreparacao'];
    case 8:
      return ['templatePersonalizado', 'linkSiteInstituicao', 'linkPortalAluno', 'linkBiblioteca', 'linkRecursosExtras', 'logo', 'cabecalhoPersonalizado', 'rodapePersonalizado'];
    case 9:
      return [];
    default:
      return [];
  }
}

export function isStepValid(step: number, form: any): boolean {
  const currentFields = getCurrentStepFields(step);
  
  if (currentFields.length === 0) {
    return true;
  }

  const optionalFields = [
    'diferenciacaoAlunos',
    'atividadesCasa',
    'rubricas',
    'habilidadesBncc',
    'materiaisComplementares',
    'tipoCompeticao',
    'modelosCompeticao',
    'estrategiaCompeticao',
    'cronogramaPreparacao',
    'templatePersonalizado',
    'linkSiteInstituicao',
    'linkPortalAluno',
    'linkBiblioteca',
    'linkRecursosExtras',
    'logo',
    'cabecalhoPersonalizado',
    'rodapePersonalizado'
  ];

  return currentFields.every((field) => {
    if (optionalFields.includes(field)) {
      return true;
    }
    
    const fieldState = form.getFieldState(field as any);
    const value = form.getValues(field as any);
    
    if (fieldState.error) {
      return false;
    }
    
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return false;
    }
    
    return true;
  });
}
