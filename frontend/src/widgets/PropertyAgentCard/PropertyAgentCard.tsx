import React from 'react';
import { Card } from '@/shared/ui/components/Card/Card';
import { Button } from '@/shared/ui/components/Button/Button';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface AgentInfo {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  company?: string;
  averageRating?: number;
  propertiesListed?: number;
}

interface PropertyAgentCardProps {
  agent: AgentInfo | null;
  propertyId?: string;
}

export const PropertyAgentCard: React.FC<PropertyAgentCardProps> = ({ agent, propertyId }) => {
  const router = useRouter();

  if (!agent) return null;

  const handleContact = () => {
    // rediriger vers la messagerie avec l'agent, ou ouvrir le chat
    router.push(`/messages?agentId=${agent.id}`);
  };

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
      <Button onClick={handleContact} variant="primary" size="md" className="w-full">
        <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
        Contacter l'agent
      </Button>
    </Card>
  );
};
