
export interface ClientMessage {
  id: string;
  content: string;
  senderName: string;
  senderRole: 'practitioner' | 'system';
  messageType: 'greeting' | 'recommendation' | 'update' | 'appointment' | 'other';
  sentAt: string;
  isRead: boolean;
  responses?: ClientMessageResponse[];
}

export interface ClientMessageResponse {
  id: string;
  messageId: string;
  responseType: 'thank_you' | 'not_relevant' | 'interested' | 'question';
  respondedAt?: string;
}

export type QuickResponseType = 'thank_you' | 'not_relevant' | 'interested' | 'question';
