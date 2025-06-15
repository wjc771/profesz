import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/hooks/useAuth';

const registerSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
      message: 'Senha deve conter pelo menos uma letra e um número',
    }),
  type: z.enum(['professor', 'aluno', 'pais']).default('professor'),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'Você precisa aceitar os termos e condições',
  }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      type: 'professor',
      acceptTerms: false,
    },
  });

  useEffect(() => {
    const emailFromLanding = location.state?.email;
    if (emailFromLanding) {
      form.setValue('email', emailFromLanding);
    }
  }, [location.state, form]);

  const handleSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Register: Starting signup process...', {
        email: data.email,
        name: data.name,
        type: data.type
      });

      await signUp(data.email, data.password, data.name, data.type);
      
      console.log('Register: Signup successful, redirecting to verification');
      
      // Redirecionar para verificação após cadastro bem-sucedido
      navigate('/verification-pending', { 
        state: { 
          email: data.email,
          name: data.name,
          userType: data.type 
        } 
      });
    } catch (err: any) {
      console.error('Register: Signup failed:', err);
      setError(err.message || 'Falha ao criar conta. Este email pode já estar em uso.');
    } finally {
      setIsLoading(false);
    }
  };

  const userTypeOptions = [
    {
      value: 'professor',
      label: 'Professor(a)',
      description: 'Crie materiais educacionais e use ferramentas de verificação pedagógica'
    },
    {
      value: 'aluno',
      label: 'Aluno(a)',
      description: 'Acesse atividades e acompanhe seu progresso educacional'
    },
    {
      value: 'pais',
      label: 'Pais/Responsável',
      description: 'Acompanhe o desenvolvimento educacional dos seus filhos'
    }
  ];

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-lg mx-auto" aria-label="Cadastro de usuário">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Crie sua conta</CardTitle>
          <CardDescription>
            Cadastre-se para usar o ProfesZ. Suas preferências serão configuradas na próxima etapa.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4" role="alert">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Seu nome"
                        autoComplete="name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu@email.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Mínimo 8 caracteres, incluindo letras e números
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Você é:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        {userTypeOptions.map((option) => (
                          <FormItem key={option.value} className="flex items-start space-x-3 space-y-0 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value={option.value} className="mt-1" />
                            </FormControl>
                            <div className="flex-1">
                              <FormLabel className="font-medium cursor-pointer">
                                {option.label}
                              </FormLabel>
                              <p className="text-sm text-muted-foreground">
                                {option.description}
                              </p>
                            </div>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Aviso educacional sobre verificação */}
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2 text-sm">
                  ⚠️ Sobre nossas ferramentas de verificação
                </h3>
                <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">
                  O ProfesZ oferece ferramentas de <strong>verificação</strong> e <strong>avaliação assistida</strong>, 
                  não correção definitiva. A avaliação final e decisões pedagógicas sempre cabem ao educador.
                </p>
              </div>

              {/* Aviso para Instituições */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Você representa uma instituição de ensino?
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Temos planos especiais para escolas e universidades com recursos exclusivos e suporte dedicado.
                </p>
                <Link to="/contact" state={{ subject: 'Plano Institucional' }}>
                  <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/40">
                    Falar com nossa equipe comercial
                  </Button>
                </Link>
              </div>

              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                        aria-label="Aceitar termos"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm text-muted-foreground font-normal">
                        Eu concordo com os{' '}
                        <Link to="/terms" className="text-primary hover:underline">
                          Termos de Serviço
                        </Link>{' '}
                        (incluindo ciência de que oferecemos verificação, não correção definitiva) e{' '}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Política de Privacidade
                        </Link>{' '}
                        (conformidade LGPD)
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading} aria-busy={isLoading}>
                {isLoading ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </form>
          </Form>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>
          
          <Button variant="outline" className="w-full" disabled={isLoading}>
            <Mail className="mr-2 h-4 w-4" />
            Google
          </Button>
        </CardContent>
        
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Já possui cadastro?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
