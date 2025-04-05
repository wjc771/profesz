
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="hover-scale">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="p-3 rounded-full bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
