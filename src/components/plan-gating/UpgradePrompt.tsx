
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, Sparkles } from "lucide-react";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { type FeatureName, FEATURE_PERMISSIONS, PLAN_INFO } from "@/utils/planPermissions";
import PlanBadge from "./PlanBadge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UpgradePromptProps {
  feature: FeatureName;
  className?: string;
  variant?: 'inline' | 'modal' | 'banner';
}

const UpgradePrompt = ({ feature, className, variant = 'inline' }: UpgradePromptProps) => {
  const { getUpgradePathForFeature, getCurrentPlanInfo } = usePlanPermissions();
  const [showModal, setShowModal] = useState(false);
  
  const requiredPlan = getUpgradePathForFeature(feature);
  const featureInfo = FEATURE_PERMISSIONS[feature];
  const currentPlanInfo = getCurrentPlanInfo();
  
  if (!requiredPlan) return null;
  
  const requiredPlanInfo = PLAN_INFO[requiredPlan];
  
  const handleUpgrade = () => {
    if (variant === 'modal') {
      setShowModal(true);
    } else {
      // Navigate to upgrade page or open payment flow
      console.log(`Upgrade to ${requiredPlan} for feature: ${feature}`);
    }
  };
  
  const InlineContent = () => (
    <Card className={cn("border-2 border-dashed", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          שדרג כדי לפתח את {featureInfo.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{featureInfo.description}</p>
        <div className="flex items-center justify-between">
          <PlanBadge plan={requiredPlan} />
          <Button onClick={handleUpgrade} className="gap-2">
            <ArrowUp className="h-4 w-4" />
            שדרג ל-{requiredPlanInfo.name}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
  
  const BannerContent = () => (
    <div className={cn(
      "bg-gradient-to-l from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 flex items-center justify-between",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-full">
          <Sparkles className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h4 className="font-medium">{featureInfo.name} זמין ב-{requiredPlanInfo.name}</h4>
          <p className="text-sm text-muted-foreground">{featureInfo.description}</p>
        </div>
      </div>
      <Button onClick={handleUpgrade} size="sm" className="gap-2">
        <ArrowUp className="h-4 w-4" />
        שדרג
      </Button>
    </div>
  );
  
  if (variant === 'banner') {
    return <BannerContent />;
  }
  
  if (variant === 'modal') {
    return (
      <>
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <ArrowUp className="h-4 w-4" />
          שדרג ל-{requiredPlanInfo.name}
        </Button>
        
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                שדרוג נדרש
              </DialogTitle>
              <DialogDescription>
                כדי להשתמש ב{featureInfo.name}, יש צורך לשדרג ל-{requiredPlanInfo.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">התכנית הנוכחית שלך:</h4>
                <PlanBadge plan={currentPlanInfo.plan} />
              </div>
              
              <div 
                className="p-4 rounded-lg text-white"
                style={{ backgroundColor: requiredPlanInfo.color }}
              >
                <h4 className="font-medium mb-2">שדרג ל-{requiredPlanInfo.name}:</h4>
                <p className="text-sm opacity-90 mb-3">{requiredPlanInfo.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">₪{requiredPlanInfo.price}/חודש</span>
                  <Button 
                    variant="secondary" 
                    onClick={handleUpgrade}
                    className="bg-white/20 hover:bg-white/30 text-white"
                  >
                    התחל שדרוג
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }
  
  return <InlineContent />;
};

export default UpgradePrompt;
