
import { Card, CardContent } from "@/components/ui/card";
import { PlanBadge } from "@/components/plan-gating";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { useSignup } from "@/contexts/SignupContext";
import { Zap, Crown, Settings } from "lucide-react";

const IntegrationsHeader = () => {
  const { currentPlan } = usePlanPermissions();
  const { signupData } = useSignup();

  return (
    <>
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
    </>
  );
};

export default IntegrationsHeader;
