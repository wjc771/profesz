
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PropertyMatch, PropertyType, TransactionType } from '@/types/property';

const MatchManagement = () => {
  const [matches, setMatches] = useState<PropertyMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('property_matches')
        .select(`
          *,
          property:property_id (
            id, title, type, transaction_type, price, 
            address, city, state, neighborhood
          )
        `);
      
      if (error) throw error;
      
      // Transform the data to match the PropertyMatch type
      const transformedData: PropertyMatch[] = data.map(item => ({
        id: item.id,
        propertyId: item.property_id,
        demandId: item.demand_id,
        score: item.score,
        createdAt: item.created_at,
        viewed: item.viewed,
        contacted: item.contacted,
        property: item.property ? {
          id: item.property.id,
          title: item.property.title,
          type: item.property.type as PropertyType,
          transactionType: item.property.transaction_type as TransactionType,
          price: item.property.price,
          location: {
            address: item.property.address,
            neighborhood: item.property.neighborhood,
            city: item.property.city,
            state: item.property.state,
            zipCode: '',
            lat: null,
            lng: null
          },
          description: '',
          features: {
            bedrooms: 0,
            bathrooms: 0,
            parkingSpaces: 0,
            area: 0
          },
          images: [],
          ownerId: '',
          createdAt: '',
          updatedAt: '',
          isActive: true
        } : undefined
      }));
      
      setMatches(transformedData);
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

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleMarkAsViewed = async (id: string) => {
    try {
      const { error } = await supabase
        .from('property_matches')
        .update({ viewed: true })
        .eq('id', id);
      
      if (error) throw error;
      
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
      const { error } = await supabase
        .from('property_matches')
        .update({ contacted: true })
        .eq('id', id);
      
      if (error) throw error;
      
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
      const { error } = await supabase
        .from('property_matches')
        .delete()
        .eq('id', selectedMatchId);
      
      if (error) throw error;
      
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

  const viewPropertyDetails = (propertyId: string | undefined) => {
    if (propertyId) {
      navigate(`/property/${propertyId}`);
    } else {
      toast({
        title: 'Propriedade não disponível',
        description: 'Os detalhes desta propriedade não estão disponíveis.',
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
                  <TableHead>Imóvel</TableHead>
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
                      {match.property ? (
                        <div className="cursor-pointer hover:underline" onClick={() => viewPropertyDetails(match.propertyId)}>
                          {match.property.title}
                        </div>
                      ) : (
                        <span className="text-gray-500">Imóvel não disponível</span>
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
              Os matches são gerados automaticamente quando há correspondência entre imóveis e demandas.
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
