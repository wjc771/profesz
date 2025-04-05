
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/format';
import { Property } from '@/types/property';

const PropertyManagement = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*');
      
      if (error) throw error;
      
      // Transform the database data to match the Property type
      const transformedData = data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type as any,
        transactionType: item.transaction_type as any,
        price: item.price,
        propertyTax: item.property_tax,
        location: {
          address: item.address,
          neighborhood: item.neighborhood,
          city: item.city,
          state: item.state,
          zipCode: item.zip_code,
          lat: item.lat,
          lng: item.lng
        },
        features: {
          bedrooms: item.bedrooms,
          bathrooms: item.bathrooms,
          parkingSpaces: item.parking_spaces,
          area: item.area,
          hasPool: item.has_pool,
          isFurnished: item.is_furnished,
          hasElevator: item.has_elevator,
          petsAllowed: item.pets_allowed,
          hasGym: item.has_gym,
          hasBalcony: item.has_balcony,
          condominium: item.condominium
        },
        images: item.images || [],
        ownerId: item.owner_id,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        isActive: item.is_active,
        isPremium: item.is_premium
      }));
      
      setProperties(transformedData);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Erro ao carregar imóveis',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleCreateProperty = () => {
    navigate('/property/new');
  };

  const handleEditProperty = (id: string) => {
    navigate(`/property/edit/${id}`);
  };

  const handleDeleteProperty = async () => {
    if (!selectedPropertyId) return;
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', selectedPropertyId);
      
      if (error) throw error;
      
      setProperties(properties.filter(property => property.id !== selectedPropertyId));
      toast({
        title: 'Imóvel excluído',
        description: 'O imóvel foi excluído com sucesso.'
      });
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast({
        title: 'Erro ao excluir imóvel',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setConfirmDialogOpen(false);
      setSelectedPropertyId(null);
    }
  };

  const confirmDelete = (id: string) => {
    setSelectedPropertyId(id);
    setConfirmDialogOpen(true);
  };

  return (
    <MainLayout>
      <div className="container max-w-6xl py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gerenciamento de Imóveis</h1>
          <Button onClick={handleCreateProperty}>Adicionar Imóvel</Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : properties.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Transação</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>
                      {property.type === 'apartment' ? 'Apartamento' :
                       property.type === 'house' ? 'Casa' :
                       property.type === 'commercial' ? 'Comercial' :
                       property.type === 'land' ? 'Terreno' : 'Outro'}
                    </TableCell>
                    <TableCell>
                      {property.transactionType === 'sale' ? 'Venda' : 'Aluguel'}
                    </TableCell>
                    <TableCell>{formatCurrency(property.price)}</TableCell>
                    <TableCell>{`${property.location.city}, ${property.location.state}`}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${property.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {property.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditProperty(property.id)}>
                          Editar
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => confirmDelete(property.id)}>
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
            <h3 className="text-xl font-semibold mb-2">Nenhum imóvel cadastrado</h3>
            <p className="text-muted-foreground mb-4">
              Clique no botão "Adicionar Imóvel" para cadastrar um novo imóvel.
            </p>
            <Button onClick={handleCreateProperty}>Adicionar Imóvel</Button>
          </div>
        )}

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
            </DialogHeader>
            <p>Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDeleteProperty}>
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
