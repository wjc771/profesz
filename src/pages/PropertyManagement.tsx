
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/format';
import { useAuth } from '@/hooks/useAuth';
import { mockProfiles } from '@/lib/mockData';

// Updated interface for educational materials
interface EducationalMaterial {
  id: string;
  title: string;
  description: string;
  type: string;
  subject: string;
  gradeLevel: string;
  price: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isPremium: boolean;
}

const PropertyManagement = () => {
  const [materials, setMaterials] = useState<EducationalMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Mock data fetch
    const fetchMaterials = async () => {
      setLoading(true);
      
      try {
        // Mock educational materials data
        const mockMaterials: EducationalMaterial[] = [
          {
            id: "material1",
            title: "Plano de Aula: Matemática Fundamental",
            description: "Um plano de aula completo para ensino de conceitos básicos de matemática",
            type: "plano_aula",
            subject: "Matemática",
            gradeLevel: "Fundamental",
            price: 39.90,
            authorId: "p1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
            isPremium: true
          },
          {
            id: "material2",
            title: "Atividade: Células e Tecidos",
            description: "Atividade completa sobre células e tecidos para ensino médio",
            type: "atividade",
            subject: "Biologia",
            gradeLevel: "Médio",
            price: 29.90,
            authorId: "p2",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
            isPremium: false
          }
        ];
        
        setMaterials(mockMaterials);
      } catch (error: any) {
        console.error('Error fetching materials:', error);
        toast({
          title: 'Erro ao carregar materiais',
          description: error.message,
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    // Get user profile to check type
    const getUserProfile = async () => {
      if (!user) return;
      
      try {
        // Use mock data instead of Supabase query
        const mockProfile = mockProfiles.find(profile => profile.id === user.id);
        
        if (!mockProfile) {
          toast({
            title: 'Perfil não encontrado',
            description: 'Perfil de usuário não encontrado',
            variant: 'destructive'
          });
          navigate('/dashboard');
        }
      } catch (error: any) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (user) {
      getUserProfile();
      fetchMaterials();
    }
  }, [user, navigate, toast]);

  const handleCreateMaterial = () => {
    navigate('/material/new');
  };

  const handleEditMaterial = (id: string) => {
    navigate(`/material/edit/${id}`);
  };

  const handleDeleteMaterial = async () => {
    if (!selectedMaterialId) return;
    
    try {
      // Simulated delete operation without Supabase
      setMaterials(materials.filter(material => material.id !== selectedMaterialId));
      
      toast({
        title: 'Material excluído',
        description: 'O material foi excluído com sucesso.'
      });
    } catch (error: any) {
      console.error('Error deleting material:', error);
      toast({
        title: 'Erro ao excluir material',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setConfirmDialogOpen(false);
      setSelectedMaterialId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedMaterialId(id);
    setConfirmDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciamento de Materiais</h1>
          <Button onClick={handleCreateMaterial}>Adicionar Material</Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : materials.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.title}</TableCell>
                    <TableCell>
                      {material.type === 'plano_aula' ? 'Plano de Aula' : 
                       material.type === 'atividade' ? 'Atividade' : 
                       material.type === 'material_apoio' ? 'Material de Apoio' : 
                       material.type === 'avaliacao' ? 'Avaliação' : material.type}
                    </TableCell>
                    <TableCell>{material.subject}</TableCell>
                    <TableCell>{formatCurrency(material.price)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${material.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {material.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditMaterial(material.id)}>
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => confirmDelete(material.id)}>
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
            <h3 className="text-xl font-semibold mb-2">Nenhum material cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Clique no botão "Adicionar Material" para cadastrar um novo material didático.
            </p>
            <Button onClick={handleCreateMaterial}>Adicionar Material</Button>
          </div>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja excluir este material? Esta ação não pode ser desfeita.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteMaterial}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default PropertyManagement;
