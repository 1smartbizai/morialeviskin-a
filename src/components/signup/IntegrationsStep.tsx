
import { useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { FeatureGate, PlanBadge, UpgradePrompt } from "@/components/plan-gating";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { 
  Calendar, 
  Mail, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Phone,
  Zap,
  ExternalLink,
  CheckCircle2,
  Settings,
  Crown,
  ArrowUp,
  Lock,
  AlertTriangle
} from "lucide-react";

const IntegrationsStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const { currentPlan, checkFeatureAccess, getFeatureRequiredPlan } = usePlanPermissions();
  
  const [integrations, setIntegrations] = useState({
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

  const integrationsList = [
    {
      id: 'googleCalendar',
      name: 'יומן Google',
      description: 'סנכרון אוטומטי של תורים עם יומן Google שלך - חסוך זמן ומנעי טעויות',
      icon: Calendar,
      feature: 'google_calendar_sync' as const,
      enabled: integrations.googleCalendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      connectUrl: '#',
      category: 'חיוני'
    },
    {
      id: 'email',
      name: 'אימייל מרקטינג',
      description: 'שליחת מיילים אוטומטיים, ניוזלטרים ותזכורות ללקוחות - הגדלת המכירות',
      icon: Mail,
      feature: 'email_automation' as const,
      enabled: integrations.email,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      connectUrl: '#',
      category: 'שיווק'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'תקשורת מהירה ונוחה עם הלקוחות דרך WhatsApp - הגדלת שביעות הרצון',
      icon: MessageCircle,
      feature: 'whatsapp_integration' as const,
      enabled: integrations.whatsapp,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      connectUrl: '#',
      category: 'תקשורת'
    },
    {
      id: 'sms',
      name: 'הודעות SMS',
      description: 'שליחת תזכורות והודעות חשובות דרך SMS - הפחתת אי הגעות',
      icon: Phone,
      feature: 'sms_messaging' as const,
      enabled: integrations.sms,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      connectUrl: '#',
      category: 'תזכורות'
    },
    {
      id: 'instagram',
      name: 'אינסטגרם Business',
      description: 'חיבור לחשבון העסק באינסטגרם לשיתוף תוכן וניהול הודעות',
      icon: Instagram,
      feature: 'social_media_integration' as const,
      enabled: integrations.instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      connectUrl: '#',
      category: 'רשתות חברתיות'
    },
    {
      id: 'facebook',
      name: 'פייסבוק Business',
      description: 'ניהול עמוד העסק בפייסבוק וקבלת הודעות - הרחבת החשיפה',
      icon: Facebook,
      feature: 'social_media_integration' as const,
      enabled: integrations.facebook,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      connectUrl: '#',
      category: 'רשתות חברתיות'
    }
  ];

  const enabledIntegrationsCount = Object.values(integrations).filter(Boolean).length;
  const totalIntegrations = integrationsList.length;

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Zap className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-l from-primary to-purple-600 bg-clip-text text-transparent">
          אינטגרציות חכמות לעסק שלך, {signupData.firstName}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          חברי את Bellevo לכלים שאת כבר משתמשת בהם כדי לחסוך זמן ולשפר את השירות ללקוחות
        </p>
      </div>

      {/* Current Plan Badge */}
      <div className="flex justify-center">
        <div className="flex items-center gap-3 bg-gradient-to-l from-blue-50 to-purple-50 px-6 py-3 rounded-full border border-blue-200">
          <Crown className="h-5 w-5 text-primary" />
          <span className="font-medium">התכנית הנוכחית שלך:</span>
          <PlanBadge plan={currentPlan} />
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-l from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Settings className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                💡 מה זה אינטגרציות?
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed mb-3">
                אינטגרציות מאפשרות ל-Bellevo להתחבר לכלים אחרים שאת משתמשת בהם, 
                כמו יומן Google או WhatsApp. זה חוסך לך זמן ומאפשר ניהול מרכזי של כל הפעילות העסקית.
              </p>
              <div className="bg-blue-100 p-3 rounded-lg">
                <p className="text-blue-900 text-sm font-medium">
                  🔒 חלק מהאינטגרציות זמינות רק בתכניות מתקדמות יותר
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Summary */}
      <Card className="bg-gradient-to-l from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              <h3 className="font-semibold text-green-900 text-lg">
                {enabledIntegrationsCount} מתוך {totalIntegrations} אינטגרציות נבחרו
              </h3>
            </div>
            <p className="text-green-800 text-sm">
              תוכלי להוסיף או לשנות אינטגרציות בכל עת מדף ההגדרות של העסק
            </p>
            
            {enabledIntegrationsCount === 0 && (
              <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-yellow-800">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    מומלץ לבחור לפחות אינטגרציה אחת כדי להתחיל
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrationsList.map((integration) => {
          const hasAccess = checkFeatureAccess(integration.feature);
          const requiredPlan = getFeatureRequiredPlan(integration.feature);
          
          return (
            <div key={integration.id} className="relative">
              <Card className={`transition-all duration-300 hover:shadow-md ${
                integration.enabled ? `ring-2 ring-green-200 bg-green-50/50` : ''
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
                        onClick={() => handleUpgradeClick(integration.id)}
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
                        {integration.enabled && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 mt-1">
                            <CheckCircle2 className="h-3 w-3 ml-1" />
                            מחובר
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Switch
                      checked={integration.enabled}
                      disabled={!hasAccess}
                      onCheckedChange={(checked) => 
                        handleIntegrationToggle(integration.id, checked, integration.feature)
                      }
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4">
                    {integration.description}
                  </p>
                  
                  {hasAccess && integration.enabled && (
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
        })}
      </div>

      {/* Help Section */}
      <Card className="bg-gradient-to-l from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            🚀 טיפים לאינטגרציות מוצלחות
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
            <div className="space-y-2">
              <h4 className="font-medium">מומלץ להתחיל עם:</h4>
              <ul className="space-y-1">
                <li>• יומן Google (סנכרון תורים)</li>
                <li>• הודעות SMS (תזכורות)</li>
                <li>• אימייל מרקטינג (שמירת קשר)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">לאחר מכן:</h4>
              <ul className="space-y-1">
                <li>• WhatsApp Business (תקשורת מהירה)</li>
                <li>• רשתות חברתיות (חשיפה)</li>
                <li>• אינטגרציות מתקדמות נוספות</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      {currentPlan === 'starter' && (
        <Card className="bg-gradient-to-l from-primary/10 to-purple-200/50 border-primary/30">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">
              שדרגי לתכנית מתקדמת ופתחי את כל האינטגרציות
            </h3>
            <p className="text-muted-foreground mb-4">
              קבלי גישה לכל האינטגרציות, תכונות מתקדמות ותמיכה VIP
            </p>
            <Button 
              size="lg" 
              onClick={() => handleUpgradeClick('general')}
              className="gap-2"
            >
              <ArrowUp className="h-5 w-5" />
              שדרגי את התכנית שלך
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IntegrationsStep;
