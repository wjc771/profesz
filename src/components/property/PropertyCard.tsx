
import { Property } from '@/types/property';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/format';

interface PropertyCardProps {
  property: Property;
  onSelect?: () => void;
}

const PropertyCard = ({ property, onSelect }: PropertyCardProps) => {
  // Use the first image or a placeholder
  const imageUrl = property.images?.length > 0 
    ? property.images[0] 
    : '/placeholder.svg';

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <Card 
      className="property-card cursor-pointer overflow-hidden hover:transform hover:scale-[1.01] transition-all"
      onClick={handleClick}
    >
      <div className="relative h-48">
        <img
          src={imageUrl}
          alt={property.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge 
            className={property.transactionType === 'sale' ? 'bg-primary' : 'bg-secondary'}
          >
            {property.transactionType === 'sale' ? 'Venda' : 'Aluguel'}
          </Badge>
          {property.isPremium && (
            <Badge className="ml-1 bg-accent">Destaque</Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-lg truncate">{property.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {property.location.neighborhood}, {property.location.city}
          </p>
        </div>
        <div className="mt-2 font-bold text-xl">
          {formatCurrency(property.price)}
          {property.transactionType === 'rent' && <span className="text-sm font-normal text-muted-foreground">/mês</span>}
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          {property.features.bedrooms > 0 && (
            <div className="flex items-center">
              <span className="font-medium">{property.features.bedrooms}</span>
              <span className="ml-1 text-muted-foreground">quarto{property.features.bedrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          {property.features.bathrooms > 0 && (
            <div className="flex items-center">
              <span className="font-medium">{property.features.bathrooms}</span>
              <span className="ml-1 text-muted-foreground">banheiro{property.features.bathrooms !== 1 ? 's' : ''}</span>
            </div>
          )}
          {property.features.area > 0 && (
            <div className="flex items-center">
              <span className="font-medium">{property.features.area}</span>
              <span className="ml-1 text-muted-foreground">m²</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
