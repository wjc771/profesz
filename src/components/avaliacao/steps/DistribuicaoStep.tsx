
import { UseFormReturn } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription 
} from "@/components/ui/form";
import { CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SubscriptionPlanType } from "@/types/profile";
import { Lock } from "lucide-react";

interface DistribuicaoStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function DistribuicaoStep({ form, plano }: DistribuicaoStepProps) {
  const isPaid = plano !== 'inicial';
  const isMaestro = plano === 'maestro' || plano === 'institucional';
  
  return (
    <CardContent className="space-y-6 p-6">
      <h3 className="text-lg font-semibold">Opções de Distribuição</h3>
      
      <FormField
        control={form.control}
        name="formatoSaida"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>Formato de Saída</FormLabel>
              <FormDescription>
                Selecione um ou mais formatos para exportar sua avaliação
              </FormDescription>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="formatoSaida"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes('pdf')}
                        onCheckedChange={(checked) => {
                          const values = field.value || []
                          return checked
                            ? field.onChange([...values, 'pdf'])
                            : field.onChange(values.filter((value: string) => value !== 'pdf'))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      PDF imprimível
                    </FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="formatoSaida"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3 ${!isPaid ? 'opacity-60' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes('doc')}
                        onCheckedChange={(checked) => {
                          if (!isPaid) return;
                          const values = field.value || []
                          return checked
                            ? field.onChange([...values, 'doc'])
                            : field.onChange(values.filter((value: string) => value !== 'doc'))
                        }}
                        disabled={!isPaid}
                      />
                    </FormControl>
                    <div className="flex items-center">
                      <FormLabel className="font-normal">
                        Documento editável (Word/Google Docs)
                      </FormLabel>
                      {!isPaid && <Lock className="h-4 w-4 ml-2 text-muted-foreground" />}
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="formatoSaida"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3 ${!isPaid ? 'opacity-60' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes('online')}
                        onCheckedChange={(checked) => {
                          if (!isPaid) return;
                          const values = field.value || []
                          return checked
                            ? field.onChange([...values, 'online'])
                            : field.onChange(values.filter((value: string) => value !== 'online'))
                        }}
                        disabled={!isPaid}
                      />
                    </FormControl>
                    <div className="flex items-center">
                      <FormLabel className="font-normal">
                        Versão online/digital
                      </FormLabel>
                      {!isPaid && <Lock className="h-4 w-4 ml-2 text-muted-foreground" />}
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="formatoSaida"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3 ${!isMaestro ? 'opacity-60' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes('interativa')}
                        onCheckedChange={(checked) => {
                          if (!isMaestro) return;
                          const values = field.value || []
                          return checked
                            ? field.onChange([...values, 'interativa'])
                            : field.onChange(values.filter((value: string) => value !== 'interativa'))
                        }}
                        disabled={!isMaestro}
                      />
                    </FormControl>
                    <div className="flex items-center">
                      <FormLabel className="font-normal">
                        Apresentação interativa
                      </FormLabel>
                      {!isMaestro && <Lock className="h-4 w-4 ml-2 text-muted-foreground" />}
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="opcaoCompartilhamento"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel>Opções de Compartilhamento</FormLabel>
              <FormDescription>
                Selecione como deseja compartilhar sua avaliação
              </FormDescription>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="opcaoCompartilhamento"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3 ${!isPaid ? 'opacity-60' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes('link')}
                        onCheckedChange={(checked) => {
                          if (!isPaid) return;
                          const values = field.value || []
                          return checked
                            ? field.onChange([...values, 'link'])
                            : field.onChange(values.filter((value: string) => value !== 'link'))
                        }}
                        disabled={!isPaid}
                      />
                    </FormControl>
                    <div className="flex items-center">
                      <FormLabel className="font-normal">
                        Link compartilhável
                      </FormLabel>
                      {!isPaid && <Lock className="h-4 w-4 ml-2 text-muted-foreground" />}
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="opcaoCompartilhamento"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3 ${plano === 'inicial' ? 'opacity-60' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes('email')}
                        onCheckedChange={(checked) => {
                          if (plano === 'inicial') return;
                          const values = field.value || []
                          return checked
                            ? field.onChange([...values, 'email'])
                            : field.onChange(values.filter((value: string) => value !== 'email'))
                        }}
                        disabled={plano === 'inicial'}
                      />
                    </FormControl>
                    <div className="flex items-center">
                      <FormLabel className="font-normal">
                        Envio por e-mail
                      </FormLabel>
                      {plano === 'inicial' && <Lock className="h-4 w-4 ml-2 text-muted-foreground" />}
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="opcaoCompartilhamento"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3 ${!isMaestro ? 'opacity-60' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes('lms')}
                        onCheckedChange={(checked) => {
                          if (!isMaestro) return;
                          const values = field.value || []
                          return checked
                            ? field.onChange([...values, 'lms'])
                            : field.onChange(values.filter((value: string) => value !== 'lms'))
                        }}
                        disabled={!isMaestro}
                      />
                    </FormControl>
                    <div className="flex items-center">
                      <FormLabel className="font-normal">
                        Integração com LMS
                      </FormLabel>
                      {!isMaestro && <Lock className="h-4 w-4 ml-2 text-muted-foreground" />}
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="opcaoCompartilhamento"
                render={({ field }) => (
                  <FormItem className={`flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-3 ${!isMaestro ? 'opacity-60' : ''}`}>
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes('qrcode')}
                        onCheckedChange={(checked) => {
                          if (!isMaestro) return;
                          const values = field.value || []
                          return checked
                            ? field.onChange([...values, 'qrcode'])
                            : field.onChange(values.filter((value: string) => value !== 'qrcode'))
                        }}
                        disabled={!isMaestro}
                      />
                    </FormControl>
                    <div className="flex items-center">
                      <FormLabel className="font-normal">
                        QR Code
                      </FormLabel>
                      {!isMaestro && <Lock className="h-4 w-4 ml-2 text-muted-foreground" />}
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="mt-8 p-4 bg-muted rounded-lg text-muted-foreground text-sm">
        <h4 className="font-medium mb-2">Recursos disponíveis no seu plano</h4>
        <ul className="list-disc list-inside space-y-1">
          {plano === 'inicial' && (
            <>
              <li>Limitado a 25 questões por mês</li>
              <li>Tipos básicos de questões</li>
              <li>Sem alinhamento automático com BNCC</li>
              <li>Exportação apenas em PDF básico</li>
              <li>Sem personalização avançada</li>
            </>
          )}
          {plano === 'essencial' && (
            <>
              <li>Limite de 100 questões por mês</li>
              <li>Todos os tipos de questões</li>
              <li>Alinhamento básico com BNCC</li>
              <li>Exportação em múltiplos formatos</li>
              <li>Personalização básica</li>
              <li>Recursos visuais limitados</li>
            </>
          )}
          {plano === 'maestro' && (
            <>
              <li>Geração ilimitada de questões</li>
              <li>Banco de questões próprio</li>
              <li>Alinhamento avançado com BNCC</li>
              <li>Personalização completa</li>
              <li>Questões adaptativas</li>
              <li>Integração com planos de aula</li>
              <li>Análise de resultados</li>
            </>
          )}
          {plano === 'institucional' && (
            <>
              <li>Todos os recursos do Maestro</li>
              <li>Questões com base no currículo próprio</li>
              <li>Branding institucional</li>
              <li>Integração com sistemas da instituição</li>
              <li>Compartilhamento interno</li>
              <li>Análise avançada de desempenho</li>
            </>
          )}
        </ul>
      </div>
    </CardContent>
  );
}
