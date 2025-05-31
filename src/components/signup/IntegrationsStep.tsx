
import { useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { FeatureGate, PlanBadge } from "@/components/plan-gating";
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
  Settings
} from "lucide-react";

const IntegrationsStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const [integrations, setIntegrations] = useState({
    googleCalendar: signupData.googleCalendarConnected || false,
    email: signupData.emailIntegration || false,
    whatsapp: signupData.whatsappIntegration || false,
    instagram: false,
    facebook: false,
    sms: false,
  });

  const handleIntegrationToggle = (integration: string, enabled: boolean) => {
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
  };

  const integrationsList = [
    {
      id: 'googleCalendar',
      name: 'יומן Google',
      description: 'סנכרון אוטומטי של תורים עם יומן Google שלך',
      icon: Calendar,
      feature: 'google_calendar_sync' as const,
      enabled: integrations.googleCalendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      connectUrl: '#'
    },
    {
      id: 'email',
      name: 'Email Marketing',
      description: 'שליחת מיילים אוטומטיים ניוזלטרים ללקוחות',
      icon: Mail,
      feature: 'email_automation' as const,
      enabled: integrations.email,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      connectUrl: '#'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      description: 'תקשורת מהירה ונוחה עם הלקוחות דרך WhatsApp',
      icon: MessageCircle,
      feature: 'whatsapp_integration' as const,
      enabled: integrations.whatsapp,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      connectUrl: '#'
    },
    {
      id: 'sms',
      name: 'הודעות SMS',
      description: 'שליחת תזכורות והודעות דרך SMS',
      icon: Phone,
      feature: 'sms_messaging' as const,
      enabled: integrations.sms,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      connectUrl: '#'
    },
    {
      id: 'instagram',
      name: 'Instagram Business',
      description: 'חיבור לחשבון העסק באינסטגרם לשיתוף תוכן',
      icon: Instagram,
      feature: 'social_media_integration' as const,
      enabled: integrations.instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      connectUrl: '#'
    },
    {
      id: 'facebook',
      name: 'Facebook Business',
      description: 'ניהול עמוד העסק בפייסבוק וקבלת הודעות',
      icon: Facebook,
      feature: 'social_media_integration' as const,
      enabled: integrations.facebook,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      connectUrl: '#'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-primary">
          אינטגרציות חכמות לעסק שלך
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          חברי את Bellevo לכלים שאת כבר משתמשת בהם כדי לחסוך זמן ולשפר את השירות ללקוחות
        </p>
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
                מה זה אינטגרציות?
              </h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                אינטגרציות מאפשרות ל-Bellevo להתחבר לכלים אחרים שאת משתמשת בהם, 
                כמו יומן Google או WhatsApp. זה חוסך לך זמן ומאפשר ניהול מרכזי של כל הפעילות העסקית.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrationsList.map((integration) => (
          <FeatureGate 
            key={integration.id}
            feature={integration.feature}
            showBadge={true}
            blurWhenLocked={true}
          >
            <Card className={`transition-all duration-300 hover:shadow-md ${
              integration.enabled ? 'ring-2 ring-green-200 bg-green-50/50' : ''
            }`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${integration.bgColor} flex items-center justify-center`}>
                      <integration.icon className={`h-5 w-5 ${integration.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      {integration.enabled && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                          <CheckCircle2 className="h-3 w-3 ml-1" />
                          מחובר
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={integration.enabled}
                    onCheckedChange={(checked) => handleIntegrationToggle(integration.id, checked)}
                  />
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {integration.description}
                </p>
                
                {integration.enabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(integration.connectUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 ml-2" />
                    הגדר חיבור
                  </Button>
                )}
              </CardContent>
            </Card>
          </FeatureGate>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-l from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-semibold text-green-900 mb-2">
              {Object.values(integrations).filter(Boolean).length} אינטגרציות נבחרו
            </h3>
            <p className="text-green-800 text-sm">
              תוכלי להוסיף או לשנות אינטגרציות בכל עת מדף ההגדרות של העסק
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsStep;
