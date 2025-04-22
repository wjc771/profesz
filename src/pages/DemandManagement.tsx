
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/format';
import { PropertyDemand } from '@/types/property';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const DemandManagement = () => {
  const [demands] = useState<PropertyDemand[]>([]); // Empty array during restructuring
  const [loading] = useState(false); // Set to false to avoid showing loading state
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDemandId, setSelectedDemandId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateDemand = () => {
    navigate('/demand/new');
  };

  const handleEditDemand = (id: string) => {
    navigate(`/demand/edit/${id}`);
  };

  const handleDeleteDemand = async () => {
    if (!selectedDemandId) return;
    
    try {
      toast({
        title: 'Demanda excluída',
        description: 'A demanda foi excluída com sucesso.'
      });
    } catch (error: any) {
      console.error('Error deleting demand:', error);
      toast({
        title: 'Erro ao excluir demanda',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setConfirmDialogOpen(false);
      setSelectedDemandId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedDemandId(id);
    setConfirmDialogOpen(true);
  };

  const isMobile = useIsMobile();

  return (
    <MainLayout>
      <div className="py-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="mobile-heading font-bold">Gerenciamento de Demandas</h1>
          <Button onClick={handleCreateDemand}>Adicionar Demanda</Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : demands.length > 0 ? (
          isMobile ? (
            <div className="space-y-4">
              {demands.map((demand) => (
                <Card key={demand.id} className="mobile-card bg-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span>{demand.transactionType === 'sale' ? 'Compra' : 'Aluguel'}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${demand.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                        {demand.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid gap-1 mobile-text">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tipos:</span>
                        <span>{demand.propertyTypes.map(type => 
                          type === 'apartment' ? 'Apartamento' :
                          type === 'house' ? 'Casa' :
                          type === 'commercial' ? 'Comercial' :
                          type === 'land' ? 'Terreno' : 'Outro'
                        ).join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Preço:</span>
                        <span>{formatCurrency(demand.priceRange.min)} - {formatCurrency(demand.priceRange.max)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Localidades:</span>
                        <span className="text-right">{demand.locationPreferences.cities.join(', ')}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditDemand(demand.id)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" className="flex-1" onClick={() => confirmDelete(demand.id)}>
                      Excluir
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Transação</TableHead>
                    <TableHead>Tipos de Imóvel</TableHead>
                    <TableHead>Faixa de Preço</TableHead>
                    <TableHead>Localidades</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demands.map((demand) => (
                    <TableRow key={demand.id}>
                      <TableCell>
                        {demand.transactionType === 'sale' ? 'Compra' : 'Aluguel'}
                      </TableCell>
                      <TableCell>
                        {demand.propertyTypes.map(type => 
                          type === 'apartment' ? 'Apartamento' :
                          type === 'house' ? 'Casa' :
                          type === 'commercial' ? 'Comercial' :
                          type === 'land' ? 'Terreno' : 'Outro'
                        ).join(', ')}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(demand.priceRange.min)} - {formatCurrency(demand.priceRange.max)}
                      </TableCell>
                      <TableCell>
                        {demand.locationPreferences.cities.join(', ')}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${demand.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'}`}>
                          {demand.isActive ? 'Ativa' : 'Inativa'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditDemand(demand.id)}>
                            Editar
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => confirmDelete(demand.id)}>
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Nenhuma demanda cadastrada</h3>
            <p className="text-muted-foreground mb-4">
              Clique no botão "Adicionar Demanda" para cadastrar uma nova demanda.
            </p>
            <Button onClick={handleCreateDemand}>Adicionar Demanda</Button>
          </div>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja excluir esta demanda? Esta ação não pode ser desfeita.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteDemand}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default DemandManagement;
