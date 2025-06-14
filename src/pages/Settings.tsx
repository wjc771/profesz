import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Bell, Moon, Sun, Globe, Shield, Download, Trash2, BookOpen, GraduationCap } from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  
  // Notificações Educacionais
  const [notifPlanosAula, setNotifPlanosAula] = useState(true);
  const [notifAtividades, setNotifAtividades] = useState(true);
  const [notifCorrecoes, setNotifCorrecoes] = useState(true);
  const [notifLembretes, setNotifLembretes] = useState(false);
  
  // Preferências de Ensino
  const [disciplinaPreferida, setDisciplinaPreferida] = useState('matematica');
  const [nivelEnsino, setNivelEnsino] = useState('fundamental');
  const [compartilharMateriais, setCompartilharMateriais] = useState(false);
  const [backupAutomatico, setBackupAutomatico] = useState(true);

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    toast({
      title: "Tema alterado",
      description: `Modo ${newDarkMode ? 'escuro' : 'claro'} ativado.`
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram salvas."
    });
  };

  const handleSaveTeaching = () => {
    toast({
      title: "Preferências salvas",
      description: "Suas preferências de ensino foram atualizadas."
    });
  };

  const handleExportData = () => {
    toast({
      title: "Exportação iniciada",
      description: "Seus dados serão enviados por email em breve."
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="container max-w-4xl px-4 md:px-6 lg:px-8 py-8 space-y-6">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Personalize sua experiência na plataforma
          </p>
        </div>

        <Tabs defaultValue="appearance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="appearance" className="text-xs md:text-sm">
              <Sun className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Aparência</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs md:text-sm">
              <Bell className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="teaching" className="text-xs md:text-sm">
              <GraduationCap className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Ensino</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="text-xs md:text-sm">
              <Shield className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Privacidade</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Tema
                </CardTitle>
                <CardDescription>
                  Personalize a aparência da ProfesZ
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Modo Escuro</Label>
                    <p className="text-sm text-muted-foreground">
                      Ative o modo escuro para reduzir o cansaço visual
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={handleDarkModeToggle}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Idioma e Região
                </CardTitle>
                <CardDescription>
                  Configure suas preferências regionais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Português (Brasil)</Badge>
                    <span className="text-sm text-muted-foreground">- Padrão</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificações Educacionais
                </CardTitle>
                <CardDescription>
                  Configure como deseja ser notificado sobre suas atividades
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notif-planos">Planos de Aula</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre criação e aprovação de planos
                    </p>
                  </div>
                  <Switch
                    id="notif-planos"
                    checked={notifPlanosAula}
                    onCheckedChange={setNotifPlanosAula}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notif-atividades">Atividades e Exercícios</Label>
                    <p className="text-sm text-muted-foreground">
                      Notificações sobre geração de atividades
                    </p>
                  </div>
                  <Switch
                    id="notif-atividades"
                    checked={notifAtividades}
                    onCheckedChange={setNotifAtividades}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notif-correcoes">Correções Automáticas</Label>
                    <p className="text-sm text-muted-foreground">
                      Resultados de correções e feedback
                    </p>
                  </div>
                  <Switch
                    id="notif-correcoes"
                    checked={notifCorrecoes}
                    onCheckedChange={setNotifCorrecoes}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notif-lembretes">Lembretes de Aulas</Label>
                    <p className="text-sm text-muted-foreground">
                      Lembrar sobre próximas aulas e compromissos
                    </p>
                  </div>
                  <Switch
                    id="notif-lembretes"
                    checked={notifLembretes}
                    onCheckedChange={setNotifLembretes}
                  />
                </div>

                <Button onClick={handleSaveNotifications} className="w-full mt-4">
                  Salvar Preferências de Notificação
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teaching" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Preferências de Ensino
                </CardTitle>
                <CardDescription>
                  Configure suas preferências para personalizar a experiência
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="disciplina">Disciplina Principal</Label>
                  <Select value={disciplinaPreferida} onValueChange={setDisciplinaPreferida}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione sua disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matematica">Matemática</SelectItem>
                      <SelectItem value="portugues">Português</SelectItem>
                      <SelectItem value="ciencias">Ciências</SelectItem>
                      <SelectItem value="historia">História</SelectItem>
                      <SelectItem value="geografia">Geografia</SelectItem>
                      <SelectItem value="arte">Arte</SelectItem>
                      <SelectItem value="educacao-fisica">Educação Física</SelectItem>
                      <SelectItem value="ingles">Inglês</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nivel">Nível de Ensino</Label>
                  <Select value={nivelEnsino} onValueChange={setNivelEnsino}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o nível" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infantil">Educação Infantil</SelectItem>
                      <SelectItem value="fundamental">Ensino Fundamental</SelectItem>
                      <SelectItem value="medio">Ensino Médio</SelectItem>
                      <SelectItem value="superior">Ensino Superior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="compartilhar">Compartilhar Materiais</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que outros professores vejam seus materiais públicos
                    </p>
                  </div>
                  <Switch
                    id="compartilhar"
                    checked={compartilharMateriais}
                    onCheckedChange={setCompartilharMateriais}
                  />
                </div>

                <Button onClick={handleSaveTeaching} className="w-full mt-4">
                  Salvar Preferências de Ensino
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacidade e Dados
                </CardTitle>
                <CardDescription>
                  Gerencie seus dados e configurações de privacidade
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="backup">Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Salvar automaticamente seus materiais na nuvem
                    </p>
                  </div>
                  <Switch
                    id="backup"
                    checked={backupAutomatico}
                    onCheckedChange={setBackupAutomatico}
                  />
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2">
                      <Download className="h-4 w-4" />
                      Exportar Dados
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Baixe uma cópia de todos os seus planos de aula e atividades
                    </p>
                    <Button variant="outline" onClick={handleExportData} className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Solicitar Exportação
                    </Button>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-2 text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Excluir Conta
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Isso removerá permanentemente sua conta e todos os dados associados
                    </p>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir Conta
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
