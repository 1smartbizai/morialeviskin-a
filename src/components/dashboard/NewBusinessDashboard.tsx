
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Settings, 
  Sparkles, 
  Play,
  CheckCircle,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface NewBusinessDashboardProps {
  businessName: string;
  ownerName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string | null;
  onStartTour: () => void;
}

const NewBusinessDashboard = ({ 
  businessName, 
  ownerName, 
  primaryColor, 
  accentColor, 
  logoUrl,
  onStartTour 
}: NewBusinessDashboardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const quickStartSteps = [
    {
      id: "add-treatment",
      title: "הוסיפי את הטיפול הראשון שלך",
      description: "הגדירי את סוגי הטיפולים שאת מציעה",
      icon: Sparkles,
      action: () => navigate("/admin/business-management"),
      completed: false
    },
    {
      id: "add-client", 
      title: "הוסיפי את הלקוחה הראשונה",
      description: "התחילי לנהל את בסיס הלקוחות שלך",
      icon: Users,
      action: () => navigate("/admin/clients"),
      completed: false
    },
    {
      id: "book-appointment",
      title: "קבעי את התור הראשון",
      description: "נהלי את לוח הזמנים שלך",
      icon: Calendar,
      action: () => navigate("/admin/appointments"),
      completed: false
    },
    {
      id: "customize-settings",
      title: "התאימי את הגדרות העסק",
      description: "שעות עבודה, מחירים ועוד",
      icon: Settings,
      action: () => navigate("/admin/business-settings"),
      completed: false
    }
  ];

  const markStepCompleted = async (stepId: string) => {
    const newCompleted = [...completedSteps, stepId];
    setCompletedSteps(newCompleted);
    
    // Save progress to database
    if (user?.id) {
      await supabase
        .from('business_owners')
        .update({
          metadata: {
            onboardingProgress: newCompleted,
            lastUpdated: new Date().toISOString()
          }
        })
        .eq('user_id', user.id);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Welcome Header */}
      <div className="text-center py-8">
        {logoUrl && (
          <div className="mb-4 flex justify-center">
            <img 
              src={logoUrl} 
              alt={businessName}
              className="h-16 w-16 rounded-full object-cover"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold mb-2" style={{ color: primaryColor }}>
          ברוכה הבאה ל-{businessName}!
        </h1>
        <p className="text-xl text-muted-foreground">
          היי {ownerName}, בואי נתחיל להקים את העסק שלך יחד
        </p>
      </div>

      {/* Tour CTA */}
      <Card className="border-2" style={{ borderColor: accentColor }}>
        <CardContent className="p-6 text-center">
          <Play className="h-12 w-12 mx-auto mb-4" style={{ color: primaryColor }} />
          <h3 className="text-lg font-semibold mb-2">רוצה סיור במערכת?</h3>
          <p className="text-muted-foreground mb-4">
            נלווה אותך צעד אחר צעד דרך כל האפשרויות במערכת
          </p>
          <Button onClick={onStartTour} style={{ backgroundColor: primaryColor }}>
            <Play className="ml-2 h-4 w-4" />
            התחילי סיור
          </Button>
        </CardContent>
      </Card>

      {/* Quick Start Steps */}
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold">צעדים ראשונים</h2>
        {quickStartSteps.map((step, index) => (
          <Card 
            key={step.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => {
              step.action();
              markStepCompleted(step.id);
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div 
                  className="p-3 rounded-full"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <step.icon className="h-6 w-6" style={{ color: primaryColor }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{step.title}</h3>
                    {completedSteps.includes(step.id) && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
                <Badge variant="outline">שלב {index + 1}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" style={{ color: primaryColor }} />
            טיפים להתחלה מוצלחת
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-blue-50 border-r-4 border-blue-400">
            <p className="text-sm">💡 התחילי עם 2-3 סוגי טיפולים עיקריים ותוסיפי עוד בהמשך</p>
          </div>
          <div className="p-3 rounded-lg bg-green-50 border-r-4 border-green-400">
            <p className="text-sm">📱 הזמיני חברות ומכרות להיות הלקוחות הראשונות שלך</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-50 border-r-4 border-purple-400">
            <p className="text-sm">⏰ הגדירי שעות עבודה שמתאימות לך ולאורח החיים שלך</p>
          </div>
        </CardContent>
      </Card>

      {/* Skip to Main Dashboard */}
      <div className="text-center pt-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/admin")}
          className="text-muted-foreground"
        >
          <ArrowLeft className="ml-2 h-4 w-4" />
          דלגי לדשבורד הראשי
        </Button>
      </div>
    </div>
  );
};

export default NewBusinessDashboard;
