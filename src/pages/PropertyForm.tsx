
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Property, PropertyType, TransactionType } from '@/types/property';

// Schema de validação para o formulário de propriedades
const propertyFormSchema = z.object({
  title: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
  type: z.enum(['apartment', 'house', 'commercial', 'land', 'other'] as const),
  transactionType: z.enum(['sale', 'rent'] as const),
  price: z.coerce.number().positive('O preço deve ser um valor positivo'),
  propertyTax: z.coerce.number().nonnegative('O IPTU deve ser zero ou positivo').optional(),
  address: z.string().min(5, 'Endereço é obrigatório'),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  zipCode: z.string().min(8, 'CEP é obrigatório'),
  bedrooms: z.coerce.number().int().nonnegative(),
  bathrooms: z.coerce.number().int().nonnegative(),
  parkingSpaces: z.coerce.number().int().nonnegative(),
  area: z.coerce.number().positive('A área deve ser um valor positivo'),
  hasPool: z.boolean().default(false),
  isFurnished: z.boolean().default(false),
  hasElevator: z.boolean().default(false),
  petsAllowed: z.boolean().default(false),
  hasGym: z.boolean().default(false),
  hasBalcony: z.boolean().default(false),
  condominium: z.coerce.number().nonnegative('O valor do condomínio deve ser zero ou positivo').optional(),
  isActive: z.boolean().default(true),
  isPremium: z.boolean().default(false),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

const PropertyForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'apartment',
      transactionType: 'sale',
      price: 0,
      propertyTax: 0,
      address: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      bedrooms: 0,
      bathrooms: 0,
      parkingSpaces: 0,
      area: 0,
      hasPool: false,
      isFurnished: false,
      hasElevator: false,
      petsAllowed: false,
      hasGym: false,
      hasBalcony: false,
      condominium: 0,
      isActive: true,
      isPremium: false,
    },
  });

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      if (!isEditing) {
        setInitialLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        form.reset({
          title: data.title,
          description: data.description,
          type: data.type as PropertyType,
          transactionType: data.transaction_type as TransactionType,
          price: data.price,
          propertyTax: data.property_tax || 0,
          address: data.address,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: data.zip_code,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          parkingSpaces: data.parking_spaces,
          area: data.area,
          hasPool: data.has_pool || false,
          isFurnished: data.is_furnished || false,
          hasElevator: data.has_elevator || false,
          petsAllowed: data.pets_allowed || false,
          hasGym: data.has_gym || false,
          hasBalcony: data.has_balcony || false,
          condominium: data.condominium || 0,
          isActive: data.is_active,
          isPremium: data.is_premium,
        });
      } catch (error: any) {
        console.error('Error fetching property:', error);
        toast({
          title: 'Erro ao carregar imóvel',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/properties');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, isEditing, form, navigate, toast]);

  const onSubmit = async (values: PropertyFormValues) => {
    if (!user) {
      toast({
        title: 'Erro de autenticação',
        description: 'Você precisa estar logado para cadastrar um imóvel.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para inserção/atualização
      const propertyData = {
        title: values.title,
        description: values.description,
        type: values.type,
        transaction_type: values.transactionType,
        price: values.price,
        property_tax: values.propertyTax,
        address: values.address,
        neighborhood: values.neighborhood,
        city: values.city,
        state: values.state,
        zip_code: values.zipCode,
        bedrooms: values.bedrooms,
        bathrooms: values.bathrooms,
        parking_spaces: values.parkingSpaces,
        area: values.area,
        has_pool: values.hasPool,
        is_furnished: values.isFurnished,
        has_elevator: values.hasElevator,
        pets_allowed: values.petsAllowed,
        has_gym: values.hasGym,
        has_balcony: values.hasBalcony,
        condominium: values.condominium,
        is_active: values.isActive,
        is_premium: values.isPremium,
        owner_id: user.id,
      };

      let response;
      
      if (isEditing) {
        // Atualizar imóvel existente
        response = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id);
      } else {
        // Criar novo imóvel
        response = await supabase
          .from('properties')
          .insert([propertyData]);
      }

      if (response.error) throw response.error;

      toast({
        title: isEditing ? 'Imóvel atualizado' : 'Imóvel cadastrado',
        description: isEditing 
          ? 'As informações do imóvel foram atualizadas com sucesso.' 
          : 'O imóvel foi cadastrado com sucesso.',
      });

      navigate('/properties');
    } catch (error: any) {
      console.error('Error saving property:', error);
      toast({
        title: 'Erro ao salvar imóvel',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <MainLayout>
        <div className="container max-w-3xl py-6 flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container max-w-3xl py-6">
        <h1 className="text-3xl font-bold mb-6">
          {isEditing ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações básicas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Informações básicas</h2>
              <Separator />
              
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Apartamento aconchegante no centro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o imóvel em detalhes..." 
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Imóvel</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apartment">Apartamento</SelectItem>
                          <SelectItem value="house">Casa</SelectItem>
                          <SelectItem value="commercial">Comercial</SelectItem>
                          <SelectItem value="land">Terreno</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transactionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Transação</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sale">Venda</SelectItem>
                          <SelectItem value="rent">Aluguel</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="propertyTax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IPTU (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Endereço</h2>
              <Separator />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua, número, complemento" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input placeholder="00000-000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Características */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Características</h2>
              <Separator />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quartos</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banheiros</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parkingSpaces"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vagas</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área (m²)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="condominium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor do Condomínio (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="hasPool"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel>Piscina</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFurnished"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel>Mobiliado</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasElevator"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel>Elevador</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="petsAllowed"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel>Aceita Pets</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasGym"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel>Academia</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hasBalcony"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel>Sacada</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Status</h2>
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel>Ativo</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isPremium"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange} 
                        />
                      </FormControl>
                      <FormLabel>Destaque</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/properties')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Salvando...
                  </>
                ) : isEditing ? 'Atualizar Imóvel' : 'Cadastrar Imóvel'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
};

export default PropertyForm;
