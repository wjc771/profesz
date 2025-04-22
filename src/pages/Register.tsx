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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';

const educationLevels = [
  { label: 'Ensino Fundamental', value: 'fundamental' },
  { label: 'Ensino Médio', value: 'medio' },
  { label: 'Ensino Superior', value: 'superior' },
  { label: 'Técnico', value: 'tecnico' },
  { label: 'Concurso', value: 'concurso' },
];

const subjects = [
  'Matemática',
  'Português',
  'História',
  'Geografia',
  'Ciências',
  'Biologia',
  'Física',
  'Química',
  'Literatura',
  'Redação',
  'Inglês',
  'Educação Física'
];

const registerSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
    .regex(/^(?=.*[a-zA-Z])(?=.*[0-9])/, {
      message: 'Senha deve conter pelo menos uma letra e um número',
    }),
  type: z.enum(['professor', 'instituicao']).default('professor'),
  educationLevel: z.enum(['fundamental', 'medio', 'superior', 'tecnico', 'concurso'], {
    required_error: 'Selecione o nível de ensino',
  }),
  subjects: z.array(z.string()).min(1, { message: 'Selecione ao menos uma disciplina' }),
  manualSubject: z.string().optional(),
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
      educationLevel: undefined,
      subjects: [],
      manualSubject: '',
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
      await signUp(data.email, data.password, data.name, data.type);
      navigate('/onboarding', { state: { firstLogin: true, name: data.name } });
    } catch (err: any) {
      setError(err.message || 'Falha ao criar conta. Este email pode já estar em uso.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectChange = (subject: string) => {
    const current = form.getValues('subjects');
    if (current.includes(subject)) {
      form.setValue('subjects', current.filter(s => s !== subject));
    } else {
      form.setValue('subjects', [...current, subject]);
    }
    form.trigger('subjects');
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-10">
      <Card className="w-full max-w-md mx-auto" aria-label="Cadastro de usuário">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Crie sua conta</CardTitle>
          <CardDescription>
            Cadastre-se para usar o ProfeXpress
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
                  <FormItem>
                    <FormLabel>Você é:</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de usuário" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="professor">Professor(a)</SelectItem>
                        <SelectItem value="instituicao">Instituição de Ensino</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de ensino</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível de ensino" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {educationLevels.map(level => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subjects"
                render={() => (
                  <FormItem>
                    <FormLabel>Disciplinas</FormLabel>
                    <div className="grid gap-1 grid-cols-2 mb-1">
                      {subjects.map(subject => (
                        <label key={subject} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={form.getValues('subjects').includes(subject)}
                            onCheckedChange={() => handleSubjectChange(subject)}
                            aria-label={`Selecionar disciplina ${subject}`}
                          />
                          <span className="text-sm">{subject}</span>
                        </label>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manualSubject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outra disciplina (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite outra disciplina"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        e{' '}
                        <Link to="/privacy" className="text-primary hover:underline">
                          Política de Privacidade
                        </Link>
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
