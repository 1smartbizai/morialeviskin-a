
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, CreditCard, MessageSquare, BarChart3, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FeatureGate, PlanBadge } from "@/components/plan-gating";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";

const QuickActions = () => {
  const navigate = useNavigate();
  const { isFeatureLocked, getFeatureRequiredPlan } = usePlanPermissions();
  
  const actions = [
    {
      title: "תור חדש",
      description: "קבע תור ללקוח",
      icon: Calendar,
      onClick: () => navigate("/admin/appointments"),
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "לקוח חדש",
      description: "הוסף לקוח למערכת",
      icon: Users,
      onClick: () => navigate("/admin/clients"),
      color: "from-purple-500 to-purple-600",
      feature: "unlimited_clients" as const
    },
    {
      title: "תשלום חדש",
      description: "רשום תשלום",
      icon: CreditCard,
      onClick: () => navigate("/admin/payments"),
      color: "from-green-500 to-green-600"
    },
    {
      title: "שלח הודעה",
      description: "הודעה ללקוחות",
      icon: MessageSquare,
      onClick: () => navigate("/admin/messages"),
      color: "from-pink-500 to-pink-600",
      feature: "sms_messaging" as const
    },
    {
      title: "דוחות",
      description: "צפה בביצועים",
      icon: BarChart3,
      onClick: () => navigate("/admin/analytics"),
      color: "from-orange-500 to-orange-600",
      feature: "advanced_analytics" as const
    },
    {
      title: "הגדרות",
      description: "נהל את העסק",
      icon: Settings,
      onClick: () => navigate("/admin/business-settings"),
      color: "from-gray-500 to-gray-600"
    }
  ];

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-2xl transition-all duration-500">
      <CardHeader className="bg-gradient-to-l from-blue-50 to-purple-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">פעולות מהירות</h3>
            <p className="text-sm text-gray-600">גישה מהירה לכל מה שחשוב</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => {
            const isLocked = action.feature && isFeatureLocked(action.feature);
            const requiredPlan = action.feature && getFeatureRequiredPlan(action.feature);
            
            return (
              <div key={action.title} className="relative">
                <Button
                  variant="outline"
                  className={`w-full h-24 flex flex-col items-center justify-center p-4 hover:shadow-lg transition-all duration-300 hover:scale-105 group border-gray-200 ${
                    isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-purple-300'
                  }`}
                  onClick={isLocked ? undefined : action.onClick}
                  disabled={isLocked}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color} text-white mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-sm">{action.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                  </div>
                </Button>
                
                {isLocked && requiredPlan && (
                  <div className="absolute -top-2 -left-2">
                    <PlanBadge plan={requiredPlan} size="sm" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
