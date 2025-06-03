
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { useSignup } from "@/contexts/SignupContext";
import { useNavigate } from "react-router-dom";
import SetupProgress from "@/components/signup/welcome/SetupProgress";
import WelcomeHeader from "@/components/signup/welcome/WelcomeHeader";
import BusinessSummaryCard from "@/components/signup/welcome/BusinessSummaryCard";
import FeaturesPreview from "@/components/signup/welcome/FeaturesPreview";
import NextStepsCard from "@/components/signup/welcome/NextStepsCard";
import ShareBusinessActions from "@/components/signup/success/ShareBusinessActions";
import DashboardCTA from "@/components/signup/success/DashboardCTA";
import VerificationReminder from "@/components/signup/success/VerificationReminder";
import WelcomeConfetti from "@/components/signup/welcome/WelcomeConfetti";
import { 
  CheckCircle2, 
  Sparkles, 
  Crown, 
  Calendar,
  Users,
  MessageCircle,
  Star,
  Trophy,
  Target,
  Zap,
  Heart,
  Gift,
  ArrowLeft,
  ExternalLink,
  Copy,
  Smartphone
} from "lucide-react";

interface WelcomeCompleteStepProps {
  businessName: string;
  businessDomain?: string;
  businessId?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  onResendVerification: () => void;
}

const WelcomeCompleteStep = ({ 
  businessName, 
  businessDomain,
  businessId,
  isEmailVerified,
  isPhoneVerified,
  onResendVerification
}: WelcomeCompleteStepProps) => {
  const { signupData } = useSignup();
  const navigate = useNavigate();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Simulate setup completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSetupComplete(true);
      setShowConfetti(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleCopyBusinessUrl = async () => {
    if (businessDomain) {
      const fullUrl = `https://${businessDomain}.bellevo.app`;
      try {
        await navigator.clipboard.writeText(fullUrl);
        toast({
          title: "הכתובת הועתקה בהצלחה!",
          description: "כעת תוכלי לשתף אותה עם הלקוחות שלך"
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "שגיאה בהעתקת הכתובת",
          description: "נסי להעתיק את הכתובת בצורה ידנית"
        });
      }
    }
  };

  const handleWhatsAppShare = () => {
    if (businessDomain) {
      const message = `היי! הצטרפי לאפליקציה החדשה שלי ${businessName} לניהול תורים והזמנות: https://${businessDomain}.bellevo.app 💜`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const achievements = [
    {
      icon: Crown,
      title: "העסק שלך מוכן!",
      description: `${businessName} זמין עכשיו ללקוחות`,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Zap,
      title: "מערכת מתקדמת",
      description: "כל הכלים שאת צריכה במקום אחד",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Target,
      title: "יעדים ברורים",
      description: "מעקב אחר הצמיחה והרווחיות",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Heart,
      title: "לקוחות מרוצות",
      description: "חוויית משתמש מעולה ופשוטה",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    }
  ];

  const nextSteps = [
    {
      step: 1,
      title: "הוסיפי את הטיפולים הראשונים",
      description: "צרי את רשימת השירותים והמחירים",
      icon: Gift
    },
    {
      step: 2,
      title: "הזמיני לקוחות קיימות",
      description: "שתפי את הקישור עם הלקוחות שלך",
      icon: Users
    },
    {
      step: 3,
      title: "קבעי את התור הראשון",
      description: "התחילי לקבל הזמנות דרך המערכת",
      icon: Calendar
    }
  ];

  if (!isSetupComplete) {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 text-center py-12" dir="rtl">
        <SetupProgress onComplete={() => setIsSetupComplete(true)} />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-center py-8" dir="rtl">
      {/* Confetti Effect */}
      {showConfetti && <WelcomeConfetti />}
      
      {/* Welcome Header */}
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="rounded-full bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-8 shadow-2xl">
              <Trophy className="h-20 w-20 text-white" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="bg-yellow-400 rounded-full p-2 shadow-lg animate-bounce">
                <Crown className="h-6 w-6 text-yellow-800" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-6 w-6 text-yellow-500 animate-pulse" />
            <Badge variant="secondary" className="bg-gradient-to-l from-yellow-100 to-orange-100 text-yellow-800 px-4 py-2 text-lg font-semibold">
              🎉 מזל טוב! התהליך הושלם בהצלחה
            </Badge>
            <Star className="h-6 w-6 text-yellow-500 animate-pulse" />
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-l from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
            ברוכה הבאה ל-Bellevo, {signupData.firstName}! ✨
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            העסק שלך <span className="font-bold text-primary">{businessName}</span> מוכן ומחכה ללקוחות הראשונות!
          </p>

          {businessDomain && (
            <div className="bg-gradient-to-l from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200 max-w-lg mx-auto">
              <p className="text-muted-foreground mb-3">כתובת האפליקציה שלך:</p>
              <div className="flex items-center justify-center gap-3 bg-white rounded-lg p-3 border">
                <code className="text-primary font-mono text-lg font-semibold">
                  {businessDomain}.bellevo.app
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyBusinessUrl}
                  className="gap-2"
                >
                  <Copy className="h-4 w-4" />
                  העתק
                </Button>
              </div>
              
              <div className="flex justify-center gap-3 mt-4">
                <Button
                  size="sm"
                  onClick={handleWhatsAppShare}
                  className="bg-[#25D366] hover:bg-[#128C7E] gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  שתף בוואטסאפ
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`https://${businessDomain}.bellevo.app`, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  פתח אפליקציה
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verification Reminder */}
      {(!isEmailVerified || !isPhoneVerified) && (
        <div className="max-w-md mx-auto">
          <VerificationReminder
            isEmailVerified={isEmailVerified}
            isPhoneVerified={isPhoneVerified}
            onResendVerification={onResendVerification}
          />
        </div>
      )}

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {achievements.map((achievement, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${achievement.bgColor} flex items-center justify-center`}>
                  <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                </div>
                <div className="text-right">
                  <h3 className="font-semibold text-lg mb-1">{achievement.title}</h3>
                  <p className="text-muted-foreground text-sm">{achievement.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Business Summary */}
      <Card className="max-w-2xl mx-auto bg-gradient-to-l from-purple-50 to-pink-50 border-primary/20">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-primary mb-6 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6" />
            סיכום העסק שלך
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">שם העסק:</span>
                <span className="text-primary font-semibold">{businessName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">בעלת העסק:</span>
                <span>{signupData.firstName} {signupData.lastName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">דוא״ל:</span>
                <span>{signupData.email}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">טלפון:</span>
                <span>{signupData.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">תכנית:</span>
                <Badge variant="secondary" className="bg-gradient-to-l from-purple-100 to-blue-100">
                  {signupData.subscriptionLevel === 'pro' ? 'פרו' : 
                   signupData.subscriptionLevel === 'premium' ? 'פרמיום' : 'בסיסית'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">סטטוס:</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle2 className="h-4 w-4 ml-1" />
                  פעיל
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-8">
          <h3 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            השלבים הבאים שלך
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {nextSteps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">{step.title}</h4>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      <Card className="max-w-2xl mx-auto bg-gradient-to-l from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-3">
            🎊 העסק שלך מוכן לפעולה!
          </h3>
          <p className="text-green-800 mb-6">
            {signupData.firstName}, כל המערכות פועלות תקין והאפליקציה מוכנה לקבל את הלקוחות הראשונות. 
            זה הזמן להתחיל ולבנות את העסק שחלמת עליו! 💪
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/admin')}
              className="bg-gradient-to-l from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Crown className="h-5 w-5 ml-2" />
              כניסה למערכת הניהול
            </Button>
            
            {businessDomain && (
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open(`https://${businessDomain}.bellevo.app`, '_blank')}
                className="px-8 py-6 text-lg font-semibold border-2 hover:bg-primary/5"
              >
                <Smartphone className="h-5 w-5 ml-2" />
                צפייה באפליקציה
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Message */}
      <div className="max-w-2xl mx-auto text-center pt-8 border-t">
        <p className="text-muted-foreground">
          💜 תודה שבחרת ב-Bellevo! אנחנו כאן לתמוך בך בכל שלב של הדרך.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          זקוקה לעזרה? ניתן ליצור קשר דרך המערכת או בוואטסאפ
        </p>
      </div>
    </div>
  );
};

export default WelcomeCompleteStep;
