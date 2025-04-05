
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
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

// Schema de validação para o formulário de demandas
const demandFormSchema = z.object({
  transactionType: z.enum(['sale', 'rent'] as const),
  propertyTypes: z.array(z.enum(['apartment', 'house', 'commercial', 'land', 'other'] as const)).min(1, 'Selecione pelo menos um tipo de imóvel'),
  minPrice: z.coerce.number().positive('O preço mínimo deve ser um valor positivo'),
  maxPrice: z.coerce.number().positive('O preço máximo deve ser um valor positivo').refine(val => val > 0, {
    message: 'O preço máximo deve ser maior que zero',
  }),
  cities: z.array(z.string()).min(1, 'Informe pelo menos uma cidade'),
  neighborhoods: z.array(z.string()).optional(),
  states: z.array(z.string()).min(1, 'Informe pelo menos um estado'),
  minBedrooms: z.coerce.number().int().nonnegative().optional(),
  minBathrooms: z.coerce.number().int().nonnegative().optional(),
  minParkingSpaces: z.coerce.number().int().nonnegative().optional(),
  minArea: z.coerce.number().nonnegative().optional(),
  hasPool: z.boolean().optional(),
  isFurnished: z.boolean().optional(),
  hasElevator: z.boolean().optional(),
  petsAllowed: z.boolean().optional(),
  hasGym: z.boolean().optional(),
  hasBalcony: z.boolean().optional(),
  isActive: z.boolean().default(true),
}).refine(data => data.maxPrice >= data.minPrice, {
  message: "O preço máximo deve ser maior ou igual ao preço mínimo",
  path: ["maxPrice"],
});

type DemandFormValues = z.infer<typeof demandFormSchema>;

const DemandForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== 'new';
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  
  // Para campos com múltiplos valores (como cidades, bairros, etc.)
  const [cityInput, setCityInput] = useState('');
  const [neighborhoodInput, setNeighborhoodInput] = useState('');
  const [stateInput, setStateInput] = useState('');

  const form = useForm<DemandFormValues>({
    resolver: zodResolver(demandFormSchema),
    defaultValues: {
      transactionType: 'sale',
      propertyTypes: ['apartment'],
      minPrice: 0,
      maxPrice: 1000000,
      cities: [],
      neighborhoods: [],
      states: [],
      minBedrooms: 0,
      minBathrooms: 0,
      minParkingSpaces: 0,
      minArea: 0,
      hasPool: false,
      isFurnished: false,
      hasElevator: false,
      petsAllowed: false,
      hasGym: false,
      hasBalcony: false,
      isActive: true,
    },
  });

  useEffect(() => {
    const fetchDemandDetails = async () => {
      if (!isEditing) {
        setInitialLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('property_demands')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        form.reset({
          transactionType: data.transaction_type,
          propertyTypes: data.property_types,
          minPrice: data.min_price,
          maxPrice: data.max_price,
          cities: data.cities,
          neighborhoods: data.neighborhoods || [],
          states: data.states,
          minBedrooms: data.min_bedrooms || 0,
          minBathrooms: data.min_bathrooms || 0,
          minParkingSpaces: data.min_parking_spaces || 0,
          minArea: data.min_area || 0,
          hasPool: data.has_pool || false,
          isFurnished: data.is_furnished || false,
          hasElevator: data.has_elevator || false,
          petsAllowed: data.pets_allowed || false,
          hasGym: data.has_gym || false,
          hasBalcony: data.has_balcony || false,
          isActive: data.is_active,
        });
      } catch (error: any) {
        console.error('Error fetching demand:', error);
        toast({
          title: 'Erro ao carregar demanda',
          description: error.message,
          variant: 'destructive',
        });
        navigate('/demands');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchDemandDetails();
  }, [id, isEditing, form, navigate, toast]);

  const onSubmit = async (values: DemandFormValues) => {
    if (!user) {
      toast({
        title: 'Erro de autenticação',
        description: 'Você precisa estar logado para cadastrar uma demanda.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para inserção/atualização
      const demandData = {
        user_id: user.id,
        transaction_type: values.transactionType,
        property_types: values.propertyTypes,
        min_price: values.minPrice,
        max_price: values.maxPrice,
        cities: values.cities,
        neighborhoods: values.neighborhoods,
        states: values.states,
        min_bedrooms: values.minBedrooms,
        min_bathrooms: values.minBathrooms,
        min_parking_spaces: values.minParkingSpaces,
        min_area: values.minArea,
        has_pool: values.hasPool,
        is_furnished: values.isFurnished,
        has_elevator: values.hasElevator,
        pets_allowed: values.petsAllowed,
        has_gym: values.hasGym,
        has_balcony: values.hasBalcony,
        is_active: values.isActive,
      };

      let response;
      
      if (isEditing) {
        // Atualizar demanda existente
        response = await supabase
          .from('property_demands')
          .update(demandData)
          .eq('id', id);
      } else {
        // Criar nova demanda
        response = await supabase
          .from('property_demands')
          .insert([demandData]);
      }

      if (response.error) throw response.error;

      toast({
        title: isEditing ? 'Demanda atualizada' : 'Demanda cadastrada',
        description: isEditing 
          ? 'As informações da demanda foram atualizadas com sucesso.' 
          : 'A demanda foi cadastrada com sucesso.',
      });

      navigate('/demands');
    } catch (error: any) {
      console.error('Error saving demand:', error);
      toast({
        title: 'Erro ao salvar demanda',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Funções auxiliares para gerenciar arrays de valores
  const addCity = () => {
    if (cityInput.trim() === '') return;
    const currentCities = form.getValues('cities') || [];
    if (!currentCities.includes(cityInput.trim())) {
      form.setValue('cities', [...currentCities, cityInput.trim()]);
      setCityInput('');
    }
  };

  const removeCity = (city: string) => {
    const currentCities = form.getValues('cities') || [];
    form.setValue('cities', currentCities.filter(c => c !== city));
  };

  const addNeighborhood = () => {
    if (neighborhoodInput.trim() === '') return;
    const currentNeighborhoods = form.getValues('neighborhoods') || [];
    if (!currentNeighborhoods.includes(neighborhoodInput.trim())) {
      form.setValue('neighborhoods', [...currentNeighborhoods, neighborhoodInput.trim()]);
      setNeighborhoodInput('');
    }
  };

  const removeNeighborhood = (neighborhood: string) => {
    const currentNeighborhoods = form.getValues('neighborhoods') || [];
    form.setValue('neighborhoods', currentNeighborhoods.filter(n => n !== neighborhood));
  };

  const addState = () => {
    if (stateInput.trim() === '') return;
    const currentStates = form.getValues('states') || [];
    if (!currentStates.includes(stateInput.trim())) {
      form.setValue('states', [...currentStates, stateInput.trim()]);
      setStateInput('');
    }
  };

  const removeState = (state: string) => {
    const currentStates = form.getValues('states') || [];
    form.setValue('states', currentStates.filter(s => s !== state));
  };

  const togglePropertyType = (type: string) => {
    const currentTypes = form.getValues('propertyTypes');
    if (currentTypes.includes(type as any)) {
      form.setValue('propertyTypes', currentTypes.filter(t => t !== type));
    } else {
      form.setValue('propertyTypes', [...currentTypes, type as any]);
    }
  };

  const isPropertyTypeSelected = (type: string) => {
    return form.getValues('propertyTypes').includes(type as any);
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
          {isEditing ? 'Editar Demanda' : 'Cadastrar Nova Demanda'}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações básicas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Informações básicas</h2>
              <Separator />
              
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
                        <SelectItem value="sale">Compra</SelectItem>
                        <SelectItem value="rent">Aluguel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel>Tipos de Imóvel</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  <div 
                    className={`cursor-pointer border rounded-md p-2 flex items-center space-x-2 ${isPropertyTypeSelected('apartment') ? 'bg-primary/10 border-primary' : 'border-gray-300'}`}
                    onClick={() => togglePropertyType('apartment')}
                  >
                    <Checkbox checked={isPropertyTypeSelected('apartment')} />
                    <span>Apartamento</span>
                  </div>
                  <div 
                    className={`cursor-pointer border rounded-md p-2 flex items-center space-x-2 ${isPropertyTypeSelected('house') ? 'bg-primary/10 border-primary' : 'border-gray-300'}`}
                    onClick={() => togglePropertyType('house')}
                  >
                    <Checkbox checked={isPropertyTypeSelected('house')} />
                    <span>Casa</span>
                  </div>
                  <div 
                    className={`cursor-pointer border rounded-md p-2 flex items-center space-x-2 ${isPropertyTypeSelected('commercial') ? 'bg-primary/10 border-primary' : 'border-gray-300'}`}
                    onClick={() => togglePropertyType('commercial')}
                  >
                    <Checkbox checked={isPropertyTypeSelected('commercial')} />
                    <span>Comercial</span>
                  </div>
                  <div 
                    className={`cursor-pointer border rounded-md p-2 flex items-center space-x-2 ${isPropertyTypeSelected('land') ? 'bg-primary/10 border-primary' : 'border-gray-300'}`}
                    onClick={() => togglePropertyType('land')}
                  >
                    <Checkbox checked={isPropertyTypeSelected('land')} />
                    <span>Terreno</span>
                  </div>
                  <div 
                    className={`cursor-pointer border rounded-md p-2 flex items-center space-x-2 ${isPropertyTypeSelected('other') ? 'bg-primary/10 border-primary' : 'border-gray-300'}`}
                    onClick={() => togglePropertyType('other')}
                  >
                    <Checkbox checked={isPropertyTypeSelected('other')} />
                    <span>Outro</span>
                  </div>
                </div>
                {form.formState.errors.propertyTypes && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {form.formState.errors.propertyTypes.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="minPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Mínimo (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Máximo (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Localidades */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Localidades</h2>
              <Separator />
              
              <div>
                <FormLabel>Estados</FormLabel>
                <div className="flex mt-1">
                  <Input
                    value={stateInput}
                    onChange={(e) => setStateInput(e.target.value)}
                    placeholder="Digite um estado"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addState}
                    variant="secondary"
                    className="ml-2"
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch('states')?.map((state) => (
                    <span 
                      key={state} 
                      className="bg-primary/10 px-2 py-1 rounded-md text-sm flex items-center"
                    >
                      {state}
                      <button 
                        type="button" 
                        className="ml-1 text-gray-500 hover:text-destructive"
                        onClick={() => removeState(state)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {form.formState.errors.states && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {form.formState.errors.states.message}
                  </p>
                )}
              </div>

              <div>
                <FormLabel>Cidades</FormLabel>
                <div className="flex mt-1">
                  <Input
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="Digite uma cidade"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addCity}
                    variant="secondary"
                    className="ml-2"
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch('cities')?.map((city) => (
                    <span 
                      key={city} 
                      className="bg-primary/10 px-2 py-1 rounded-md text-sm flex items-center"
                    >
                      {city}
                      <button 
                        type="button" 
                        className="ml-1 text-gray-500 hover:text-destructive"
                        onClick={() => removeCity(city)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {form.formState.errors.cities && (
                  <p className="text-sm font-medium text-destructive mt-1">
                    {form.formState.errors.cities.message}
                  </p>
                )}
              </div>

              <div>
                <FormLabel>Bairros (opcional)</FormLabel>
                <div className="flex mt-1">
                  <Input
                    value={neighborhoodInput}
                    onChange={(e) => setNeighborhoodInput(e.target.value)}
                    placeholder="Digite um bairro"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    onClick={addNeighborhood}
                    variant="secondary"
                    className="ml-2"
                  >
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.watch('neighborhoods')?.map((neighborhood) => (
                    <span 
                      key={neighborhood} 
                      className="bg-primary/10 px-2 py-1 rounded-md text-sm flex items-center"
                    >
                      {neighborhood}
                      <button 
                        type="button" 
                        className="ml-1 text-gray-500 hover:text-destructive"
                        onClick={() => removeNeighborhood(neighborhood)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Características mínimas */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Características mínimas</h2>
              <Separator />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="minBedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quartos (mín.)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minBathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banheiros (mín.)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minParkingSpaces"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vagas (mín.)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área (m², mín.)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/demands')}
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
                ) : isEditing ? 'Atualizar Demanda' : 'Cadastrar Demanda'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
};

export default DemandForm;
