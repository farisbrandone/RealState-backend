import React from 'react';
import { Card } from '@/shared/ui/components/Card/Card';
import { Button } from '@/shared/ui/components/Button/Button';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface AgentInfo {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  phone?: string | null;
  company?: string | null;
  averageRating?: number | null;
  propertiesListed?: number;
}

interface PropertyAgentCardProps {
  agent: AgentInfo | null;
  propertyId?: string;
  propertyTitle?: string;
}

export const PropertyAgentCard: React.FC<PropertyAgentCardProps> = ({
  agent,
  propertyId,
  propertyTitle,
}) => {
  const router = useRouter();

  if (!agent) return null;

  const handleContact = () => {
    const params = new URLSearchParams({ agentId: agent.id });
    if (propertyId) params.set('propertyId', propertyId);
    router.push(`/messages?${params.toString()}`);
  };

  // wa.me exige un numéro sans "+" ni espaces, uniquement des chiffres.
  const whatsappDigits = agent.phone?.replace(/[^0-9]/g, '');
  const whatsappMessage = encodeURIComponent(
    propertyTitle
      ? `Bonjour, je suis intéressé(e) par l'annonce "${propertyTitle}" sur LuxHorizon.`
      : `Bonjour, je vous contacte depuis LuxHorizon.`,
  );
  const whatsappUrl = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${whatsappMessage}`
    : null;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={agent.avatar || '/images/agent-placeholder.png'}
          alt={`${agent.firstName} ${agent.lastName}`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-heading text-lg">
            {agent.firstName} {agent.lastName}
          </h3>
          {agent.company && <p className="text-sm text-primary-500">{agent.company}</p>}
          {agent.averageRating && (
            <div className="flex items-center text-accent text-sm">
              ★ {agent.averageRating.toFixed(1)}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Button onClick={handleContact} variant="primary" size="md" className="w-full">
          <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
          Contacter l'agent
        </Button>
        {whatsappUrl && (
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
            <Button variant="outline" size="md" className="w-full border-green-500 text-green-600 hover:bg-green-50">
              <svg viewBox="0 0 24 24" className="h-5 w-5 mr-2 fill-current">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12.004 2C6.486 2 2 6.486 2 12.004c0 1.85.502 3.622 1.451 5.177L2 22l4.938-1.435a9.947 9.947 0 0 0 5.066 1.385h.004c5.518 0 10.004-4.486 10.004-10.004S17.522 2 12.004 2Zm0 18.166h-.003a8.15 8.15 0 0 1-4.15-1.135l-.298-.177-3.017.876.905-2.933-.194-.309a8.14 8.14 0 0 1-1.24-4.32c0-4.5 3.66-8.16 8.16-8.16 2.18 0 4.226.849 5.766 2.39a8.104 8.104 0 0 1 2.39 5.767c-.002 4.5-3.662 8.16-8.32 8.16Z" />
              </svg>
              Discuter sur WhatsApp
            </Button>
          </a>
        )}
      </div>
    </Card>
  );
};
