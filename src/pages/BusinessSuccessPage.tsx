
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useBusinessOnboarding } from "@/hooks/useBusinessOnboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, ArrowLeft, Calendar, Users, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const BusinessSuccessPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { businessData, isLoading } = useBusinessOnboarding();
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Add animation delay for better UX
    const timer = setTimeout(() => setShowAnimation(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if user not authenticated
  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/admin/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-6" dir="rtl">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 space-y-6">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-32 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!businessData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-6" dir="rtl">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-4">שגיאה בטעינת נתוני העסק</h2>
            <Button onClick={() => navigate("/admin/login")}>
              חזור לכניסה למערכת
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const businessName = businessData.business_name || "העסק שלך";
  const ownerName = `${businessData.first_name || ""} ${businessData.last_name || ""}`.trim() || "בעלת העסק";
  const primaryColor = businessData.primary_color || "#6A0DAD";

  const quickActions = [
    {
      title: "הוסיפי טיפולים",
      description: "הגדירי את סוגי הטיפולים שלך",
      icon: Sparkles,
      action: () => navigate("/admin/business-management")
    },
    {
      title: "הוסיפי לקוחות", 
      description: "התחילי לנהל את בסיס הלקוחות",
      icon: Users,
      action: () => navigate("/admin/clients")
    },
    {
      title: "קבעי תורים",
      description: "נהלי את לוח הזמנים שלך",
      icon: Calendar,
      action: () => navigate("/admin/appointments")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-6" dir="rtl">
      <div className={`w-full max-w-4xl space-y-8 transition-all duration-1000 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Success Header */}
        <Card className="text-center shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="rounded-full bg-green-100 p-6 shadow-xl">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
                <div className="absolute -top-2 -right-2 animate-bounce">
                  <Sparkles className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-l from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ברוכה הבאה ל־Bellevo!
            </h1>
            
            <p className="text-2xl mb-6 text-gray-700">
              <span className="font-bold" style={{ color: primaryColor }}>{businessName}</span> מוכן לקבל לקוחות
            </p>
            
            <p className="text-lg text-gray-600">
              היי {ownerName}, הגדרת העסק הושלמה בהצלחה! 🎉
            </p>
          </CardContent>
        </Card>

        {/* Business Summary */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div 
                className="p-2 rounded-lg text-white"
                style={{ backgroundColor: primaryColor }}
              >
                <Settings className="h-6 w-6" />
              </div>
              סיכום העסק שלך
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">שם העסק:</span>
                  <span className="font-bold" style={{ color: primaryColor }}>{businessName}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">בעלת העסק:</span>
                  <span className="font-bold">{ownerName}</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="font-medium text-gray-600">צבע ראשי:</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <span className="font-medium">{primaryColor}</span>
                  </div>
                </div>
              </div>
              
              {businessData.logo_url && (
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <img 
                      src={businessData.logo_url} 
                      alt={businessName}
                      className="h-24 w-24 rounded-full object-cover shadow-xl ring-4 ring-white"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">צעדים ראשונים</h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {quickActions.map((action, index) => {
                // Safe check to ensure action and all its properties exist
                if (!action || !action.title || !action.description || !action.icon) {
                  return null;
                }
                
                return (
                  <Card 
                    key={action.title}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 border-gray-100 hover:border-purple-200"
                    onClick={action.action}
                  >
                    <CardContent className="p-6 text-center">
                      <div 
                        className="p-4 rounded-full mx-auto mb-4 w-fit"
                        style={{ backgroundColor: `${primaryColor}20` }}
                      >
                        <action.icon className="h-8 w-8" style={{ color: primaryColor }} />
                      </div>
                      <h3 className="font-bold mb-2">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="text-center space-y-4">
              <Button 
                size="lg" 
                className="px-12 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: primaryColor }}
                onClick={() => navigate("/admin")}
              >
                כניסה לדשבורד ניהול העסק
                <ArrowLeft className="mr-3 h-6 w-6" />
              </Button>
              
              <p className="text-sm text-gray-500">
                תוכלי להתחיל לנהל את העסק שלך מיד!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessSuccessPage;
