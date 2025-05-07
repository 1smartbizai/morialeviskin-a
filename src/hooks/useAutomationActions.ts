
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Automation } from '@/types/messaging';
import { toast } from 'sonner';

export const useAutomationActions = () => {
  const queryClient = useQueryClient();

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

  return {
    saveAutomation
  };
};
