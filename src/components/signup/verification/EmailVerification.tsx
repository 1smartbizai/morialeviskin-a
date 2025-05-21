
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSignup } from "@/contexts/SignupContext";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Mail } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export interface EmailVerificationProps {
  firstName: string;
  email: string;
  isEmailVerified: boolean;
  emailSent: boolean;
  onEmailSent: () => void;
}

export const EmailVerification = ({
  firstName,
  email,
  isEmailVerified,
  emailSent,
  onEmailSent
}: EmailVerificationProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmailVerification = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "אין כתובת דוא״ל",
        description: "לא ניתן לשלוח אימות דוא״ל"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      toast({
        title: `${firstName}, נשלח לך אימייל אימות חדש`,
        description: "בדקי את תיבת הדואר שלך (כולל ספאם) ולחצי על הקישור כדי לאמת את החשבון"
      });
      
      onEmailSent();
    } catch (error: any) {
      console.error("שגיאה בשליחת אימות דוא״ל:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בשליחת אימות דוא״ל",
        description: error.message || "אנא נסי שוב מאוחר יותר"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          אימות כתובת דוא״ל
        </CardTitle>
        <CardDescription>
          בדקי את תיבת הדוא״ל שלך בכתובת <strong>{email}</strong> וודאי שלחצת על הקישור שנשלח אליך
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEmailVerified ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertTitle className="text-green-700">כתובת הדוא״ל אומתה בהצלחה!</AlertTitle>
            <AlertDescription className="text-green-600">
              תודה, {firstName}! כתובת הדוא״ל {email} אומתה בהצלחה.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle className="text-amber-700">נדרש אימות דוא״ל</AlertTitle>
            <AlertDescription className="text-amber-600">
              {emailSent ? 
                `היי ${firstName}, שלחנו לך אימייל לכתובת ${email}. אנא לחצי על הקישור שבאימייל כדי להמשיך.` : 
                "לחצי על הכפתור למטה לשליחת אימייל אימות"}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        {!isEmailVerified && (
          <Button
            onClick={handleSendEmailVerification}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "שולח..." : (emailSent ? "שלח שוב" : "שלח אימייל אימות")}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
