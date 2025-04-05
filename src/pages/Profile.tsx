import { useState, useEffect } from 'react';
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
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ExtendedProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  type: string;
  avatar_url: string | null;
  updated_at: string;
  created_at: string;
  creci?: string;
  agency_name?: string;
}

const Profile = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('buyer');
  const [creci, setCreci] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const userProperties = mockProperties.slice(0, 2);
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        const profileData = data as ExtendedProfile;
        setName(profileData.name || '');
        setEmail(profileData.email || '');
        setPhone(profileData.phone || '');
        setType(profileData.type || 'buyer');
        setAvatarUrl(profileData.avatar_url || '');
        setCreci(profileData.creci || '');
        setAgencyName(profileData.agency_name || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar perfil',
        description: 'Não foi possível carregar os dados do seu perfil.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!user) return;
      
      const updates = {
        id: user.id,
        name,
        phone,
        type,
        creci,
        agency_name: agencyName,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
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

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você precisa selecionar uma imagem para upload.');
      }
      
      if (!user) throw new Error('Usuário não autenticado');
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      setAvatarUrl(data.publicUrl);
      
      toast({
        title: 'Avatar atualizado',
        description: 'Sua foto de perfil foi atualizada com sucesso.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no upload',
        description: error.message || 'Não foi possível atualizar sua foto de perfil.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSelectProperty = (property: Property) => {
    toast({
      title: 'Imóvel selecionado',
      description: `Você selecionou ${property.title}`,
    });
  };

  const SubscriptionOverview = () => {
    return (
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
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container max-w-6xl flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

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
                        <AvatarFallback className="text-2xl">{name ? name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{email || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{phone || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipo de usuário</p>
                      <p className="font-medium capitalize">{type || 'Comprador'}</p>
                    </div>
                    {type === 'agent' && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">CRECI</p>
                          <p className="font-medium">{creci || 'Não informado'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Imobiliária</p>
                          <p className="font-medium">{agencyName || 'Não informado'}</p>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={avatarUrl || '/placeholder.svg'} alt="Avatar" />
                          <AvatarFallback className="text-2xl">{name ? name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2">
                          <label htmlFor="avatar-upload" className="cursor-pointer">
                            <div className="rounded-full bg-primary p-1 hover:bg-primary/90 transition-colors">
                              {uploading ? 
                                <Loader2 className="h-4 w-4 text-white animate-spin" /> : 
                                <Upload className="h-4 w-4 text-white" />
                              }
                            </div>
                            <input 
                              id="avatar-upload" 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={uploadAvatar}
                              disabled={uploading}
                            />
                          </label>
                        </div>
                      </div>
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
                        disabled 
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">O email não pode ser alterado.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo de usuário</Label>
                      <Select value={type} onValueChange={setType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buyer">Comprador</SelectItem>
                          <SelectItem value="owner">Proprietário</SelectItem>
                          <SelectItem value="agent">Corretor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {type === 'agent' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="creci">CRECI</Label>
                          <Input 
                            id="creci" 
                            value={creci} 
                            onChange={e => setCreci(e.target.value)} 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="agencyName">Nome da Imobiliária</Label>
                          <Input 
                            id="agencyName" 
                            value={agencyName} 
                            onChange={e => setAgencyName(e.target.value)} 
                          />
                        </div>
                      </>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar
                          </>
                        )}
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
                <SubscriptionOverview />
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
