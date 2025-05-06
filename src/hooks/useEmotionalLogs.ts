
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EmotionalLog, EmotionalLogFormValues } from '@/types/client-management';
import { useToast } from '@/hooks/use-toast';

export const useEmotionalLogs = (clientId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Query for fetching emotional logs
  const {
    data: logs,
    isLoading,
    error
  } = useQuery({
    queryKey: ['emotionalLogs', clientId],
    queryFn: async () => {
      let query = supabase
        .from('client_emotional_logs')
        .select('*, client:clients(id, first_name, last_name, phone, photo_url, status)')
        .order('created_at', { ascending: false });
      
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as EmotionalLog[];
    },
    enabled: !!supabase,
  });
  
  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('client_emotional_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_emotional_logs',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['emotionalLogs'] });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  // Mutation for creating emotional logs
  const createMutation = useMutation({
    mutationFn: async (values: EmotionalLogFormValues) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('client_emotional_logs')
        .insert({
          user_id: user.data.user.id,
          client_id: values.client_id,
          content: values.content,
          tags: values.tags || [],
          sentiment: values.sentiment
        })
        .select('*, client:clients(id, first_name, last_name, phone, photo_url, status)')
        .single();
      
      if (error) throw error;
      return data as EmotionalLog;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['emotionalLogs'] });
      toast({
        title: "Log added successfully",
        description: "The emotional log has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add log",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for updating emotional logs
  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: Partial<EmotionalLogFormValues> }) => {
      const { data, error } = await supabase
        .from('client_emotional_logs')
        .update({
          content: values.content,
          tags: values.tags,
          sentiment: values.sentiment,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*, client:clients(id, first_name, last_name, phone, photo_url, status)')
        .single();
      
      if (error) throw error;
      return data as EmotionalLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotionalLogs'] });
      toast({
        title: "Log updated successfully",
        description: "The emotional log has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update log",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for deleting emotional logs
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('client_emotional_logs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotionalLogs'] });
      toast({
        title: "Log deleted successfully",
        description: "The emotional log has been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete log",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    logs,
    isLoading,
    error,
    createLog: createMutation.mutate,
    updateLog: updateMutation.mutate,
    deleteLog: deleteMutation.mutate,
    createLogAsync: createMutation.mutateAsync,
    updateLogAsync: updateMutation.mutateAsync,
    deleteLogAsync: deleteMutation.mutateAsync,
  };
};
