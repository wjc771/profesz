import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SubscriptionPlanType } from "@/types/profile";
import { Input } from "@/components/ui/input";

interface EstruturaStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

// Mock data for subjects and units - in a real app, these would come from an API or database
const materias = [
  { value: "matematica", label: "Matemática" },
  { value: "portugues", label: "Português" },
  { value: "ciencias", label: "Ciências" },
  { value: "historia", label: "História" },
  { value: "geografia", label: "Geografia" },
  { value: "fisica", label: "Física" },
  { value: "quimica", label: "Química" },
  { value: "biologia", label: "Biologia" },
  { value: "lingua_estrangeira", label: "Língua Estrangeira" },
  { value: "educacao_fisica", label: "Educação Física" },
  { value: "arte", label: "Arte" },
  { value: "filosofia", label: "Filosofia" },
  { value: "sociologia", label: "Sociologia" },
  { value: "outros", label: "Outros" }
];

const getUnidades = (materia: string) => {
  if (materia === "matematica") {
    return [
      { value: "numeros", label: "Unidade 1 - Números e Operações" },
      { value: "algebra", label: "Unidade 2 - Álgebra e Funções" },
      { value: "geometria", label: "Unidade 3 - Geometria" },
      { value: "estatistica", label: "Unidade 4 - Estatística e Probabilidade" }
    ];
  }
  
  // Default sample units for other subjects
  return [
    { value: "unidade1", label: "Unidade 1" },
    { value: "unidade2", label: "Unidade 2" },
    { value: "unidade3", label: "Unidade 3" },
    { value: "unidade4", label: "Unidade 4" }
  ];
};

const getCapitulos = (unidade: string) => {
  if (unidade === "numeros") {
    return [
      { value: "naturais", label: "Capítulo 1 - Números Naturais" },
      { value: "inteiros", label: "Capítulo 2 - Números Inteiros" },
      { value: "racionais", label: "Capítulo 3 - Números Racionais" },
      { value: "reais", label: "Capítulo 4 - Números Reais" }
    ];
  }
  
  // Default sample chapters
  return [
    { value: "capitulo1", label: "Capítulo 1" },
    { value: "capitulo2", label: "Capítulo 2" },
    { value: "capitulo3", label: "Capítulo 3" },
    { value: "capitulo4", label: "Capítulo 4" }
  ];
};

const getTemas = (capitulo: string) => {
  if (capitulo === "naturais") {
    return [
      { value: "adicao", label: "Adição e Subtração" },
      { value: "multiplicacao", label: "Multiplicação e Divisão" },
      { value: "potenciacao", label: "Potenciação e Radiciação" },
      { value: "expressoes", label: "Expressões Numéricas" },
      { value: "multiplos", label: "Múltiplos e Divisores" }
    ];
  }
  
  // Default sample topics
  return [
    { value: "tema1", label: "Tema 1" },
    { value: "tema2", label: "Tema 2" },
    { value: "tema3", label: "Tema 3" },
    { value: "tema4", label: "Tema 4" },
    { value: "tema5", label: "Tema 5" }
  ];
};

export function EstruturaStep({ form, plano }: EstruturaStepProps) {
  // Update dependent dropdowns when parent selection changes
  const selectedMateria = form.watch("materia");
  const selectedUnidade = form.watch("unidade");
  const selectedCapitulos = form.watch("capitulos") || [];
  
  useEffect(() => {
    // Reset dependent fields when parent selection changes
    if (form.getValues("materia")) {
      form.setValue("unidade", "");
      form.setValue("capitulos", []);
      form.setValue("temas", []);
    }
  }, [selectedMateria, form]);
  
  useEffect(() => {
    if (form.getValues("unidade")) {
      form.setValue("capitulos", []);
      form.setValue("temas", []);
    }
  }, [selectedUnidade, form]);

  return (
    <CardContent className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">Estrutura Curricular</h3>
      
      <FormField
        control={form.control}
        name="materia"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Matéria</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma matéria" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {materias.map(materia => (
                  <SelectItem key={materia.value} value={materia.value}>
                    {materia.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {selectedMateria && (
        <FormField
          control={form.control}
          name="unidade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unidade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getUnidades(selectedMateria).map(unidade => (
                    <SelectItem key={unidade.value} value={unidade.value}>
                      {unidade.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {selectedUnidade && (
        <FormField
          control={form.control}
          name="capitulos"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Capítulos</FormLabel>
                <FormDescription>
                  Selecione um ou mais capítulos
                </FormDescription>
              </div>
              {getCapitulos(selectedUnidade).map((capitulo) => (
                <FormField
                  key={capitulo.value}
                  control={form.control}
                  name="capitulos"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={capitulo.value}
                        className="flex flex-row items-start space-x-3 space-y-0 mb-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(capitulo.value)}
                            onCheckedChange={(checked) => {
                              const values = field.value || []
                              return checked
                                ? field.onChange([...values, capitulo.value])
                                : field.onChange(
                                    values.filter(
                                      (value) => value !== capitulo.value
                                    )
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {capitulo.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {selectedCapitulos.length > 0 && (
        <FormField
          control={form.control}
          name="temas"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Temas</FormLabel>
                <FormDescription>
                  Selecione um ou mais temas
                </FormDescription>
              </div>
              {getTemas(selectedCapitulos[0]).map((tema) => (
                <FormField
                  key={tema.value}
                  control={form.control}
                  name="temas"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={tema.value}
                        className="flex flex-row items-start space-x-3 space-y-0 mb-3"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(tema.value)}
                            onCheckedChange={(checked) => {
                              const values = field.value || []
                              return checked
                                ? field.onChange([...values, tema.value])
                                : field.onChange(
                                    values.filter((value) => value !== tema.value)
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {tema.label}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      
      {/* Seção de Modelos de Vestibulares */}
      <div className="mt-8">
        <h4 className="text-md font-semibold mb-4">Modelos de Vestibulares</h4>
        <FormDescription className="mb-3">
          Selecione vestibulares famosos e quantas questões deseja incluir de cada um
        </FormDescription>
        
        <div className="space-y-4">
          {form.watch("modelosVestibular")?.map((modelo: any, index: number) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-grow">
                <FormLabel>{modelo.nome}</FormLabel>
              </div>
              <div className="w-24">
                <FormField
                  control={form.control}
                  name={`modelosVestibular.${index}.quantidade`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          max={20}
                          value={field.value}
                          onChange={(e) => {
                            const value = parseInt(e.target.value || "0");
                            if (value >= 0 && value <= 20) {
                              field.onChange(value);
                            }
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {(plano === 'essencial' || plano === 'maestro' || plano === 'institucional') && (
        <FormField
          control={form.control}
          name="incluirBncc"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Incluir códigos BNCC
                </FormLabel>
                <FormDescription>
                  Alinhe as questões com os códigos da Base Nacional Comum Curricular
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
      )}
    </CardContent>
  );
}
