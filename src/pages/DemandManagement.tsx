
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/format';
import { PropertyDemand } from '@/types/property';

const DemandManagement = () => {
  const [demands, setDemands] = useState<PropertyDemand[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedDemandId, setSelectedDemandId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchDemands = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_demands')
        .select('*');
      
      if (error) throw error;
      
      // Transform the database data to match the PropertyDemand type
      const transformedData = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        transactionType: item.transaction_type as any,
        propertyTypes: item.property_types,
        priceRange: {
          min: item.min_price,
          max: item.max_price
        },
        locationPreferences: {
          cities: item.cities,
          neighborhoods: item.neighborhoods || [],
          states: item.states
        },
        featureRequirements: {
          bedrooms: item.min_bedrooms,
          bathrooms: item.min_bathrooms,
          parkingSpaces: item.min_parking_spaces,
          area: item.min_area,
          hasPool: item.has_pool,
          isFurnished: item.is_furnished,
          hasElevator: item.has_elevator,
          petsAllowed: item.pets_allowed,
          hasGym: item.has_gym,
          hasBalcony: item.has_balcony
        },
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        isActive: item.is_active
      }));
      
      setDemands(transformedData);
    } catch (error: any) {
      console.error('Error fetching demands:', error);
      toast({
        title: 'Erro ao carregar demandas',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemands();
  }, []);

  const handleCreateDemand = () => {
    navigate('/demand/new');
  };

  const handleEditDemand = (id: string) => {
    navigate(`/demand/edit/${id}`);
  };

  const handleDeleteDemand = async () => {
    if (!selectedDemandId) return;
    
    try {
      const { error } = await supabase
        .from('property_demands')
        .delete()
        .eq('id', selectedDemandId);
      
      if (error) throw error;
      
      setDemands(demands.filter(demand => demand.id !== selectedDemandId));
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

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciamento de Demandas</h1>
          <Button onClick={handleCreateDemand}>Adicionar Demanda</Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : demands.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
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
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${demand.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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
