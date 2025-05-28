
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Calendar, 
  Users, 
  MessageSquare, 
  CreditCard, 
  BarChart3, 
  Settings,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "תור חדש",
      description: "הוסף תור חדש ללקוח",
      icon: Plus,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      onClick: () => navigate('/admin/appointments')
    },
    {
      title: "לקוח חדש",
      description: "הוסף לקוח חדש למערכת",
      icon: Users,
      color: "from-green-500 to-green-600", 
      bgColor: "from-green-50 to-green-100",
      onClick: () => navigate('/admin/clients')
    },
    {
      title: "הודעה חדשה",
      description: "שלח הודעה ללקוחות",
      icon: MessageSquare,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      onClick: () => navigate('/admin/messages')
    },
    {
      title: "תשלום חדש",
      description: "רשום תשלום חדש",
      icon: CreditCard,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      onClick: () => navigate('/admin/payments')
    },
    {
      title: "דוחות",
      description: "צפה בדוחות ותחזיות",
      icon: BarChart3,
      color: "from-teal-500 to-teal-600",
      bgColor: "from-teal-50 to-teal-100",
      onClick: () => navigate('/admin/insights')
    },
    {
      title: "הגדרות",
      description: "נהל את העסק שלך",
      icon: Settings,
      color: "from-gray-500 to-gray-600",
      bgColor: "from-gray-50 to-gray-100",
      onClick: () => navigate('/admin/business-settings')
    }
  ];

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-purple-50/30 hover:shadow-xl transition-all duration-500">
      <CardHeader className="bg-gradient-to-l from-purple-50 to-pink-50 pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">פעולות מהירות</h3>
            <p className="text-sm text-gray-600">מה את רוצה לעשות היום?</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={action.title}
              variant="ghost"
              className="h-auto p-0 hover:scale-105 transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={action.onClick}
            >
              <div className={`w-full p-4 rounded-xl bg-gradient-to-br ${action.bgColor} group-hover:shadow-md transition-all duration-300`}>
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{action.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{action.description}</p>
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
