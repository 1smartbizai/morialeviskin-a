
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FeedbackSurveyData {
  overallSatisfaction: string;
  staffFriendliness: string;
  treatmentEffectiveness: string;
  additionalComments?: string;
}

export const useFeedbackSurvey = () => {
  const { toast } = useToast();
  const [isEligibleForSurvey, setIsEligibleForSurvey] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmittedRecently, setHasSubmittedRecently] = useState<boolean>(false);

  useEffect(() => {
    const checkEligibility = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          return;
        }
        
        // For development purposes, set eligibility to true
        // In production, this would check actual client data
        const mockEligibility = true;
        
        // Check if the user has submitted a survey in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const { data: recentSurveys } = await supabase
          .from("client_feedback")
          .select("*")
          .eq("client_id", user.id)
          .gte("created_at", thirtyDaysAgo.toISOString())
          .limit(1);
          
        const hasSubmitted = recentSurveys && recentSurveys.length > 0;
        
        setHasSubmittedRecently(hasSubmitted);
        setIsEligibleForSurvey(mockEligibility && !hasSubmitted);
      } catch (error) {
        console.error("Error checking survey eligibility:", error);
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בבדיקת הזכאות לסקר",
          variant: "destructive",
        });
      }
    };
    
    checkEligibility();
  }, [toast]);

  const submitSurvey = async (data: FeedbackSurveyData) => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Get the business owner ID (in a real app, this would come from context or storage)
      // For now, we'll use a mock ID
      const mockBusinessOwnerId = "mock-business-owner-id";
      
      const { error } = await supabase.from("client_feedback").insert({
        client_id: user.id,
        business_owner_id: mockBusinessOwnerId,
        overall_satisfaction: parseInt(data.overallSatisfaction),
        staff_friendliness: parseInt(data.staffFriendliness),
        treatment_effectiveness: parseInt(data.treatmentEffectiveness),
        additional_comments: data.additionalComments || null,
      });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const dismissSurvey = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Record that the user dismissed the survey
      const { error } = await supabase.from("client_feedback_dismissals").insert({
        client_id: user.id,
      });
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Error dismissing survey:", error);
      throw error;
    }
  };

  return {
    isEligibleForSurvey,
    hasSubmittedRecently,
    submitSurvey,
    dismissSurvey,
    isSubmitting,
  };
};
