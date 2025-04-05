
import { useState, useRef } from 'react';
import { Property } from '@/types/property';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/format';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface PropertySwiperProps {
  properties: Property[];
  onLike: (property: Property) => void;
  onDislike: (property: Property) => void;
}

const PropertySwiper = ({ properties, onLike, onDislike }: PropertySwiperProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const swipeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentProperty = properties[currentIndex];

  const handleLike = () => {
    if (currentIndex >= properties.length) return;
    
    setSwipeDirection('right');
    if (swipeTimeoutRef.current) clearTimeout(swipeTimeoutRef.current);
    
    swipeTimeoutRef.current = setTimeout(() => {
      onLike(currentProperty);
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 500);
  };

  const handleDislike = () => {
    if (currentIndex >= properties.length) return;
    
    setSwipeDirection('left');
    if (swipeTimeoutRef.current) clearTimeout(swipeTimeoutRef.current);
    
    swipeTimeoutRef.current = setTimeout(() => {
      onDislike(currentProperty);
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
    }, 500);
  };

  // No more properties to show
  if (currentIndex >= properties.length) {
    return (
      <div className="card-swipe-area flex items-center justify-center h-[400px]">
        <div className="text-center p-6">
          <h3 className="text-xl font-bold mb-2">Você viu todos os imóveis</h3>
          <p className="text-muted-foreground mb-4">
            Não há mais imóveis para mostrar agora. Volte mais tarde ou ajuste seus filtros.
          </p>
          <Button onClick={() => setCurrentIndex(0)}>Ver novamente</Button>
        </div>
      </div>
    );
  }

  const animationClass = swipeDirection 
    ? swipeDirection === 'right' 
      ? 'animate-swipe-right' 
      : 'animate-swipe-left' 
    : '';

  return (
    <div className="card-swipe-area relative h-[400px] overflow-hidden">
      <Card 
        className={`relative h-full ${animationClass}`}
      >
        <div className="relative h-full">
          <img
            src={currentProperty.images[0] || '/placeholder.svg'}
            alt={currentProperty.title}
            className="h-full w-full object-cover"
          />
          
          <div className="absolute top-2 right-2 flex gap-2">
            <Badge 
              className={currentProperty.transactionType === 'sale' ? 'bg-primary' : 'bg-secondary'}
            >
              {currentProperty.transactionType === 'sale' ? 'Venda' : 'Aluguel'}
            </Badge>
          </div>
          
          {/* Property details overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <h3 className="text-xl font-bold mb-1">{currentProperty.title}</h3>
            <p className="opacity-90 mb-2">
              {currentProperty.location.neighborhood}, {currentProperty.location.city}
            </p>
            
            <div className="text-2xl font-bold">
              {formatCurrency(currentProperty.price)}
              {currentProperty.transactionType === 'rent' && <span className="text-sm font-normal opacity-90">/mês</span>}
            </div>
            
            <div className="mt-2 flex flex-wrap gap-4">
              {currentProperty.features.bedrooms > 0 && (
                <div>
                  <span className="font-medium">{currentProperty.features.bedrooms}</span>
                  <span className="ml-1 opacity-90">quarto{currentProperty.features.bedrooms !== 1 ? 's' : ''}</span>
                </div>
              )}
              {currentProperty.features.bathrooms > 0 && (
                <div>
                  <span className="font-medium">{currentProperty.features.bathrooms}</span>
                  <span className="ml-1 opacity-90">banheiro{currentProperty.features.bathrooms !== 1 ? 's' : ''}</span>
                </div>
              )}
              {currentProperty.features.area > 0 && (
                <div>
                  <span className="font-medium">{currentProperty.features.area}</span>
                  <span className="ml-1 opacity-90">m²</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Action buttons */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 z-10">
        <Button 
          variant="destructive" 
          className="h-14 w-14 rounded-full"
          onClick={handleDislike}
        >
          <XCircle className="h-8 w-8" />
        </Button>
        <Button 
          variant="default" 
          className="h-14 w-14 rounded-full bg-primary"
          onClick={handleLike}
        >
          <CheckCircle className="h-8 w-8" />
        </Button>
      </div>
    </div>
  );
};

export default PropertySwiper;
