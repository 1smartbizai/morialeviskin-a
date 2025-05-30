
import React from "react";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { type FeatureName } from "@/utils/planPermissions";
import PlanBadge from "./PlanBadge";
import UpgradePrompt from "./UpgradePrompt";

interface FeatureGateProps {
  feature: FeatureName;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  showBadge?: boolean;
  blurWhenLocked?: boolean;
}

const FeatureGate = ({ 
  feature, 
  children, 
  fallback,
  showUpgradePrompt = false,
  showBadge = true,
  blurWhenLocked = false
}: FeatureGateProps) => {
  const { checkFeatureAccess, getFeatureRequiredPlan } = usePlanPermissions();
  
  const hasAccess = checkFeatureAccess(feature);
  const requiredPlan = getFeatureRequiredPlan(feature);
  
  if (hasAccess) {
    return <>{children}</>;
  }
  
  // Feature is locked
  return (
    <div className="relative">
      <div className={`${blurWhenLocked ? 'blur-sm grayscale' : ''} ${fallback ? 'hidden' : ''}`}>
        {children}
      </div>
      
      {showBadge && !fallback && (
        <div className="absolute top-2 left-2 z-10">
          <PlanBadge plan={requiredPlan} size="sm" />
        </div>
      )}
      
      {fallback && (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          {showBadge && <PlanBadge plan={requiredPlan} size="lg" className="mb-4" />}
          {fallback}
          {showUpgradePrompt && <UpgradePrompt feature={feature} className="mt-4" />}
        </div>
      )}
      
      {!fallback && showUpgradePrompt && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <UpgradePrompt feature={feature} />
        </div>
      )}
    </div>
  );
};

export default FeatureGate;
