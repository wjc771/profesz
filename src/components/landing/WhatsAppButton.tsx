
import { MessageSquare } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  message?: string;
}

const WhatsAppButton = ({ phoneNumber, message = 'Olá! Tenho interesse no MatchImobiliário.' }: WhatsAppButtonProps) => {
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
      aria-label="Contato via WhatsApp"
    >
      <MessageSquare className="h-6 w-6" />
    </a>
  );
};

export default WhatsAppButton;
