
import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { UserStats } from '@/components/profile/UserStats';
import { RecentActivities } from '@/components/profile/RecentActivities';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Save, Upload, Crown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserType } from '@/types/profile';
import { mockProfiles } from '@/lib/mockData';

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
      
      setTimeout(() => {
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
      <div className="container max-w-6xl space-y-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Meu Perfil</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Gerencie suas informações e acompanhe seu progresso
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                <CardDescription className="text-sm">
                  Gerencie seus dados de perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-20 w-20 md:h-24 md:w-24">
                        <AvatarImage src={avatarUrl || '/placeholder.svg'} alt="Avatar" />
                        <AvatarFallback className="text-lg md:text-2xl">{name ? name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-medium">{name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-sm break-all">{email || 'Não informado'}</p>
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
                      <div>
                        <p className="text-sm text-muted-foreground">Nome da Instituição</p>
                        <p className="font-medium">{schoolName || 'Não informado'}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <Avatar className="h-20 w-20 md:h-24 md:w-24">
                          <AvatarImage src={avatarUrl || '/placeholder.svg'} alt="Avatar" />
                          <AvatarFallback className="text-lg md:text-2xl">{name ? name.split(' ').map(n => n[0]).join('') : 'U'}</AvatarFallback>
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
                      <div className="space-y-2">
                        <Label htmlFor="schoolName">Nome da Instituição</Label>
                        <Input 
                          id="schoolName" 
                          value={schoolName} 
                          onChange={e => setSchoolName(e.target.value)} 
                        />
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-2">
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full"
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
                        className="w-full"
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

            {/* Plan Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Plano Atual
                </CardTitle>
                <CardDescription className="text-sm">
                  Seus limites e recursos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Plano Gratuito</p>
                      <Link to="/subscription">
                        <Button variant="link" className="p-0 h-auto text-xs">
                          Fazer upgrade
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Planos de aula</span>
                          <span>12/50</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: '24%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Atividades</span>
                          <span>8/30</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '27%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• 50 planos de aula por mês</p>
                    <p>• 30 atividades personalizadas</p>
                    <p>• Correção automática básica</p>
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

          {/* Stats and Activities */}
          <div className="lg:col-span-2 space-y-6">
            <UserStats />
            <RecentActivities />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
