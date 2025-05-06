
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RiskAssessment, RiskAssessmentFormValues } from '@/types/client-management';
import { useToast } from '@/hooks/use-toast';

export const useRiskAssessments = (clientId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Query for fetching risk assessments
  const {
    data: assessments,
    isLoading,
    error
  } = useQuery({
    queryKey: ['riskAssessments', clientId],
    queryFn: async () => {
      let query = supabase
        .from('client_risk_assessments')
        .select('*, client:clients(id, first_name, last_name, phone, photo_url, status)')
        .order('risk_score', { ascending: false });
      
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as RiskAssessment[];
    },
    enabled: !!supabase,
  });
  
  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('client_risk_assessments_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'client_risk_assessments',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['riskAssessments'] });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  // Mutation for creating risk assessments
  const createMutation = useMutation({
    mutationFn: async (values: RiskAssessmentFormValues) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('client_risk_assessments')
        .insert({
          user_id: user.data.user.id,
          client_id: values.client_id,
          risk_score: values.risk_score,
          reasons: values.reasons || [],
          suggested_actions: values.suggested_actions || [],
          status: values.status || 'active'
        })
        .select('*, client:clients(id, first_name, last_name, phone, photo_url, status)')
        .single();
      
      if (error) throw error;
      return data as RiskAssessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskAssessments'] });
      toast({
        title: "Risk assessment added",
        description: "The client risk assessment has been saved.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add assessment",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for updating risk assessments
  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string, values: Partial<RiskAssessmentFormValues> }) => {
      const updateData: Partial<RiskAssessment> = {
        updated_at: new Date().toISOString()
      };
      
      if (values.risk_score !== undefined) updateData.risk_score = values.risk_score;
      if (values.reasons !== undefined) updateData.reasons = values.reasons;
      if (values.suggested_actions !== undefined) updateData.suggested_actions = values.suggested_actions;
      if (values.status !== undefined) updateData.status = values.status;
      
      const { data, error } = await supabase
        .from('client_risk_assessments')
        .update(updateData)
        .eq('id', id)
        .select('*, client:clients(id, first_name, last_name, phone, photo_url, status)')
        .single();
      
      if (error) throw error;
      return data as RiskAssessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskAssessments'] });
      toast({
        title: "Assessment updated",
        description: "The risk assessment has been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update assessment",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Mutation for marking action taken on risk assessment
  const markActionTakenMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('client_risk_assessments')
        .update({
          last_action_date: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*, client:clients(id, first_name, last_name, phone, photo_url, status)')
        .single();
      
      if (error) throw error;
      return data as RiskAssessment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['riskAssessments'] });
      toast({
        title: "Action marked as taken",
        description: "The action has been marked as taken.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to mark action",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  return {
    assessments,
    isLoading,
    error,
    createAssessment: createMutation.mutate,
    updateAssessment: updateMutation.mutate,
    markActionTaken: markActionTakenMutation.mutate,
    createAssessmentAsync: createMutation.mutateAsync,
    updateAssessmentAsync: updateMutation.mutateAsync,
    markActionTakenAsync: markActionTakenMutation.mutateAsync,
  };
};
