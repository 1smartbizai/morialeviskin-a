
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Mail, Phone, RefreshCw } from "lucide-react";
import { useSignup } from "@/contexts/SignupContext";
import { sendVerificationEmail } from "@/utils/signup/authUtils";

const VerificationStep = () => {
  const { toast } = useToast();
  const { signupData } = useSignup();
  const [sendingEmailVerification, setSendingEmailVerification] = useState(false);
  const [sendingPhoneVerification, setSendingPhoneVerification] = useState(false);

  const handleResendEmailVerification = async () => {
    if (!signupData.email) {
      toast({
        variant: "destructive",
        title: "אין כתובת דוא\"ל זמינה",
        description: "אירעה שגיאה בשליחת האימות. אנא נסי שנית מאוחר יותר."
      });
      return;
    }

    setSendingEmailVerification(true);
    try {
      await sendVerificationEmail(signupData.email);
      toast({
        title: "הודעת אימות נשלחה",
        description: `הודעת אימות נשלחה לכתובת ${signupData.email}`,
      });
    } catch (error) {
      console.error("שגיאה בשליחת האימות:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בשליחת האימות",
        description: "אירעה שגיאה בשליחת האימות. אנא נסי שנית מאוחר יותר."
      });
    } finally {
      setSendingEmailVerification(false);
    }
  };

  const handleResendPhoneVerification = async () => {
    // This would be implemented with a real SMS service
    setSendingPhoneVerification(true);
    try {
      // Simulate an API call to send SMS verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "הודעת אימות נשלחה",
        description: `הודעת אימות SMS נשלחה למספר ${signupData.phone}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה בשליחת האימות",
        description: "אירעה שגיאה בשליחת האימות. אנא נסי שנית מאוחר יותר."
      });
    } finally {
      setSendingPhoneVerification(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">שלום {signupData.firstName}!</h2>
        <p className="mt-2 text-muted-foreground">
          החשבון שלך נוצר בהצלחה! כעת עלייך לאמת את כתובת האימייל ומספר הטלפון שלך כדי להמשיך בהקמת העסק.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" /> אימות אימייל
            </CardTitle>
            <CardDescription>
              נשלח לך דוא״ל עם קישור לאימות כתובת האימייל שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm">
                <span>{signupData.email}</span>
                {signupData.isEmailVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : null}
              </div>
              
              {!signupData.isEmailVerified && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleResendEmailVerification}
                  disabled={sendingEmailVerification}
                >
                  {sendingEmailVerification ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      שולח...
                    </>
                  ) : (
                    "שלח אימות שוב"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" /> אימות טלפון
            </CardTitle>
            <CardDescription>
              נשלח אליך SMS לאימות מספר הטלפון שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm">
                <span>{signupData.phone}</span>
                {signupData.isPhoneVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : null}
              </div>
              
              {!signupData.isPhoneVerified && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleResendPhoneVerification}
                  disabled={sendingPhoneVerification}
                >
                  {sendingPhoneVerification ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      שולח...
                    </>
                  ) : (
                    "שלח אימות שוב"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/10 p-4 rounded-md">
        <h3 className="font-semibold">מה עכשיו?</h3>
        <p className="text-sm mt-1">
          {signupData.firstName}, אחרי שתאמתי את האימייל שלך, תועברי בחזרה למסך הכניסה.
          לאחר הכניסה מחדש, תוכלי להמשיך בהקמת העסק שלך.
        </p>
      </div>
    </div>
  );
};

export default VerificationStep;
