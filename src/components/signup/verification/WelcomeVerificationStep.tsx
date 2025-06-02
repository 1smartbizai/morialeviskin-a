
import { useState, useEffect } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "@/components/ui/use-toast";
import { CheckCircle2, Mail, MessageSquare, ArrowRight, Sparkles, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface WelcomeVerificationStepProps {
  onComplete: () => void;
}

const WelcomeVerificationStep = ({ onComplete }: WelcomeVerificationStepProps) => {
  const { signupData, updateSignupData } = useSignup();
  const [smsCode, setSmsCode] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);
  const [smsVerified, setSmsVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Send welcome email and SMS when component mounts
    sendWelcomeNotifications();
  }, []);

  const sendWelcomeNotifications = async () => {
    try {
      // Send welcome email with verification link
      await sendWelcomeEmail();
      setEmailSent(true);
      
      // Send SMS verification code
      await sendSMSVerification();
      setSmsSent(true);
      
      toast({
        title: `ברוכה הבאה, ${signupData.firstName}! 🎉`,
        description: "שלחנו לך אימות דוא\"ל והודעת SMS. אנא בדקי את ההודעות",
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
      toast({
        title: "שגיאה בשליחת האימותים",
        description: "אנא נסי שוב מאוחר יותר",
        variant: "destructive"
      });
    }
  };

  const sendWelcomeEmail = async () => {
    // This would integrate with your email service
    // The email should be marketing-oriented, colorful, and inviting
    console.log("Sending welcome email to:", signupData.email);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would call an edge function
    // that sends a beautifully designed email with:
    // - Welcome message with user's name
    // - Business setup verification link
    // - Marketing colors and branding
    // - Clear call-to-action button
  };

  const sendSMSVerification = async () => {
    // This would integrate with your SMS service
    console.log("Sending SMS verification to:", signupData.phone);
    
    // Generate verification code (in real implementation)
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Simulate SMS sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store the code securely (in real implementation)
    console.log("SMS verification code:", verificationCode);
  };

  const verifyEmailStatus = async () => {
    // Check if email was verified via the link
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email_confirmed_at) {
        setEmailVerified(true);
        updateSignupData({ isEmailVerified: true });
        return true;
      }
    } catch (error) {
      console.error("Error checking email verification:", error);
    }
    return false;
  };

  const verifySMSCode = async () => {
    if (!smsCode || smsCode.length !== 6) {
      toast({
        title: "קוד שגוי",
        description: `${signupData.firstName}, אנא הזיני קוד בן 6 ספרות`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // In real implementation, verify the code against stored value
      // For demo purposes, accept any 6-digit code
      if (/^\d{6}$/.test(smsCode)) {
        setSmsVerified(true);
        updateSignupData({ isPhoneVerified: true });
        
        toast({
          title: "מספר הטלפון אומת בהצלחה! ✅",
          description: `כל הכבוד ${signupData.firstName}, המערכת זיהתה אותך בהצלחה`,
        });
      } else {
        throw new Error("Invalid code format");
      }
    } catch (error) {
      toast({
        title: "קוד שגוי",
        description: `${signupData.firstName}, הקוד שהזנת אינו תקין. אנא בדקי שוב את ההודעה ונסי שוב`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendSMS = async () => {
    try {
      await sendSMSVerification();
      toast({
        title: "הודעה חדשה נשלחה",
        description: `${signupData.firstName}, שלחנו לך קוד חדש למספר ${signupData.phone}`,
      });
    } catch (error) {
      toast({
        title: "שגיאה בשליחה",
        description: "אנא נסי שוב מאוחר יותר",
        variant: "destructive"
      });
    }
  };

  const canProceed = () => {
    // Email verification is mandatory, SMS is recommended but not blocking
    return emailVerified;
  };

  const handleContinue = async () => {
    // Check email verification one more time
    const isEmailVerified = await verifyEmailStatus();
    
    if (!isEmailVerified) {
      toast({
        title: "נדרש אימות אימייל",
        description: `${signupData.firstName}, עליך לאמת את כתובת הדוא\"ל שלך כדי להמשיך בתהליך הקמת העסק`,
        variant: "destructive"
      });
      return;
    }

    if (!smsVerified) {
      toast({
        title: "המשך ללא אימות טלפון",
        description: `${signupData.firstName}, את ממשיכה ללא אימות מספר הטלפון. תוכלי לאמת אותו מאוחר יותר בהגדרות החשבון`,
      });
    }

    onComplete();
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto" dir="rtl">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-l from-purple-50 to-pink-50 border-primary/30">
        <CardHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-primary to-purple-600 rounded-full">
              <User className="h-12 w-12 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 animate-pulse" />
            ברוכה הבאה, {signupData.firstName}! 🎉
          </CardTitle>
          <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
            תודה שהצטרפת למשפחת Bellevo! 
            <br />
            אנחנו מאוד שמחים לקבל אותך ולהיות חלק מהמסע שלך לבניית עסק מצליח.
            <br />
            <span className="font-semibold text-primary">
              כדי להתחיל, בואי נוודא שכל הפרטים שלך מאומתים ומוכנים לשימוש.
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Verification Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Verification */}
        <Card className={`transition-all duration-300 ${emailVerified ? 'border-green-500 bg-green-50' : 'border-blue-500 bg-blue-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Mail className={`h-6 w-6 ${emailVerified ? 'text-green-600' : 'text-blue-600'}`} />
              אימות כתובת דוא״ל
              {emailVerified && <CheckCircle2 className="h-6 w-6 text-green-600" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {emailSent ? (
              <Alert className={emailVerified ? "border-green-200 bg-green-50" : "border-blue-200 bg-blue-50"}>
                <AlertDescription>
                  {emailVerified ? (
                    <div className="text-green-800">
                      <div className="font-bold">✅ כתובת הדוא״ל אומתה בהצלחה!</div>
                      <p>המערכת זיהתה שאימתת את כתובת הדוא״ל שלך.</p>
                    </div>
                  ) : (
                    <div className="text-blue-800">
                      <div className="font-bold">📧 אימייל נשלח בהצלחה!</div>
                      <p>שלחנו לך אימייל מעוצב ויפה לכתובת:</p>
                      <p className="font-mono text-sm bg-white px-2 py-1 rounded mt-2">{signupData.email}</p>
                      <p className="text-sm mt-2">
                        <span className="font-semibold">אנא בדקי את תיבת הדוא״ל שלך</span> ולחצי על הקישור לאימות.
                        <br />אל תשכחי לבדוק בתיקיית הספאם!
                      </p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>שולח אימייל...</p>
              </div>
            )}
            
            {!emailVerified && (
              <Button 
                variant="outline" 
                onClick={verifyEmailStatus}
                className="w-full border-blue-500 text-blue-700 hover:bg-blue-100"
              >
                בדוק אם אימתי את הדוא״ל
              </Button>
            )}
          </CardContent>
        </Card>

        {/* SMS Verification */}
        <Card className={`transition-all duration-300 ${smsVerified ? 'border-green-500 bg-green-50' : 'border-orange-500 bg-orange-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <MessageSquare className={`h-6 w-6 ${smsVerified ? 'text-green-600' : 'text-orange-600'}`} />
              אימות מספר טלפון
              {smsVerified && <CheckCircle2 className="h-6 w-6 text-green-600" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {smsSent ? (
              <>
                <Alert className={smsVerified ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
                  <AlertDescription>
                    {smsVerified ? (
                      <div className="text-green-800">
                        <div className="font-bold">✅ מספר הטלפון אומת בהצלחה!</div>
                        <p>כל הכבוד! המערכת זיהתה אותך בהצלחה.</p>
                      </div>
                    ) : (
                      <div className="text-orange-800">
                        <div className="font-bold">📱 הודעת SMS נשלחה!</div>
                        <p>שלחנו קוד אימות למספר:</p>
                        <p className="font-mono text-sm bg-white px-2 py-1 rounded mt-2">{signupData.phone}</p>
                        <p className="text-sm mt-2">הזיני את הקוד בן 6 הספרות שקיבלת:</p>
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
                
                {!smsVerified && (
                  <div className="space-y-3">
                    <Input
                      value={smsCode}
                      onChange={(e) => setSmsCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="הזיני קוד בן 6 ספרות"
                      className="text-center text-lg font-mono"
                      dir="ltr"
                      maxLength={6}
                    />
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={verifySMSCode}
                        disabled={smsCode.length !== 6 || isLoading}
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                      >
                        {isLoading ? "מאמת..." : "אמת קוד"}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={resendSMS}
                        className="border-orange-500 text-orange-700 hover:bg-orange-100"
                      >
                        שלח שוב
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>שולח הודעת SMS...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      <Card className="bg-gray-50">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">סטטוס אימות החשבון</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
            <div className={`p-4 rounded-lg ${emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="font-bold">דוא״ל</div>
              <div>{emailVerified ? '✅ אומת' : '❌ לא אומת'}</div>
            </div>
            <div className={`p-4 rounded-lg ${smsVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              <div className="font-bold">טלפון</div>
              <div>{smsVerified ? '✅ אומת' : '⏳ ממתין לאימות'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps Information */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <div className="space-y-2">
            <div className="font-bold">מה הלאה?</div>
            {canProceed() ? (
              <p>
                מעולה! {signupData.firstName}, כל הפרטים שלך מאומתים ואנחנו מוכנים להתחיל בתהליך הקמת העסק שלך.
                <br />
                <span className="font-semibold">החל מעכשיו כל המידע שתזיני יקושר למשתמש שלך</span> ותוכלי לנהל את המנוי והפרופיל שלך בכל עת.
              </p>
            ) : (
              <p>
                כדי להמשיך בתהליך הקמת העסק, עליך לאמת את כתובת הדוא״ל שלך.
                <br />אימות מספר הטלפון הוא אופציונלי אך מומלץ לאבטחה מקסימלית.
              </p>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {/* Continue Button */}
      <div className="text-center">
        <Button 
          onClick={handleContinue}
          disabled={!canProceed()}
          className="px-8 py-4 text-lg font-bold hover-scale bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          size="lg"
        >
          {canProceed() ? (
            <>
              התחל להקים את העסק שלך
              <ArrowRight className="h-5 w-5 mr-2" />
            </>
          ) : (
            'נדרש אימות דוא״ל להמשך'
          )}
        </Button>
        
        {canProceed() && (
          <p className="text-sm text-muted-foreground mt-3">
            🎉 {signupData.firstName}, בואי ניצור יחד את המותג הבא שלך!
          </p>
        )}
      </div>
    </div>
  );
};

export default WelcomeVerificationStep;
