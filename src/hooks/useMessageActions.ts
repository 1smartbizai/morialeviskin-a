
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useMessageActions = () => {
  const queryClient = useQueryClient();

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
    sendMessage,
    resendMessage
  };
};
