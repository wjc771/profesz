
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import UserProperties from '@/components/dashboard/UserProperties';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Save, Upload } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserType } from '@/types/profile';
import { mockProfiles } from '@/lib/mockData';

// Estendendo o tipo do perfil para incluir os campos adicionais
interface ExtendedProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  type: UserType;
  avatarUrl: string | null;
  updatedAt: string;
  createdAt: string;
  schoolName?: string | null;
}

const ProfilePage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState<UserType>('professor');
  const [schoolName, setSchoolName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      if (!user) return;
      
      // Use the mock data instead of Supabase query
      const mockProfile = mockProfiles.find(p => p.id === user.id);
      const userMetadata = user.user_metadata || {};
      
      if (mockProfile) {
        setName(mockProfile.name || '');
        setEmail(mockProfile.email || '');
        setPhone(mockProfile.phone || '');
        setType(mockProfile.type);
        setAvatarUrl(mockProfile.avatarUrl || '');
        setSchoolName(mockProfile.schoolName || '');
      } else {
        // Fallback to user metadata if available
        setName(userMetadata.name || '');
        setEmail(user.email || '');
        setType((userMetadata.type as UserType) || 'professor');
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
      
      // Just simulate a save operation, would normally update Supabase
      setTimeout(() => {
        toast({
          title: 'Perfil atualizado',
          description: 'Suas informações foram atualizadas com sucesso.',
        });
        
        setIsEditing(false);
      }, 1000);
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
      
      // Simulate file upload - would normally upload to Supabase Storage
      setTimeout(() => {
        // Create a local object URL just for demonstration
        const objectUrl = URL.createObjectURL(event.target.files![0]);
        setAvatarUrl(objectUrl);
        
        toast({
          title: 'Avatar atualizado',
          description: 'Sua foto de perfil foi atualizada com sucesso.',
        });
        setUploading(false);
      }, 1500);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no upload',
        description: error.message || 'Não foi possível atualizar sua foto de perfil.',
      });
      setUploading(false);
    }
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
            Gerencie suas informações e visualize seus materiais
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
                      <p className="font-medium capitalize">
                        {type === 'professor' ? 'Professor(a)' : type === 'instituicao' ? 'Instituição de Ensino' : ''}
                      </p>
                    </div>
                    {type === 'instituicao' && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">Nome da Instituição</p>
                          <p className="font-medium">{schoolName || 'Não informado'}</p>
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
                      <Select value={type} onValueChange={value => setType(value as UserType)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="professor">Professor(a)</SelectItem>
                          <SelectItem value="instituicao">Instituição de Ensino</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {type === 'instituicao' && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="schoolName">Nome da Instituição</Label>
                          <Input 
                            id="schoolName" 
                            value={schoolName} 
                            onChange={e => setSchoolName(e.target.value)} 
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
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Plano Inicial</p>
                      <Link to="/subscription">
                        <Button variant="link" className="p-0 h-auto">
                          Fazer upgrade
                        </Button>
                      </Link>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      2 de 5 materiais utilizados
                    </p>
                    <div className="w-full h-2 bg-muted rounded-full mt-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>• 5 materiais por mês</p>
                    <p>• Acesso básico aos recursos</p>
                    <p>• Compartilhamento limitado</p>
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
            <UserProperties />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
