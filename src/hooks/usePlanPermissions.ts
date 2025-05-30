
import { useSignup } from "@/contexts/SignupContext";
import { useBusinessOnboarding } from "@/hooks/useBusinessOnboarding";
import { 
  getCurrentPlan, 
  hasFeatureAccess, 
  getRequiredPlan, 
  getUpgradePath,
  type PlanType, 
  type FeatureName,
  PLAN_INFO 
} from "@/utils/planPermissions";

export function usePlanPermissions() {
  const { signupData } = useSignup();
  const { businessData } = useBusinessOnboarding();
  
  // Get current plan from either signup context or business data
  const subscriptionLevel = businessData?.subscription_level || signupData?.subscriptionLevel;
  const currentPlan = getCurrentPlan(subscriptionLevel);
  
  const checkFeatureAccess = (feature: FeatureName): boolean => {
    return hasFeatureAccess(currentPlan, feature);
  };
  
  const getFeatureRequiredPlan = (feature: FeatureName): PlanType => {
    return getRequiredPlan(feature);
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
  
  const isFeatureLocked = (feature: FeatureName): boolean => {
    return !checkFeatureAccess(feature);
  };
  
  return {
    currentPlan,
    checkFeatureAccess,
    isFeatureLocked,
    getFeatureRequiredPlan,
    getUpgradePathForFeature,
    getCurrentPlanInfo
  };
}
