
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Message, MessageTemplate, Automation } from '@/types/messaging';
import { toast } from 'sonner';

export const useMessaging = () => {
  const queryClient = useQueryClient();
  const [selectedClients, setSelectedClients] = useState<string[]>([]);

  // Query for fetching messages
  const { data: messages, isLoading: messagesLoading } = useQuery({
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

  // Query for fetching message templates
  const { data: templates, isLoading: templatesLoading } = useQuery({
    queryKey: ['messageTemplates'],
    queryFn: async () => {
      try {
        // In a real app, this would fetch from Supabase
        const mockTemplates: MessageTemplate[] = [
          {
            id: '1',
            name: 'ברכה לקוחות חדשים',
            content: 'שלום {{שם}}! תודה שבחרת בנו. נשמח לראות אותך בקרוב!',
            type: 'greeting',
            createdAt: new Date(Date.now() - 2592000000).toISOString(),
            updatedAt: new Date(Date.now() - 2592000000).toISOString()
          },
          {
            id: '2',
            name: 'תזכורת לפגישה',
            content: 'תזכורת: יש לך פגישה מחר בשעה {{שעה}} אצל {{שם_המטפל}}',
            type: 'reminder',
            createdAt: new Date(Date.now() - 1592000000).toISOString(),
            updatedAt: new Date(Date.now() - 1592000000).toISOString()
          },
          {
            id: '3',
            name: 'מבצע שבועי',
            content: 'מבצע מיוחד: {{אחוז_הנחה}}% הנחה על {{שם_טיפול}} השבוע!',
            type: 'promotion',
            createdAt: new Date(Date.now() - 592000000).toISOString(),
            updatedAt: new Date(Date.now() - 592000000).toISOString()
          }
        ];
        return mockTemplates;
      } catch (error) {
        console.error('Error fetching templates:', error);
        return [];
      }
    }
  });

  // Query for fetching automations
  const { data: automations, isLoading: automationsLoading } = useQuery({
    queryKey: ['automations'],
    queryFn: async () => {
      try {
        // In a real app, this would fetch from Supabase
        const mockAutomations: Automation[] = [
          {
            id: '1',
            name: 'תזכורת ללקוחות שלא ביקרו',
            trigger: {
              type: 'no_visit',
              days: 30
            },
            action: {
              type: 'send_message',
              messageTemplate: '1',
              channel: 'whatsapp'
            },
            isActive: true,
            createdAt: new Date(Date.now() - 1592000000).toISOString(),
            updatedAt: new Date(Date.now() - 1592000000).toISOString(),
            lastTriggeredAt: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '2',
            name: 'ברכת יום הולדת',
            trigger: {
              type: 'birthday',
              days: 0
            },
            action: {
              type: 'send_message',
              messageTemplate: '3',
              channel: 'sms'
            },
            isActive: false,
            createdAt: new Date(Date.now() - 592000000).toISOString(),
            updatedAt: new Date(Date.now() - 592000000).toISOString()
          }
        ];
        return mockAutomations;
      } catch (error) {
        console.error('Error fetching automations:', error);
        return [];
      }
    }
  });

  // Mutation for sending messages
  const sendMessage = useMutation({
    mutationFn: async ({ content, clientIds, channel }: { content: string, clientIds: string[], channel: 'whatsapp' | 'sms' | 'in-app' }) => {
      try {
        // In a real app, this would send to an API/Supabase
        console.log('Sending message:', { content, clientIds, channel });
        
        // Mock successful sending
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { success: true };
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('ההודעה נשלחה בהצלחה');
    },
    onError: (error) => {
      toast.error(`שגיאה בשליחת ההודעה: ${error.message}`);
    }
  });

  // Mutation for creating/updating automations
  const saveAutomation = useMutation({
    mutationFn: async (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
      try {
        // In a real app, this would save to Supabase
        console.log('Saving automation:', automation);
        
        // Mock successful saving
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { success: true, id: automation.id || 'new-id' };
      } catch (error) {
        console.error('Error saving automation:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations'] });
      toast.success('האוטומציה נשמרה בהצלחה');
    },
    onError: (error) => {
      toast.error(`שגיאה בשמירת האוטומציה: ${error.message}`);
    }
  });

  // Function to resend a message
  const resendMessage = async (messageId: string) => {
    try {
      // In a real app, this would call an API
      console.log('Resending message ID:', messageId);
      
      // Mock successful resending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('ההודעה נשלחה מחדש בהצלחה');
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    } catch (error) {
      console.error('Error resending message:', error);
      toast.error('שגיאה בשליחה מחדש של ההודעה');
    }
  };

  return {
    messages,
    templates,
    automations,
    messagesLoading,
    templatesLoading,
    automationsLoading,
    selectedClients,
    setSelectedClients,
    sendMessage,
    saveAutomation,
    resendMessage
  };
};
