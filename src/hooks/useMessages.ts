
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Message } from '@/types/messaging';

export const useMessages = () => {
  // Query for fetching messages
  const { 
    data: messages, 
    isLoading: messagesLoading,
    refetch 
  } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      try {
        // In a real app, this would fetch from Supabase
        // For now, we're using mock data
        const mockMessages: Message[] = [
          {
            id: '1',
            clientId: 'client1',
            content: 'שלום! תודה שבחרת בנו. נשמח לראות אותך בקרוב!',
            channel: 'whatsapp',
            status: 'delivered',
            sentAt: new Date(Date.now() - 86400000).toISOString(),
            deliveredAt: new Date(Date.now() - 86390000).toISOString(),
            userId: 'user1',
            clientName: 'רחל לוי'
          },
          {
            id: '2',
            clientId: 'client2',
            content: 'תזכורת: יש לך פגישה מחר בשעה 14:00',
            channel: 'sms',
            status: 'read',
            sentAt: new Date(Date.now() - 172800000).toISOString(),
            deliveredAt: new Date(Date.now() - 172790000).toISOString(),
            readAt: new Date(Date.now() - 172700000).toISOString(),
            userId: 'user1',
            clientName: 'דנה כהן'
          },
          {
            id: '3',
            clientId: 'client3',
            content: 'מבצע מיוחד: 20% הנחה על כל הטיפולים השבוע!',
            channel: 'in-app',
            status: 'sent',
            sentAt: new Date(Date.now() - 259200000).toISOString(),
            userId: 'user1',
            clientName: 'שרה גולדברג'
          }
        ];
        return mockMessages;
      } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
      }
    }
  });

  return {
    messages,
    messagesLoading,
    refetchMessages: refetch
  };
};
