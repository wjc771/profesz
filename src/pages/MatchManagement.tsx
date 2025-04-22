
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface MaterialMatch {
  id: string;
  materialId: string;
  teacherId: string;
  score: number;
  createdAt: string;
  viewed: boolean;
  contacted: boolean;
  material?: {
    id: string;
    title: string;
    type: string;
    category: string;
    gradeLevel: string;
    author: string;
    subject: string
  };
}

const MatchManagement = () => {
  const [matches, setMatches] = useState<MaterialMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Simulated data fetch with mock data
    const fetchMatches = async () => {
      setLoading(true);
      
      try {
        // Mock data instead of Supabase query
        const mockMatches: MaterialMatch[] = [
          {
            id: "m1",
            materialId: "material1",
            teacherId: "teacher1",
            score: 95,
            createdAt: new Date().toISOString(),
            viewed: false,
            contacted: false,
            material: {
              id: "material1",
              title: "Plano de Aula: Fundamentos de Matemática",
              type: "lesson_plan",
              category: "mathematics",
              gradeLevel: "fundamental",
              author: "Prof. Carlos Silva",
              subject: "Matemática"
            }
          },
          {
            id: "m2",
            materialId: "material2",
            teacherId: "teacher2",
            score: 78,
            createdAt: new Date().toISOString(),
            viewed: true,
            contacted: false,
            material: {
              id: "material2",
              title: "Atividade: Células e Tecidos",
              type: "activity",
              category: "biology",
              gradeLevel: "médio",
              author: "Profa. Ana Costa",
              subject: "Biologia"
            }
          }
        ];
        
        setMatches(mockMatches);
      } catch (error: any) {
        console.error('Error fetching matches:', error);
        toast({
          title: 'Erro ao carregar matches',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [toast]);

  const handleMarkAsViewed = async (id: string) => {
    try {
      // Simulated API call without Supabase
      // Update local state only for demonstration
      setMatches(matches.map(match => 
        match.id === id ? { ...match, viewed: true } : match
      ));
      
      toast({
        title: 'Match marcado como visualizado',
      });
    } catch (error: any) {
      console.error('Error updating match:', error);
      toast({
        title: 'Erro ao atualizar match',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleMarkAsContacted = async (id: string) => {
    try {
      // Simulated API call without Supabase
      // Update local state only for demonstration
      setMatches(matches.map(match => 
        match.id === id ? { ...match, contacted: true } : match
      ));
      
      toast({
        title: 'Match marcado como contatado',
      });
    } catch (error: any) {
      console.error('Error updating match:', error);
      toast({
        title: 'Erro ao atualizar match',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const handleDeleteMatch = async () => {
    if (!selectedMatchId) return;
    
    try {
      // Simulated delete without Supabase
      // Update local state only for demonstration
      setMatches(matches.filter(match => match.id !== selectedMatchId));
      
      toast({
        title: 'Match excluído',
        description: 'O match foi excluído com sucesso.'
      });
    } catch (error: any) {
      console.error('Error deleting match:', error);
      toast({
        title: 'Erro ao excluir match',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setConfirmDialogOpen(false);
      setSelectedMatchId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedMatchId(id);
    setConfirmDialogOpen(true);
  };

  const viewMaterialDetails = (materialId: string | undefined) => {
    if (materialId) {
      navigate(`/material/${materialId}`);
    } else {
      toast({
        title: 'Material não disponível',
        description: 'Os detalhes deste material não estão disponíveis.',
        variant: 'destructive'
      });
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciamento de Matches</h1>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : matches.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>
                      {match.material ? (
                        <div className="cursor-pointer hover:underline" onClick={() => viewMaterialDetails(match.materialId)}>
                          {match.material.title}
                        </div>
                      ) : (
                        <span className="text-gray-500">Material não disponível</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        match.score >= 80 ? 'bg-green-100 text-green-800' : 
                        match.score >= 50 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {match.score}%
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(match.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${match.viewed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {match.viewed ? 'Visualizado' : 'Não visualizado'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${match.contacted ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {match.contacted ? 'Contatado' : 'Não contatado'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {!match.viewed && (
                          <Button variant="outline" size="sm" onClick={() => handleMarkAsViewed(match.id)}>
                            Marcar como visto
                          </Button>
                        )}
                        {!match.contacted && (
                          <Button variant="outline" size="sm" onClick={() => handleMarkAsContacted(match.id)}>
                            Marcar como contatado
                          </Button>
                        )}
                        <Button variant="destructive" size="sm" onClick={() => confirmDelete(match.id)}>
                          Excluir
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Nenhum match encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Os matches são gerados automaticamente quando há correspondência entre materiais e perfis de professores.
            </p>
          </div>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja excluir este match? Esta ação não pode ser desfeita.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteMatch}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default MatchManagement;
