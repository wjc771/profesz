
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Users, FileText, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Privacy() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to="/register">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Cadastro
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Política de Privacidade</h1>
        <p className="text-muted-foreground">
          Última atualização: 14 de junho de 2025 | Em conformidade com a LGPD (Lei 13.709/2018)
        </p>
      </div>

      <div className="space-y-6">
        {/* Resumo LGPD */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
              <Shield className="h-5 w-5" />
              Seus Direitos pela LGPD
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700 dark:text-blue-300">
            <p className="mb-3">
              Você tem direito ao acesso, correção, portabilidade, eliminação dos seus dados, 
              revogação do consentimento e informação sobre compartilhamento.
            </p>
            <p>
              <strong>Controlador:</strong> ProfesZ Tecnologia Educacional<br />
              <strong>Contato DPO:</strong> dpo@profesz.com
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              1. Informações que Coletamos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h4 className="font-semibold">Dados fornecidos diretamente:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Nome completo e endereço de e-mail</li>
                <li>Tipo de usuário (professor, aluno, responsável)</li>
                <li>Conteúdo educacional criado (planos de aula, atividades, redações)</li>
                <li>Preferências e configurações da conta</li>
              </ul>
              
              <h4 className="font-semibold">Dados coletados automaticamente:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Informações de uso da plataforma</li>
                <li>Dados de navegação e interação</li>
                <li>Informações técnicas do dispositivo (IP, navegador)</li>
                <li>Logs de acesso e segurança</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              2. Base Legal e Finalidades (LGPD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold">Execução de contrato (Art. 7°, V):</h4>
                <p className="text-sm text-muted-foreground">
                  Prestação dos serviços educacionais, processamento de verificações e avaliações
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Legítimo interesse (Art. 7°, IX):</h4>
                <p className="text-sm text-muted-foreground">
                  Melhoria da plataforma, segurança, prevenção de fraudes
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold">Consentimento (Art. 7°, I):</h4>
                <p className="text-sm text-muted-foreground">
                  Marketing educacional, comunicações promocionais (quando aplicável)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Como Usamos suas Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              <li>Fornecer e manter os serviços da plataforma educacional</li>
              <li>Processar verificações automáticas e avaliações assistidas por IA</li>
              <li>Personalizar a experiência educacional do usuário</li>
              <li>Comunicar atualizações importantes sobre os serviços</li>
              <li>Garantir a segurança e integridade da plataforma</li>
              <li>Cumprir obrigações legais e regulamentares</li>
              <li>Melhorar continuamente nossos algoritmos e ferramentas</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Compartilhamento de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Não vendemos seus dados pessoais. Podemos compartilhar informações apenas:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Com provedores de serviços necessários para operação da plataforma</li>
                <li>Quando exigido por lei ou autoridades competentes</li>
                <li>Para proteger nossos direitos legais ou segurança dos usuários</li>
                <li>Com seu consentimento explícito para finalidades específicas</li>
              </ul>
              
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Transferência Internacional:</strong> Alguns dados podem ser processados 
                  em servidores localizados fora do Brasil, sempre com garantias adequadas de proteção 
                  conforme LGPD.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Retenção de Dados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p>Mantemos seus dados pelo tempo necessário para:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Contas ativas: Durante o período de uso da plataforma</li>
                <li>Contas inativas: Até 2 anos após o último acesso</li>
                <li>Dados de verificação/avaliação: Conforme necessidade pedagógica</li>
                <li>Logs de segurança: Até 6 meses</li>
                <li>Obrigações legais: Conforme exigido por lei</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              6. Seus Direitos (LGPD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Você tem os seguintes direitos sobre seus dados pessoais:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Acesso</h4>
                  <p className="text-sm text-muted-foreground">Consultar quais dados temos sobre você</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Correção</h4>
                  <p className="text-sm text-muted-foreground">Atualizar dados incompletos ou incorretos</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Eliminação</h4>
                  <p className="text-sm text-muted-foreground">Solicitar exclusão de dados desnecessários</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Portabilidade</h4>
                  <p className="text-sm text-muted-foreground">Receber seus dados em formato estruturado</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Revogação</h4>
                  <p className="text-sm text-muted-foreground">Retirar consentimento a qualquer momento</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Informação</h4>
                  <p className="text-sm text-muted-foreground">Saber com quem compartilhamos seus dados</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <p className="text-sm">
                  <strong>Como exercer seus direitos:</strong> Entre em contato através da nossa 
                  <Link to="/contact" className="text-primary hover:underline ml-1">
                    página de contato
                  </Link> ou envie um e-mail para dpo@profesz.com
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Segurança</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Implementamos medidas técnicas e organizacionais apropriadas para proteger 
              seus dados contra acesso não autorizado, alteração, divulgação ou destruição, 
              incluindo criptografia, controles de acesso e monitoramento contínuo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Alterações nesta Política</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Podemos atualizar esta política periodicamente. Mudanças significativas serão 
              comunicadas por e-mail ou através de aviso na plataforma com 30 dias de antecedência.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Controlador:</strong> ProfesZ Tecnologia Educacional</p>
              <p><strong>DPO (Encarregado):</strong> dpo@profesz.com</p>
              <p><strong>Suporte Geral:</strong> 
                <Link to="/contact" className="text-primary hover:underline ml-1">
                  Página de contato
                </Link>
              </p>
              <p><strong>ANPD:</strong> Para reclamações, acesse anpd.gov.br</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
