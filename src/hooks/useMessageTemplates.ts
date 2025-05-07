
import { useQuery } from '@tanstack/react-query';
import { MessageTemplate } from '@/types/messaging';

export const useMessageTemplates = () => {
  // Query for fetching message templates
  const { 
    data: templates, 
    isLoading: templatesLoading 
  } = useQuery({
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

  return {
    templates,
    templatesLoading
  };
};
