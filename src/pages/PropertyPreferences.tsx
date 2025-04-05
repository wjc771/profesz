
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { PropertyType, TransactionType } from '@/types/property';
import { Building, Home, Warehouse, MapPin, DollarSign, Bed, Bath, Car } from 'lucide-react';

const propertyPreferencesSchema = z.object({
  transactionType: z.enum(['rent', 'sale'] as const),
  propertyTypes: z.array(z.enum(['apartment', 'house', 'commercial', 'land', 'other'] as const)).min(1, {
    message: "Selecione pelo menos um tipo de imóvel",
  }),
  minPrice: z.string().min(1, {
    message: "Preço mínimo é obrigatório",
  }),
  maxPrice: z.string().min(1, {
    message: "Preço máximo é obrigatório",
  }),
  minBedrooms: z.string().optional(),
  minBathrooms: z.string().optional(),
  minArea: z.string().optional(),
  locations: z.array(z.string()).min(1, {
    message: "Adicione pelo menos uma localização",
  }),
  additionalRequirements: z.string().optional(),
});

type PropertyPreferencesValues = z.infer<typeof propertyPreferencesSchema>;

const PropertyPreferences = () => {
  const { toast } = useToast();
  const [newLocation, setNewLocation] = useState('');
  const [locations, setLocations] = useState<string[]>([]);

  const defaultValues: Partial<PropertyPreferencesValues> = {
    transactionType: 'rent',
    propertyTypes: ['apartment'],
    minPrice: '',
    maxPrice: '',
    minBedrooms: '',
    minBathrooms: '',
    minArea: '',
    locations: [],
    additionalRequirements: '',
  };

  const form = useForm<PropertyPreferencesValues>({
    resolver: zodResolver(propertyPreferencesSchema),
    defaultValues,
  });

  const onSubmit = (data: PropertyPreferencesValues) => {
    console.log("Form data submitted:", data);
    
    toast({
      title: "Preferências salvas",
      description: "Suas preferências de busca foram salvas com sucesso.",
    });
  };

  const handleAddLocation = () => {
    if (newLocation.trim() !== '') {
      const updatedLocations = [...locations, newLocation.trim()];
      setLocations(updatedLocations);
      form.setValue('locations', updatedLocations);
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (index: number) => {
    const updatedLocations = locations.filter((_, i) => i !== index);
    setLocations(updatedLocations);
    form.setValue('locations', updatedLocations);
  };

  const propertyTypeOptions = [
    { value: 'apartment', label: 'Apartamento', icon: Building },
    { value: 'house', label: 'Casa', icon: Home },
    { value: 'commercial', label: 'Comercial', icon: Warehouse },
    { value: 'land', label: 'Terreno', icon: MapPin },
    { value: 'other', label: 'Outros', icon: Building },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Preferências de Busca</h1>
          <p className="text-muted-foreground">
            Configure suas preferências para receber recomendações de imóveis.
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Transação</CardTitle>
                <CardDescription>Você está procurando para alugar ou comprar?</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="transactionType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <Button
                            type="button"
                            variant={field.value === 'rent' ? 'default' : 'outline'}
                            className="flex items-center gap-2 h-20 flex-1 justify-start px-4"
                            onClick={() => field.onChange('rent')}
                          >
                            <DollarSign className="h-5 w-5" />
                            <div className="text-left">
                              <div className="font-medium">Alugar</div>
                              <div className="text-xs text-muted-foreground">Quero alugar um imóvel</div>
                            </div>
                          </Button>
                          <Button
                            type="button"
                            variant={field.value === 'sale' ? 'default' : 'outline'}
                            className="flex items-center gap-2 h-20 flex-1 justify-start px-4"
                            onClick={() => field.onChange('sale')}
                          >
                            <Home className="h-5 w-5" />
                            <div className="text-left">
                              <div className="font-medium">Comprar</div>
                              <div className="text-xs text-muted-foreground">Quero comprar um imóvel</div>
                            </div>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Imóveis</CardTitle>
                <CardDescription>Selecione os tipos de imóveis que você está procurando</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="propertyTypes"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {propertyTypeOptions.map((option) => (
                          <FormField
                            key={option.value}
                            control={form.control}
                            name="propertyTypes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={option.value}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(option.value as PropertyType)}
                                      onCheckedChange={(checked) => {
                                        const current = field.value || [];
                                        return checked
                                          ? field.onChange([...current, option.value as PropertyType])
                                          : field.onChange(
                                              current.filter((value) => value !== option.value)
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal flex items-center gap-2">
                                    <option.icon className="h-4 w-4" />
                                    {option.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Faixa de Preço</CardTitle>
                <CardDescription>Defina sua faixa de preço</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="minPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preço Mínimo (R$)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 1000" {...field} />
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
                          <Input placeholder="Ex: 5000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Características</CardTitle>
                <CardDescription>Defina as características mínimas do imóvel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="minBedrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Bed className="h-4 w-4" />
                          Quartos (mín.)
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}+</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="minBathrooms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Bath className="h-4 w-4" />
                          Banheiros (mín.)
                        </FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num}+</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="minArea"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Área mínima (m²)</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 60" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Localização</CardTitle>
                <CardDescription>Adicione as localizações de interesse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <FormLabel htmlFor="location-input">Bairro, Cidade ou Estado</FormLabel>
                      <Input
                        id="location-input"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Ex: Centro, São Paulo"
                      />
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleAddLocation}
                      variant="outline"
                    >
                      Adicionar
                    </Button>
                  </div>
                  
                  {locations.length > 0 && (
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-2">Localizações selecionadas:</h4>
                      <div className="flex flex-wrap gap-2">
                        {locations.map((location, index) => (
                          <div key={index} className="flex items-center bg-muted rounded-md px-3 py-1 text-sm">
                            <MapPin className="h-3 w-3 mr-1" />
                            {location}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-2"
                              onClick={() => handleRemoveLocation(index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {form.formState.errors.locations && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.locations.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Requisitos Adicionais</CardTitle>
                <CardDescription>Descreva outros requisitos importantes (opcional)</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="additionalRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Precisa ter estacionamento, permitir pets, ter área de lazer, etc."
                          {...field}
                          className="min-h-[120px]"
                        />
                      </FormControl>
                      <FormDescription>
                        Adicione quaisquer detalhes específicos que são importantes para você.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Button type="submit" className="w-full">Salvar Preferências</Button>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
};

export default PropertyPreferences;
