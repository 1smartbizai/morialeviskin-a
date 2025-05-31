
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { PLAN_PERMISSIONS, type PlanType, type FeatureKey } from "@/utils/planPermissions";

export const usePlanPermissions = () => {
  const { user } = useAuth();

  // Get user's current plan from business_owners table
  const { data: businessData } = useQuery({
    queryKey: ['business-owner', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('business_owners')
        .select('subscription_level')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching business owner data:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

  // Default to 'free' if no plan is found
  const currentPlan: PlanType = (businessData?.subscription_level as PlanType) || 'free';

  const isFeatureLocked = (feature: FeatureKey): boolean => {
    const requiredPlan = PLAN_PERMISSIONS[feature];
    if (!requiredPlan) return false;
    
    const planHierarchy: PlanType[] = ['free', 'pro', 'gold'];
    const currentPlanIndex = planHierarchy.indexOf(currentPlan);
    const requiredPlanIndex = planHierarchy.indexOf(requiredPlan);
    
    return currentPlanIndex < requiredPlanIndex;
  };

  const getFeatureRequiredPlan = (feature: FeatureKey): PlanType | null => {
    return PLAN_PERMISSIONS[feature] || null;
  };

  const canAccessFeature = (feature: FeatureKey): boolean => {
    return !isFeatureLocked(feature);
  };

  return {
    currentPlan,
    isFeatureLocked,
    getFeatureRequiredPlan,
    canAccessFeature
  };
};
