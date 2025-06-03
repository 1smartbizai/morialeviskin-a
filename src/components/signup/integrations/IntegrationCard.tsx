
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { UpgradePrompt, PlanBadge } from "@/components/plan-gating";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { useSignup } from "@/contexts/SignupContext";
import { CheckCircle2, ExternalLink, Lock, ArrowUp } from "lucide-react";
import { IntegrationItem } from "./types";

interface IntegrationCardProps {
  integration: IntegrationItem;
  enabled: boolean;
  onToggle: (id: string, enabled: boolean, requiredFeature?: any) => void;
  onUpgradeClick: (integration: string) => void;
}

const IntegrationCard = ({ integration, enabled, onToggle, onUpgradeClick }: IntegrationCardProps) => {
  const { checkFeatureAccess, getFeatureRequiredPlan } = usePlanPermissions();
  const { signupData } = useSignup();
  
  const hasAccess = checkFeatureAccess(integration.feature);
  const requiredPlan = getFeatureRequiredPlan(integration.feature);

  return (
    <div className="relative">
      <Card className={`transition-all duration-300 hover:shadow-md ${
        enabled ? `ring-2 ring-green-200 bg-green-50/50` : ''
      } ${!hasAccess ? 'opacity-60' : ''} ${integration.borderColor}`}>
        
        {/* Plan Badge for Locked Features */}
        {!hasAccess && (
          <div className="absolute top-3 left-3 z-10">
            <PlanBadge plan={requiredPlan} size="sm" />
          </div>
        )}
        
        {/* Lock Overlay for Restricted Features */}
        {!hasAccess && (
          <div className="absolute inset-0 bg-gray-50/80 rounded-lg flex items-center justify-center z-20">
            <div className="text-center p-4">
              <Lock className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-3">
                זמין בתכנית {requiredPlan}
              </p>
              <Button
                size="sm"
                onClick={() => onUpgradeClick(integration.id)}
                className="gap-2"
              >
                <ArrowUp className="h-4 w-4" />
                שדרג עכשיו
              </Button>
            </div>
          </div>
        )}

        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${integration.bgColor} flex items-center justify-center`}>
                <integration.icon className={`h-5 w-5 ${integration.color}`} />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {integration.name}
                  <Badge variant="outline" className="text-xs">
                    {integration.category}
                  </Badge>
                </CardTitle>
                {enabled && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 mt-1">
                    <CheckCircle2 className="h-3 w-3 ml-1" />
                    מחובר
                  </Badge>
                )}
              </div>
            </div>
            
            <Switch
              checked={enabled}
              disabled={!hasAccess}
              onCheckedChange={(checked) => 
                onToggle(integration.id, checked, integration.feature)
              }
            />
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4">
            {integration.description}
          </p>
          
          {hasAccess && enabled && (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => window.open(integration.connectUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              הגדר חיבור
            </Button>
          )}
          
          {!hasAccess && (
            <UpgradePrompt 
              feature={integration.feature} 
              variant="banner"
              className="mt-4"
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationCard;
