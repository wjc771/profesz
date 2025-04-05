
import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { mockProperties } from '@/lib/mockData';
import PropertyCard from '@/components/property/PropertyCard';
import { Property } from '@/types/property';

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('João Silva');
  const [email, setEmail] = useState('joao.silva@example.com');
  const [phone, setPhone] = useState('(11) 98765-4321');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // In a real app, these would come from the authenticated user
  const userProperties = mockProperties.slice(0, 2);
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // This would be replaced with actual Supabase update
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível atualizar seu perfil. Tente novamente mais tarde.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectProperty = (property: Property) => {
    toast({
      title: 'Imóvel selecionado',
      description: `Você selecionou ${property.title}`,
    });
    // In the future, this would navigate to a property detail page
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Seu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações e visualize seus imóveis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Gerencie seus dados de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarUrl || '/placeholder.svg'} alt="Avatar" />
                        <AvatarFallback className="text-2xl">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{phone}</p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarUrl || '/placeholder.svg'} alt="Avatar" />
                        <AvatarFallback className="text-2xl">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? 'Salvando...' : 'Salvar'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
              {!isEditing && (
                <CardFooter>
                  <Button 
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="w-full"
                  >
                    Editar Perfil
                  </Button>
                </CardFooter>
              )}
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Plano de Assinatura</CardTitle>
                <CardDescription>
                  Seu plano atual e limites de uso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Plano Gratuito</p>
                      <Link to="/subscription">
                        <Button variant="link" className="p-0 h-auto">
                          Fazer upgrade
                        </Button>
                      </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      2 de 2 imóveis utilizados
                    </p>
                    <div className="w-full h-2 bg-muted rounded-full mt-2">
                      <div className="bg-primary h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>• 1 oferta e 1 demanda ativas</p>
                    <p>• Notificação básica de matches</p>
                    <p>• Filtros básicos</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/subscription" className="w-full">
                  <Button variant="default" className="w-full">
                    Ver Planos
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Seus Imóveis</CardTitle>
                <CardDescription>
                  Imóveis que você cadastrou na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active">
                  <TabsList className="mb-4">
                    <TabsTrigger value="active">Ativos</TabsTrigger>
                    <TabsTrigger value="inactive">Inativos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="active" className="focus-visible:outline-none focus-visible:ring-0">
                    {userProperties.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userProperties.map((property) => (
                          <PropertyCard 
                            key={property.id} 
                            property={property} 
                            onSelect={() => handleSelectProperty(property)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">
                          Você ainda não tem imóveis cadastrados.
                        </p>
                      </div>
                    )}
                    
                    <div className="mt-6">
                      <Link to="/add-property">
                        <Button className="w-full">
                          Adicionar Novo Imóvel
                        </Button>
                      </Link>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="inactive" className="focus-visible:outline-none focus-visible:ring-0">
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">
                        Você não tem imóveis inativos no momento.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
