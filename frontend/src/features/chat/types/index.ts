export interface ChatParticipant {
  userId: string;
  role: 'OWNER' | 'AGENT' | 'CLIENT';
  joinedAt: string;
  lastReadAt: string;
  lastReadMessageId: string | null;
  isMuted: boolean;
  isActive: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'TEXT' | 'IMAGE' | 'FILE';
  status: 'SENT' | 'DELIVERED' | 'READ';
  sentAt: string;
  editedAt?: string | null;
  deletedAt?: string | null;
  replyToId?: string | null;
  attachments: {
    id: string;
    url: string;
    type: string;
  }[];
}

export interface Conversation {
  id: string;
  type: 'DIRECT' | 'GROUP';
  title: string;
  participants: ChatParticipant[];
  lastMessage: ChatMessage | null;
  unreadCount: number;
  propertyId: string | null;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isMuted: boolean;
}
