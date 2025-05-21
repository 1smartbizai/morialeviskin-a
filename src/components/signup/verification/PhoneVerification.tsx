
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Phone, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

export interface PhoneVerificationProps {
  firstName: string;
  phone: string;
  isPhoneVerified: boolean;
  phoneSent: boolean;
  onPhoneSent: () => void;
  onPhoneVerified: () => void;
}

export const PhoneVerification = ({
  firstName,
  phone,
  isPhoneVerified,
  phoneSent,
  onPhoneSent,
  onPhoneVerified
}: PhoneVerificationProps) => {
  const { toast } = useToast();
  const { sendOTP } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [phoneVerificationSent, setPhoneVerificationSent] = useState(phoneSent);

  const handleSendPhoneVerification = async () => {
    if (!phone) {
      toast({
        variant: "destructive",
        title: "אין מספר טלפון",
        description: "לא ניתן לשלוח אימות לטלפון"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Format phone number if needed
      let formattedPhone = phone;
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('0')) {
          formattedPhone = `+972${formattedPhone.substring(1)}`;
        } else {
          formattedPhone = `+972${formattedPhone}`;
        }
      }
      
      const result = await sendOTP(formattedPhone);
      
      if (result.success) {
        toast({
          title: `${firstName}, נשלח לך קוד אימות`,
          description: "בדקי את ההודעות בטלפון שלך והזיני את הקוד שקיבלת"
        });
        
        setPhoneVerificationSent(true);
        onPhoneSent();
      } else {
        throw new Error(result.error || "שגיאה בשליחת קוד האימות");
      }
    } catch (error: any) {
      console.error("שגיאה בשליחת אימות טלפון:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בשליחת אימות לטלפון",
        description: error.message || "אנא נסי שוב מאוחר יותר"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!otpToken || !phone) {
      toast({
        variant: "destructive",
        title: "נתונים חסרים",
        description: "נא להזין את קוד האימות"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Format phone number if needed
      let formattedPhone = phone;
      if (!formattedPhone.startsWith('+')) {
        if (formattedPhone.startsWith('0')) {
          formattedPhone = `+972${formattedPhone.substring(1)}`;
        } else {
          formattedPhone = `+972${formattedPhone}`;
        }
      }
      
      // Call to supabase to verify the OTP
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otpToken,
        type: 'sms',
      });
      
      if (error) throw error;
      
      // Update the verification status
      onPhoneVerified();
      
      toast({
        title: `מצוין, ${firstName}!`,
        description: "מספר הטלפון אומת בהצלחה"
      });
    } catch (error: any) {
      console.error("שגיאה באימות מספר טלפון:", error);
      toast({
        variant: "destructive",
        title: "שגיאה באימות מספר הטלפון",
        description: error.message?.includes('expired') 
          ? "קוד האימות פג תוקף. אנא בקשי קוד חדש"
          : "קוד האימות שגוי. אנא נסי שנית"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          אימות מספר טלפון
        </CardTitle>
        <CardDescription>
          {isPhoneVerified ? 
            `מספר הטלפון ${phone} אומת בהצלחה` : 
            `אמתי את מספר הטלפון ${phone} על ידי הזנת קוד שישלח לך בהודעת SMS`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isPhoneVerified ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">מספר הטלפון אומת בהצלחה!</AlertTitle>
            <AlertDescription className="text-green-600">
              מצוין! מספר הטלפון {phone} אומת בהצלחה.
            </AlertDescription>
          </Alert>
        ) : phoneVerificationSent || phoneSent ? (
          <>
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">הזיני את קוד האימות</AlertTitle>
              <AlertDescription className="text-amber-600">
                שלחנו קוד בן 6 ספרות למספר {phone}. הקוד תקף למשך 10 דקות.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Input
                placeholder="הזיני את קוד האימות"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                className="text-center text-lg tracking-widest"
                dir="ltr"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleVerifyPhone}
                  disabled={isLoading || !otpToken}
                  className="flex-1"
                >
                  {isLoading ? "מאמת..." : "אמת קוד"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSendPhoneVerification}
                  disabled={isLoading}
                >
                  שלח קוד חדש
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">אימות טלפון אופציונלי</AlertTitle>
              <AlertDescription className="text-blue-600">
                אימות מספר הטלפון מאפשר יותר אבטחה ונוחות, אך אינו חובה בשלב זה.
              </AlertDescription>
            </Alert>
            <Button
              variant="secondary"
              onClick={handleSendPhoneVerification}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "שולח..." : "שלח קוד אימות לטלפון"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
