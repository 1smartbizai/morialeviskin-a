
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSignup } from "@/contexts/SignupContext";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Mail, Phone, AlertTriangle } from "lucide-react";
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

const VerificationStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const { user, sendOTP } = useAuth();
  const { toast } = useToast();
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingPhone, setIsLoadingPhone] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [phoneVerificationSent, setPhoneVerificationSent] = useState(false);

  // Check email verification status on component mount
  useEffect(() => {
    if (user?.email_confirmed_at) {
      updateSignupData({ isEmailVerified: true });
    }
  }, [user, updateSignupData]);

  const handleSendEmailVerification = async () => {
    if (!signupData.email) {
      toast({
        variant: "destructive",
        title: "אין כתובת דוא״ל",
        description: "לא ניתן לשלוח אימות דוא״ל"
      });
      return;
    }
    
    setIsLoadingEmail(true);
    try {
      // Using type assertion here to satisfy TypeScript
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: signupData.email,
      });
      
      if (error) throw error;
      
      toast({
        title: `${signupData.firstName}, נשלח לך אימייל אימות חדש`,
        description: "בדקי את תיבת הדואר שלך (כולל ספאם) ולחצי על הקישור כדי לאמת את החשבון"
      });
      
      // Update verification step state
      updateSignupData({
        verificationStep: {
          ...signupData.verificationStep,
          emailSent: true
        }
      });
    } catch (error: any) {
      console.error("שגיאה בשליחת אימות דוא״ל:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בשליחת אימות דוא״ל",
        description: error.message || "אנא נסי שוב מאוחר יותר"
      });
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const handleSendPhoneVerification = async () => {
    if (!signupData.phone) {
      toast({
        variant: "destructive",
        title: "אין מספר טלפון",
        description: "לא ניתן לשלוח אימות לטלפון"
      });
      return;
    }
    
    setIsLoadingPhone(true);
    try {
      // Format phone number if needed
      let formattedPhone = signupData.phone;
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
          title: `${signupData.firstName}, נשלח לך קוד אימות`,
          description: "בדקי את ההודעות בטלפון שלך והזיני את הקוד שקיבלת"
        });
        
        setPhoneVerificationSent(true);
        
        // Update verification step state
        updateSignupData({
          verificationStep: {
            ...signupData.verificationStep,
            phoneSent: true
          }
        });
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
      setIsLoadingPhone(false);
    }
  };

  const handleVerifyPhone = async () => {
    if (!otpToken || !signupData.phone) {
      toast({
        variant: "destructive",
        title: "נתונים חסרים",
        description: "נא להזין את קוד האימות"
      });
      return;
    }
    
    setIsLoadingPhone(true);
    try {
      // Format phone number if needed
      let formattedPhone = signupData.phone;
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
      
      // Update the verification status in the signup data
      updateSignupData({ isPhoneVerified: true });
      
      toast({
        title: `מצוין, ${signupData.firstName}!`,
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
      setIsLoadingPhone(false);
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">אימות חשבון</h2>
        <p className="text-sm text-muted-foreground">
          {signupData.firstName}, לפני שנמשיך בתהליך ההרשמה, אנא אמתי את הפרטים שלך.
          <br />
          האימות עוזר לנו להבטיח את אבטחת החשבון שלך.
        </p>
      </div>

      {/* Email Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            אימות כתובת דוא״ל
          </CardTitle>
          <CardDescription>
            בדקי את תיבת הדוא״ל שלך בכתובת <strong>{signupData.email}</strong> וודאי שלחצת על הקישור שנשלח אליך
          </CardDescription>
        </CardHeader>
        <CardContent>
          {signupData.isEmailVerified ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">כתובת הדוא״ל אומתה בהצלחה!</AlertTitle>
              <AlertDescription className="text-green-600">
                תודה, {signupData.firstName}! כתובת הדוא״ל {signupData.email} אומתה בהצלחה.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">נדרש אימות דוא״ל</AlertTitle>
              <AlertDescription className="text-amber-600">
                {signupData.verificationStep.emailSent ? 
                  `היי ${signupData.firstName}, שלחנו לך אימייל לכתובת ${signupData.email}. אנא לחצי על הקישור שבאימייל כדי להמשיך.` : 
                  "לחצי על הכפתור למטה לשליחת אימייל אימות"}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          {!signupData.isEmailVerified && (
            <Button
              onClick={handleSendEmailVerification}
              disabled={isLoadingEmail}
              className="w-full"
            >
              {isLoadingEmail ? "שולח..." : (signupData.verificationStep.emailSent ? "שלח שוב" : "שלח אימייל אימות")}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Phone Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            אימות מספר טלפון
          </CardTitle>
          <CardDescription>
            {signupData.isPhoneVerified ? 
              `מספר הטלפון ${signupData.phone} אומת בהצלחה` : 
              `אמתי את מספר הטלפון ${signupData.phone} על ידי הזנת קוד שישלח לך בהודעת SMS`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {signupData.isPhoneVerified ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">מספר הטלפון אומת בהצלחה!</AlertTitle>
              <AlertDescription className="text-green-600">
                מצוין! מספר הטלפון {signupData.phone} אומת בהצלחה.
              </AlertDescription>
            </Alert>
          ) : phoneVerificationSent ? (
            <>
              <Alert className="bg-amber-50 border-amber-200">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">הזיני את קוד האימות</AlertTitle>
                <AlertDescription className="text-amber-600">
                  שלחנו קוד בן 6 ספרות למספר {signupData.phone}. הקוד תקף למשך 10 דקות.
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
                    disabled={isLoadingPhone || !otpToken}
                    className="flex-1"
                  >
                    {isLoadingPhone ? "מאמת..." : "אמת קוד"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSendPhoneVerification}
                    disabled={isLoadingPhone}
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
                disabled={isLoadingPhone}
                className="w-full"
              >
                {isLoadingPhone ? "שולח..." : "שלח קוד אימות לטלפון"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          {signupData.isEmailVerified ? 
            <span className="text-green-700">כתובת הדוא״ל אומתה בהצלחה! </span> : 
            <span className="text-red-700">נדרש אימות של כתובת הדוא״ל כדי להמשיך. </span>}
          {signupData.isPhoneVerified ? 
            <span className="text-green-700">מספר הטלפון אומת בהצלחה! </span> : 
            <span className="text-amber-700">אימות מספר הטלפון אינו חובה בשלב זה. </span>}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default VerificationStep;
