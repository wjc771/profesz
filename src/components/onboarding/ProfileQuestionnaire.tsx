
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserType } from '@/types/profile';

interface QuestionnaireData {
  subjects?: string[];
  gradeLevel?: string;
  institutionType?: string;
  experience?: string;
  goals?: string[];
  frequency?: string;
  childName?: string;
  childGrade?: string;
}

interface ProfileQuestionnaireProps {
  userType: UserType;
  data: QuestionnaireData;
  onDataChange: (data: QuestionnaireData) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ProfileQuestionnaire({ 
  userType, 
  data, 
  onDataChange, 
  onNext, 
  onBack 
}: ProfileQuestionnaireProps) {
  const subjects = [
    'Matemática', 'Português', 'Ciências', 'História', 'Geografia',
    'Biologia', 'Física', 'Química', 'Inglês', 'Educação Física', 'Arte'
  ];

  const goals = {
    professor: [
      'Criar planos de aula mais eficientes',
      'Gerar atividades personalizadas',
      'Automatizar correções',
      'Melhorar engajamento dos alunos',
      'Acompanhar progresso individual'
    ],
    instituicao: [
      'Padronizar materiais educacionais',
      'Gerar relatórios institucionais',
      'Otimizar gestão pedagógica',
      'Facilitar comunicação',
      'Acompanhar performance geral'
    ],
    aluno: [
      'Melhorar notas e desempenho',
      'Estudar de forma mais organizada',
      'Receber feedback personalizado',
      'Acessar materiais de qualidade',
      'Preparar para vestibulares'
    ],
    pais: [
      'Acompanhar progresso dos filhos',
      'Comunicar com professores',
      'Receber relatórios periódicos',
      'Apoiar estudos em casa',
      'Identificar dificuldades'
    ]
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    const currentSubjects = data.subjects || [];
    const newSubjects = checked 
      ? [...currentSubjects, subject]
      : currentSubjects.filter(s => s !== subject);
    
    onDataChange({ ...data, subjects: newSubjects });
  };

  const handleGoalChange = (goal: string, checked: boolean) => {
    const currentGoals = data.goals || [];
    const newGoals = checked 
      ? [...currentGoals, goal]
      : currentGoals.filter(g => g !== goal);
    
    onDataChange({ ...data, goals: newGoals });
  };

  const renderQuestionsByUserType = () => {
    switch (userType) {
      case 'professor':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-semibold mb-4 block">
                Quais disciplinas você leciona?
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map(subject => (
                  <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={data.subjects?.includes(subject) || false}
                      onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                    />
                    <span className="text-sm">{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="gradeLevel" className="text-base font-semibold">
                Nível de ensino principal
              </Label>
              <Select value={data.gradeLevel} onValueChange={(value) => onDataChange({ ...data, gradeLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o nível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="infantil">Educação Infantil</SelectItem>
                  <SelectItem value="fundamental1">Fundamental I (1º ao 5º ano)</SelectItem>
                  <SelectItem value="fundamental2">Fundamental II (6º ao 9º ano)</SelectItem>
                  <SelectItem value="medio">Ensino Médio</SelectItem>
                  <SelectItem value="superior">Ensino Superior</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">
                Experiência com tecnologia educacional
              </Label>
              <RadioGroup 
                value={data.experience} 
                onValueChange={(value) => onDataChange({ ...data, experience: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="iniciante" id="iniciante" />
                  <Label htmlFor="iniciante">Iniciante - Pouca experiência</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="intermediario" id="intermediario" />
                  <Label htmlFor="intermediario">Intermediário - Uso básico de ferramentas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="avancado" id="avancado" />
                  <Label htmlFor="avancado">Avançado - Confortável com tecnologia</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 'instituicao':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="institutionType" className="text-base font-semibold">
                Tipo de instituição
              </Label>
              <Select value={data.institutionType} onValueChange={(value) => onDataChange({ ...data, institutionType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publica">Escola Pública</SelectItem>
                  <SelectItem value="privada">Escola Privada</SelectItem>
                  <SelectItem value="tecnica">Escola Técnica</SelectItem>
                  <SelectItem value="universidade">Universidade</SelectItem>
                  <SelectItem value="curso">Curso/Instituto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gradeLevel" className="text-base font-semibold">
                Níveis de ensino oferecidos
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {[
                  { value: 'infantil', label: 'Educação Infantil' },
                  { value: 'fundamental1', label: 'Fundamental I' },
                  { value: 'fundamental2', label: 'Fundamental II' },
                  { value: 'medio', label: 'Ensino Médio' },
                  { value: 'superior', label: 'Ensino Superior' }
                ].map(level => (
                  <label key={level.value} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={data.subjects?.includes(level.value) || false}
                      onCheckedChange={(checked) => handleSubjectChange(level.value, checked as boolean)}
                    />
                    <span className="text-sm">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'aluno':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="gradeLevel" className="text-base font-semibold">
                Qual série você está cursando?
              </Label>
              <Input
                id="gradeLevel"
                placeholder="Ex: 2º ano do Ensino Médio"
                value={data.gradeLevel || ''}
                onChange={(e) => onDataChange({ ...data, gradeLevel: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-4 block">
                Em quais disciplinas você tem mais interesse ou dificuldade?
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {subjects.map(subject => (
                  <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={data.subjects?.includes(subject) || false}
                      onCheckedChange={(checked) => handleSubjectChange(subject, checked as boolean)}
                    />
                    <span className="text-sm">{subject}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pais':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="childName" className="text-base font-semibold">
                Nome do seu filho(a)
              </Label>
              <Input
                id="childName"
                placeholder="Nome do seu filho(a)"
                value={data.childName || ''}
                onChange={(e) => onDataChange({ ...data, childName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="childGrade" className="text-base font-semibold">
                Série que está cursando
              </Label>
              <Input
                id="childGrade"
                placeholder="Ex: 5º ano do Fundamental"
                value={data.childGrade || ''}
                onChange={(e) => onDataChange({ ...data, childGrade: e.target.value })}
              />
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">
                Com que frequência gostaria de receber relatórios?
              </Label>
              <RadioGroup 
                value={data.frequency} 
                onValueChange={(value) => onDataChange({ ...data, frequency: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="diario" id="diario" />
                  <Label htmlFor="diario">Diariamente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="semanal" id="semanal" />
                  <Label htmlFor="semanal">Semanalmente</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mensal" id="mensal" />
                  <Label htmlFor="mensal">Mensalmente</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Conte-nos mais sobre você</CardTitle>
          <CardDescription>
            Essas informações nos ajudam a personalizar sua experiência na plataforma
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {renderQuestionsByUserType()}

          <div>
            <Label className="text-base font-semibold mb-4 block">
              Quais são seus principais objetivos?
            </Label>
            <div className="space-y-3">
              {goals[userType]?.map(goal => (
                <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={data.goals?.includes(goal) || false}
                    onCheckedChange={(checked) => handleGoalChange(goal, checked as boolean)}
                  />
                  <span className="text-sm">{goal}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <Button variant="outline" onClick={onBack} className="flex-1">
              Voltar
            </Button>
            <Button onClick={onNext} className="flex-1">
              Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
