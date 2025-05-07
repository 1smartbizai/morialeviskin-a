
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Copy, Share2, Whatsapp } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import confetti from 'canvas-confetti';

interface SuccessStepProps {
  businessName: string;
  businessDomain?: string;
  businessId?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  onResendVerification?: () => void;
}

const SuccessStep = ({ 
  businessName, 
  businessDomain = "bellevo.app/" + businessName.toLowerCase().replace(/\s+/g, '-'),
  businessId = "BIZ-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  isEmailVerified = false,
  isPhoneVerified = false,
  onResendVerification = () => {}
}: SuccessStepProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti on component mount
  useEffect(() => {
    // Small delay to ensure the component is fully rendered
    const timer = setTimeout(() => {
      setShowConfetti(true);
      triggerConfetti();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#6A0DAD', '#5AA9E6', '#FFD700', '#FF6B6B']
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const copyToClipboard = () => {
    const fullDomain = `https://${businessDomain}`;
    navigator.clipboard.writeText(fullDomain)
      .then(() => {
        toast.success("הכתובת הועתקה ללוח", {
          position: "top-center",
        });
      })
      .catch((err) => {
        toast.error("שגיאה בהעתקת הכתובת", {
          description: "נסי להעתיק את הכתובת בצורה ידנית",
          position: "top-center",
        });
        console.error('Failed to copy: ', err);
      });
  };

  const shareOnWhatsapp = () => {
    const message = encodeURIComponent(`היי! הצטרפי לאפליקציה החדשה שלי לניהול תורים והזמנות: https://${businessDomain}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const needsVerification = !isEmailVerified || !isPhoneVerified;

  return (
    <div className="text-center py-6 rtl" dir="rtl">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-2">
        ברוכה הבאה ל־Bellevo!
      </h3>
      
      <p className="text-lg mb-6">
        <span className="font-medium text-primary">{businessName}</span> מוכן לקבל לקוחות
      </p>

      <div className="bg-muted/30 rounded-lg p-6 mb-8 max-w-md mx-auto">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">כתובת האפליקציה:</span>
            <code className="bg-background px-2 py-1 rounded text-primary">{businessDomain}</code>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">מזהה עסק:</span>
            <code className="bg-background px-2 py-1 rounded">{businessId}</code>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 mb-8">
        <h4 className="font-medium">שתפי את האפליקציה שלך עם הלקוחות</h4>
        
        <div className="flex justify-center space-x-4">
          <Button 
            variant="outline" 
            className="space-x-2 gap-2 flex-row-reverse" 
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4" />
            <span>העתק קישור</span>
          </Button>
          
          <Button 
            onClick={shareOnWhatsapp}
            className="bg-[#25D366] hover:bg-[#128C7E] space-x-2 gap-2 flex-row-reverse"
          >
            <Whatsapp className="h-4 w-4" />
            <span>שתף בוואטסאפ</span>
          </Button>
        </div>
      </div>
      
      {needsVerification && (
        <Card className="mb-6 border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <h4 className="font-medium mb-2">כדי לשמור על אבטחתך, אמתי את הפרטים שלך</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {!isEmailVerified && "האימייל שלך טרם אומת. "}
              {!isPhoneVerified && "מספר הטלפון שלך טרם אומת."}
            </p>
            <Button 
              variant="outline" 
              className="border-yellow-400" 
              onClick={onResendVerification}
            >
              שלחי שוב אימות
            </Button>
          </CardContent>
        </Card>
      )}
      
      <div className="py-4">
        <Button variant="default" size="lg" className="w-full sm:w-auto">
          היכנסי ללוח הבקרה
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        הקלקיי כדי להתחיל לנהל את העסק שלך
      </p>
    </div>
  );
};

export default SuccessStep;
