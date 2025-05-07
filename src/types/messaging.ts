
export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  type: 'greeting' | 'reminder' | 'promotion' | 'custom';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  clientId: string;
  content: string;
  channel: 'whatsapp' | 'sms' | 'in-app';
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  failureReason?: string;
  automationId?: string;
  userId: string;
  clientName?: string;
}

export interface Automation {
  id: string;
  name: string;
  trigger: {
    type: 'no_visit' | 'birthday' | 'appointment_reminder' | 'custom';
    days: number;
    condition?: string;
  };
  action: {
    type: 'send_message';
    messageTemplate: string;
    channel: 'whatsapp' | 'sms' | 'in-app';
  };
  isActive: boolean;
  clientFilter?: string;
  makeWebhookUrl?: string;
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt?: string;
}
