
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AutomatedAction, AutomatedActionFormValues } from '@/types/client-management';
import { useToast } from '@/hooks/use-toast';

export const useAutomatedActions = (clientId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Query for fetching automated actions
  const {
    data: actions,
    isLoading,
    error
  } = useQuery({
    queryKey: ['automatedActions', clientId],
    queryFn: async () => {
      let query = supabase
        .from('client_automated_actions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as AutomatedAction[];
    },
    enabled: !!supabase,
  });
  
  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('client_automated_actions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_automated_actions',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['automatedActions'] });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  // Mutation for creating automated actions
  const createMutation = useMutation({
    mutationFn: async (values: AutomatedActionFormValues) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('client_automated_actions')
        .insert({
          user_id: user.data.user.id,
          client_id: values.client_id,
          source_type: values.source_type,
          source_id: values.source_id,
          action_type: values.action_type,
          content: values.content,
          scheduled_for: values.scheduled_for
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as AutomatedAction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automatedActions'] });
      toast({
        title: "Automated action created",
        description: "The automated action has been scheduled.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create action",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for updating automated action status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: 'pending' | 'completed' | 'failed' }) => {
      const { data, error } = await supabase
        .from('client_automated_actions')
        .update({
          status,
          executed_at: status !== 'pending' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as AutomatedAction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automatedActions'] });
      toast({
        title: "Status updated",
        description: "The automated action status has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for deleting automated actions
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_automated_actions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automatedActions'] });
      toast({
        title: "Action deleted",
        description: "The automated action has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete action",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    actions,
    isLoading,
    error,
    createAction: createMutation.mutate,
    updateActionStatus: updateStatusMutation.mutate,
    deleteAction: deleteMutation.mutate,
    createActionAsync: createMutation.mutateAsync,
    updateActionStatusAsync: updateStatusMutation.mutateAsync,
    deleteActionAsync: deleteMutation.mutateAsync,
  };
};
