
import { UseFormReturn } from "react-hook-form";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionPlanType } from "@/types/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lock, Palette, Link, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TemplateSelector } from "../TemplateSelector";
import { PreviewPanel } from "../PreviewPanel";
import { useState } from "react";

interface PersonalizacaoAvancadaStepProps {
  form: UseFormReturn<any>;
  plano: SubscriptionPlanType;
}

export function PersonalizacaoAvancadaStep({ form, plano }: PersonalizacaoAvancadaStepProps) {
  const canUseAdvancedStyles = plano === 'essencial' || plano === 'maestro' || plano === 'institucional';
  const canUseFullPersonalization = plano === 'maestro' || plano === 'institucional';
  const [showPreview, setShowPreview] = useState(false);
  
  const formValues = form.watch();
  
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          Personalização Avançada
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        
        {/* Template Selection */}
        <div className={`space-y-4 ${!canUseAdvancedStyles && 'opacity-60'}`}>
          <h4 className="font-medium flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Modelo de Template
            {!canUseAdvancedStyles && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
          </h4>
          
          <FormField
            control={form.control}
            name="templatePersonalizado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Escolha um Template</FormLabel>
                <FormControl>
                  <div className={!canUseAdvancedStyles ? 'pointer-events-none' : ''}>
                    <TemplateSelector
                      selectedTemplate={field.value || "moderno"}
                      onSelectTemplate={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Preview Panel */}
        {canUseAdvancedStyles && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Preview em Tempo Real</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? 'Ocultar' : 'Mostrar'} Preview
              </Button>
            </div>
            
            {showPreview && (
              <PreviewPanel 
                formData={formValues}
                template={formValues.templatePersonalizado || "moderno"}
              />
            )}
          </div>
        )}

        <Separator />

        {/* Institution Links */}
        <div className={`space-y-4 ${!canUseFullPersonalization && 'opacity-60'}`}>
          <h4 className="font-medium flex items-center gap-2">
            <Link className="h-4 w-4" />
            Links Institucionais
            {!canUseFullPersonalization && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="linkSiteInstituicao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site da Instituição</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://www.escola.com.br" 
                      {...field} 
                      disabled={!canUseFullPersonalization}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="linkPortalAluno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Portal do Aluno</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://portal.escola.com.br" 
                      {...field} 
                      disabled={!canUseFullPersonalization}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="linkBiblioteca"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biblioteca Digital</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://biblioteca.escola.com.br" 
                      {...field} 
                      disabled={!canUseFullPersonalization}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="linkRecursosExtras"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recursos Extras</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://recursos.escola.com.br" 
                      {...field} 
                      disabled={!canUseFullPersonalization}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Visual Customization */}
        <div className={`space-y-4 ${!canUseFullPersonalization && 'opacity-60'}`}>
          <h4 className="font-medium flex items-center gap-2">
            <Image className="h-4 w-4" />
            Personalização Visual
            {!canUseFullPersonalization && <Lock className="ml-2 h-4 w-4 text-muted-foreground" />}
          </h4>
          
          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo da Instituição</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="https://example.com/logo.png" 
                    {...field} 
                    disabled={!canUseFullPersonalization}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cabecalhoPersonalizado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cabeçalho Personalizado</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Texto personalizado para o cabeçalho do plano de aula" 
                    {...field} 
                    disabled={!canUseFullPersonalization}
                    className="min-h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="rodapePersonalizado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rodapé Personalizado</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Texto personalizado para o rodapé do plano de aula" 
                    {...field} 
                    disabled={!canUseFullPersonalization}
                    className="min-h-[80px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {!canUseFullPersonalization && (
          <div className="bg-muted/50 p-4 rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground text-center">
              🔒 Recursos de personalização avançada disponíveis nos planos Maestro e Institucional
            </p>
            <Button variant="outline" size="sm" className="w-full mt-2">
              Fazer Upgrade
            </Button>
          </div>
        )}
      </CardContent>
    </>
  );
}
