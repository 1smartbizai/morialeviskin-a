
import { useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { toast } from "@/components/ui/use-toast";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import {
  IntegrationsHeader,
  IntegrationsProgress,
  IntegrationsFooter,
  IntegrationCard,
  getIntegrationsList
} from "./integrations";
import type { IntegrationsState } from "./integrations";

const IntegrationsStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const { checkFeatureAccess, getFeatureRequiredPlan } = usePlanPermissions();
  
  const [integrations, setIntegrations] = useState<IntegrationsState>({
    googleCalendar: signupData.googleCalendarConnected || false,
    email: signupData.emailIntegration || false,
    whatsapp: signupData.whatsappIntegration || false,
    instagram: false,
    facebook: false,
    sms: false,
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState<string | null>(null);

  const handleIntegrationToggle = (integration: string, enabled: boolean, requiredFeature?: any) => {
    // Check if feature is available for current plan
    if (requiredFeature && !checkFeatureAccess(requiredFeature)) {
      const requiredPlan = getFeatureRequiredPlan(requiredFeature);
      toast({
        variant: "destructive",
        title: "שדרוג נדרש",
        description: `התכונה זמינה החל מתכנית ${requiredPlan}. אנא שדרגי את המנוי שלך.`
      });
      setShowUpgradeModal(integration);
      return;
    }

    setIntegrations(prev => ({
      ...prev,
      [integration]: enabled
    }));

    // Update signup context
    if (integration === 'googleCalendar') {
      updateSignupData({ googleCalendarConnected: enabled });
    } else if (integration === 'email') {
      updateSignupData({ emailIntegration: enabled });
    } else if (integration === 'whatsapp') {
      updateSignupData({ whatsappIntegration: enabled });
    }
    
    if (enabled) {
      toast({
        title: "אינטגרציה הופעלה",
        description: `${signupData.firstName}, האינטגרציה עם ${getIntegrationName(integration)} הופעלה בהצלחה`
      });
    }
  };

  const getIntegrationName = (id: string) => {
    const names: Record<string, string> = {
      googleCalendar: 'יומן Google',
      email: 'אימייל מרקטינג',
      whatsapp: 'WhatsApp Business',
      sms: 'הודעות SMS',
      instagram: 'אינסטגרם',
      facebook: 'פייסבוק'
    };
    return names[id] || id;
  };

  const handleUpgradeClick = (integration: string) => {
    // Here you would navigate to upgrade page or open upgrade modal
    toast({
      title: "מעבר לשדרוג",
      description: `${signupData.firstName}, מעביר אותך לדף שדרוג המנוי...`
    });
    
    // For demo purposes, just show a message
    console.log(`Upgrade requested for integration: ${integration}`);
  };

  const integrationsList = getIntegrationsList(integrations);
  const enabledIntegrationsCount = Object.values(integrations).filter(Boolean).length;

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <IntegrationsHeader />
      
      <IntegrationsProgress 
        enabledCount={enabledIntegrationsCount} 
        totalCount={integrationsList.length} 
      />

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrationsList.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            enabled={integration.enabled}
            onToggle={handleIntegrationToggle}
            onUpgradeClick={handleUpgradeClick}
          />
        ))}
      </div>

      <IntegrationsFooter onUpgradeClick={handleUpgradeClick} />
    </div>
  );
};

export default IntegrationsStep;
