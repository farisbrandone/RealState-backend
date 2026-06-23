export interface NotificationItem {
  id: string;
  type: string; // e.g. 'ORDER_SHIPPED', 'SYSTEM_ALERT', 'NEW_MESSAGE', etc.
  recipient: {
    userId: string;
    email?: string;
    phoneNumber?: string;
  };
  channel: string; // 'email', 'push', 'sms', etc.
  content: {
    title: string;
    body: string;
    data?: any;
    imageUrl?: string;
    actionUrl?: string;
  };
  status: 'sent' | 'delivered' | 'failed' | 'pending' | 'read';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  id?: string;
  userId: string;
  notificationType: string;
  channels: string[];
  isEnabled: boolean;
  updatedAt?: string;
}

export interface PushSubscriptionRequest {
  userId: string;
  provider: string;
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
}
