
import { useQuery } from '@tanstack/react-query';
import { Automation } from '@/types/messaging';

export const useAutomations = () => {
  // Query for fetching automations
  const { 
    data: automations, 
    isLoading: automationsLoading 
  } = useQuery({
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

  return {
    automations,
    automationsLoading
  };
};
