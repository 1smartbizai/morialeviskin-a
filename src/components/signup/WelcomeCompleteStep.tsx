
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Sparkles, ArrowLeft, Building2, Users, Calendar } from "lucide-react";
import { useSignup } from "@/contexts/SignupContext";
import confetti from 'canvas-confetti';

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
  const [setupProgress, setSetupProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("מכין את המערכת...");
  const [isComplete, setIsComplete] = useState(false);

  const setupTasks = [
    "יוצר את חשבון העסק...",
    "מגדיר את המותג והצבעים...",
    "מכין את לוח הזמנים...",
    "מגדיר אינטגרציות...",
    "מסיים את ההכנות...",
    "הכל מוכן! 🎉"
  ];

  useEffect(() => {
    // Trigger confetti on component mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Simulate setup progress
    const interval = setInterval(() => {
      setSetupProgress(prev => {
        const newProgress = prev + 16.67; // 100 / 6 tasks
        const taskIndex = Math.floor(newProgress / 16.67);
        
        if (taskIndex < setupTasks.length) {
          setCurrentTask(setupTasks[taskIndex]);
        }
        
        if (newProgress >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          // Another confetti burst when complete
          setTimeout(() => {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 }
            });
          }, 500);
        }
        
        return Math.min(newProgress, 100);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Building2,
      title: "העסק שלך מוכן",
      description: `${businessName} זמין עכשיו ללקוחות שלך`
    },
    {
      icon: Users,
      title: "ניהול לקוחות חכם",
      description: "מערכת מתקדמת לניהול קשרי לקוחות ומעקב אחר הטיפולים"
    },
    {
      icon: Calendar,
      title: "תזמון תורים",
      description: "לקוחות יכולים לקבוע תורים בקלות והכל מסונכרן איתך"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-8 animate-fade-in" dir="rtl">
      {!isComplete ? (
        // Setup in Progress
        <>
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-primary/10 p-8">
              <Sparkles className="h-16 w-16 text-primary animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-4 max-w-md">
            <h2 className="text-3xl font-bold text-primary">
              בונים את העסק שלך...
            </h2>
            
            <p className="text-lg text-muted-foreground">
              אנחנו מכינים הכל בשבילך, זה ייקח רק עוד כמה רגעים
            </p>
            
            <div className="space-y-3">
              <Progress value={setupProgress} className="w-full h-3" />
              <p className="text-sm text-muted-foreground font-medium">
                {currentTask}
              </p>
            </div>
          </div>
        </>
      ) : (
        // Setup Complete
        <>
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-8">
              <CheckCircle2 className="h-20 w-20 text-green-600" />
            </div>
          </div>
          
          {/* Welcome Message */}
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl font-bold text-primary">
              ברוכה הבאה ל-Bellevo, {signupData.firstName}! 🎉
            </h1>
            
            <p className="text-xl text-muted-foreground">
              העסק שלך <span className="font-semibold text-primary">{businessName}</span> מוכן ופועל!
            </p>
            
            {businessDomain && (
              <p className="text-muted-foreground">
                הלקוחות שלך יכולים לגשת אליך ב: 
                <span className="font-mono bg-muted px-2 py-1 rounded mx-2">
                  {businessDomain}.bellevo.app
                </span>
              </p>
            )}
          </div>

          {/* Business Info Card */}
          <Card className="bg-gradient-to-l from-purple-50 to-pink-50 border-primary/20 w-full max-w-md">
            <CardContent className="p-6">
              <h3 className="font-semibold text-primary mb-4">סיכום העסק שלך:</h3>
              <div className="space-y-2 text-sm text-muted-foreground text-right">
                <p><span className="font-medium">שם העסק:</span> {businessName}</p>
                <p><span className="font-medium">דוא״ל:</span> {signupData.email}</p>
                <p><span className="font-medium">טלפון:</span> {signupData.phone}</p>
                <p><span className="font-medium">תכנית:</span> {signupData.subscriptionLevel}</p>
                {businessDomain && (
                  <p><span className="font-medium">דומיין:</span> {businessDomain}.bellevo.app</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Tour Info */}
          <Card className="bg-blue-50 border-blue-200 w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-blue-900 mb-2">
                מוכנה להתחיל?
              </h3>
              <p className="text-sm text-blue-800 mb-4">
                נעביר אותך למערכת הניהול שלך, שם תוכלי להוסיף את הטיפולים הראשונים ולהתחיל לקבל לקוחות
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WelcomeCompleteStep;
