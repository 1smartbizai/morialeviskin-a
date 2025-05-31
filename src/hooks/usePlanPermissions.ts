
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { 
  FEATURE_PERMISSIONS, 
  PLAN_HIERARCHY,
  PLAN_INFO,
  type PlanType, 
  type FeatureName,
  hasFeatureAccess,
  getRequiredPlan,
  getUpgradePath,
  getCurrentPlan
} from "@/utils/planPermissions";

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

  // Get current plan using the utility function
  const currentPlan: PlanType = getCurrentPlan(businessData?.subscription_level);

  const isFeatureLocked = (feature: FeatureName): boolean => {
    return !hasFeatureAccess(currentPlan, feature);
  };

  const getFeatureRequiredPlan = (feature: FeatureName): PlanType => {
    return getRequiredPlan(feature);
  };

  const canAccessFeature = (feature: FeatureName): boolean => {
    return hasFeatureAccess(currentPlan, feature);
  };

  const checkFeatureAccess = (feature: FeatureName): boolean => {
    return hasFeatureAccess(currentPlan, feature);
  };

  const getUpgradePathForFeature = (feature: FeatureName): PlanType | null => {
    return getUpgradePath(currentPlan, feature);
  };

  const getCurrentPlanInfo = () => {
    return {
      plan: currentPlan,
      ...PLAN_INFO[currentPlan]
    };
  };

  return {
    currentPlan,
    isFeatureLocked,
    getFeatureRequiredPlan,
    canAccessFeature,
    checkFeatureAccess,
    getUpgradePathForFeature,
    getCurrentPlanInfo
  };
};
