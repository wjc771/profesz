
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Terms() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/register">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Cadastro
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Termos de Serviço</h1>
        <p className="text-muted-foreground">Última atualização: 14 de junho de 2025</p>
      </div>

      <div className="space-y-6">
        {/* Aviso Importante sobre Verificação */}
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-5 w-5" />
              Importante: Sobre as Ferramentas de Verificação
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700 dark:text-amber-300">
            <p className="mb-3">
              O ProfesZ oferece <strong>ferramentas de verificação e avaliação automatizada</strong> para auxiliar educadores no processo pedagógico. É fundamental entender que:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Nossas ferramentas realizam <strong>verificação</strong> e <strong>avaliação</strong>, não "correção definitiva"</li>
              <li>Os resultados são sugestões e análises baseadas em algoritmos e inteligência artificial</li>
              <li>A <strong>avaliação final e decisões pedagógicas sempre cabem ao professor</strong></li>
              <li>As ferramentas servem como apoio para otimizar o tempo e oferecer feedback estruturado</li>
              <li>Recomendamos sempre a revisão humana dos resultados gerados</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>1. Aceitação dos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Ao utilizar a plataforma ProfesZ, você concorda com estes Termos de Serviço e nossa Política de Privacidade. 
              Se não concordar com qualquer parte destes termos, não utilize nossos serviços.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Descrição dos Serviços</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>O ProfesZ é uma plataforma educacional que oferece:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ferramentas de planejamento pedagógico</li>
                <li>Central de atividades educacionais</li>
                <li>Verificação automatizada de respostas com gabarito</li>
                <li>Avaliação assistida por IA para redações e textos</li>
                <li>Recursos de comunicação educacional</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Responsabilidades do Usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Ao usar nossa plataforma, você se compromete a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fornecer informações verdadeiras e precisas</li>
                <li>Manter a confidencialidade de suas credenciais de acesso</li>
                <li>Usar a plataforma apenas para fins educacionais legítimos</li>
                <li>Respeitar os direitos de propriedade intelectual</li>
                <li>Não utilizar a plataforma para atividades ilegais ou prejudiciais</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Limitações de Responsabilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>
                O ProfesZ não se responsabiliza por decisões pedagógicas baseadas exclusivamente 
                nos resultados de nossas ferramentas de verificação. Os educadores devem sempre:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Exercer julgamento profissional independente</li>
                <li>Revisar e validar os resultados gerados pela plataforma</li>
                <li>Considerar o contexto específico de cada situação educacional</li>
                <li>Manter a responsabilidade final sobre avaliações e notas</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Propriedade Intelectual</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Todo o conteúdo criado pelos usuários permanece de sua propriedade. O ProfesZ possui 
              direitos sobre a plataforma, algoritmos e ferramentas desenvolvidas. É concedida 
              licença limitada para uso educacional dos recursos da plataforma.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Modificações dos Termos</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Reservamo-nos o direito de modificar estes termos a qualquer momento. 
              Usuários serão notificados sobre mudanças significativas e o uso continuado 
              da plataforma constitui aceitação dos novos termos.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Para dúvidas sobre estes termos, entre em contato através da nossa 
              <Link to="/contact" className="text-primary hover:underline ml-1">
                página de contato
              </Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
