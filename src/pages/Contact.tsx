
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, CheckCircle, Mail, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    position: '',
    subject: state?.subject || 'Plano Institucional',
    message: '',
    size: '',
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulating form submission
    setTimeout(() => {
      setSubmitted(true);
      toast({
        title: "Solicitação enviada",
        description: "Nossa equipe entrará em contato em breve.",
      });
    }, 1000);
  };
  
  if (submitted) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center bg-indigo-50">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Solicitação Enviada</CardTitle>
            <CardDescription>
              Obrigado pelo seu interesse! Nossa equipe entrará em contato em breve para discutir as possibilidades para sua instituição.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate('/')}>
              Voltar para o início
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 bg-indigo-50">
      <div className="container px-4 md:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tighter">Contato para Instituições</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Preencha o formulário abaixo para mais informações sobre nossa solução institucional
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Solicite uma demonstração</CardTitle>
                <CardDescription>
                  Nossa equipe entrará em contato para entender suas necessidades específicas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="Seu nome" 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        placeholder="seu.email@instituicao.edu.br" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="(00) 00000-0000" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input 
                        id="position" 
                        name="position" 
                        value={formData.position} 
                        onChange={handleChange} 
                        placeholder="Seu cargo na instituição" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution">Nome da Instituição</Label>
                    <Input 
                      id="institution" 
                      name="institution" 
                      value={formData.institution} 
                      onChange={handleChange} 
                      placeholder="Nome da sua escola ou instituição" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="size">Tamanho da instituição</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange('size', value)} 
                      defaultValue={formData.size}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequena">Pequena (até 200 alunos)</SelectItem>
                        <SelectItem value="media">Média (201-500 alunos)</SelectItem>
                        <SelectItem value="grande">Grande (501-1000 alunos)</SelectItem>
                        <SelectItem value="muito_grande">Muito grande (1000+ alunos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange('subject', value)} 
                      defaultValue={formData.subject}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma opção" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Plano Institucional">Plano Institucional</SelectItem>
                        <SelectItem value="Demonstração">Solicitar Demonstração</SelectItem>
                        <SelectItem value="Orçamento">Solicitar Orçamento</SelectItem>
                        <SelectItem value="Parceria">Proposta de Parceria</SelectItem>
                        <SelectItem value="Outro">Outro Assunto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      value={formData.message} 
                      onChange={handleChange} 
                      placeholder="Descreva as necessidades específicas da sua instituição..." 
                      rows={5} 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Enviar solicitação</Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Informações de contato</CardTitle>
                <CardDescription>
                  Entre em contato diretamente conosco
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Endereço:</h3>
                    <p className="text-sm text-muted-foreground">
                      Av. Paulista, 1000<br />
                      São Paulo, SP - 01310-000<br />
                      Brasil
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">E-mail:</h3>
                    <p className="text-sm text-muted-foreground">
                      <a href="mailto:instituicoes@profesz.com.br" className="hover:underline">
                        instituicoes@profesz.com.br
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Telefone:</h3>
                    <p className="text-sm text-muted-foreground">
                      <a href="tel:+551130010001" className="hover:underline">
                        +55 (11) 3001-0001
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
