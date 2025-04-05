
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  image?: string;
}

const TestimonialCard = ({ name, role, content, image }: TestimonialCardProps) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1 mb-4">
          <p className="text-muted-foreground italic">"{content}"</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            {image && <AvatarImage src={image} alt={name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
