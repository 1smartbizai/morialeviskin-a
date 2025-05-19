
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Mail, Phone, RefreshCw } from "lucide-react";
import { useSignup } from "@/contexts/SignupContext";
import { sendVerificationEmail } from "@/utils/signup/authUtils";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkUrlForVerification } from "@/utils/signup/authUtils";
import { supabase } from "@/integrations/supabase/client";

const otpSchema = z.object({
  otp: z.string().length(6, "נדרש קוד אימות בן 6 ספרות")
});

type OtpFormValues = z.infer<typeof otpSchema>;

const VerificationStep = () => {
  const { signupData, updateSignupData, session } = useSignup();
  const { sendOTP, verifyOTP } = useAuth();
  const [sendingEmailVerification, setSendingEmailVerification] = useState(false);
  const [sendingPhoneVerification, setSendingPhoneVerification] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  
  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: ""
    }
  });

  // Check for URL verification parameter on mount
  useEffect(() => {
    const checkVerification = async () => {
      // Check if URL indicates email verification was successful
      if (checkUrlForVerification()) {
        // Update the verification status
        updateSignupData({ isEmailVerified: true });
        
        // Remove the parameter from URL to prevent repeated state updates
        window.history.replaceState({}, document.title, window.location.pathname);
        
        toast({
          title: "אימות אימייל הצליח",
          description: "כתובת האימייל שלך אומתה בהצלחה!"
        });
      }
      
      // Check with Supabase if email is already verified
      if (session?.user) {
        try {
          const { data } = await supabase.auth.getUser();
          if (data?.user?.email_confirmed_at) {
            updateSignupData({ isEmailVerified: true });
          }
        } catch (error) {
          console.error("שגיאה בבדיקת סטטוס אימות:", error);
        }
      }
    };
    
    checkVerification();
  }, [session]);

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
      updateSignupData({ 
        verificationStep: {
          ...signupData.verificationStep,
          emailSent: true
        }
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
    if (!signupData.phone) {
      toast({
        variant: "destructive",
        title: "אין מספר טלפון זמין",
        description: "אירעה שגיאה בשליחת האימות. אנא נסי שנית מאוחר יותר."
      });
      return;
    }
    
    setSendingPhoneVerification(true);
    try {
      // Format phone with international code if not provided
      let formattedPhone = signupData.phone.trim();
      if (!formattedPhone.startsWith('+')) {
        // Assuming Israeli phone number if no country code provided
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+972' + formattedPhone.substring(1);
        } else {
          formattedPhone = '+972' + formattedPhone;
        }
      }
      
      const result = await sendOTP(formattedPhone);
      
      if (result.success) {
        toast({
          title: "הודעת אימות נשלחה",
          description: `הודעת אימות SMS נשלחה למספר ${signupData.phone}`,
        });
        
        updateSignupData({ 
          verificationStep: {
            ...signupData.verificationStep,
            phoneSent: true
          }
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("שגיאה בשליחת האימות:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בשליחת האימות",
        description: "אירעה שגיאה בשליחת האימות. אנא נסי שנית מאוחר יותר."
      });
    } finally {
      setSendingPhoneVerification(false);
    }
  };

  const handleVerifyOTP = async (values: OtpFormValues) => {
    if (!signupData.phone) {
      toast({
        variant: "destructive",
        title: "אין מספר טלפון זמין",
        description: "אירעה שגיאה באימות הקוד. אנא נסי שנית מאוחר יותר."
      });
      return;
    }
    
    setVerifyingOtp(true);
    try {
      // Format phone with international code if not provided
      let formattedPhone = signupData.phone.trim();
      if (!formattedPhone.startsWith('+')) {
        // Assuming Israeli phone number if no country code provided
        if (formattedPhone.startsWith('0')) {
          formattedPhone = '+972' + formattedPhone.substring(1);
        } else {
          formattedPhone = '+972' + formattedPhone;
        }
      }
      
      const result = await verifyOTP(formattedPhone, values.otp);
      
      if (result.success) {
        updateSignupData({ isPhoneVerified: true });
        toast({
          title: "אימות טלפון הצליח",
          description: "מספר הטלפון שלך אומת בהצלחה!"
        });
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "קוד שגוי",
          description: "הקוד שהוזן אינו תקין, נסי שוב"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה באימות הקוד",
        description: "אירעה שגיאה באימות הקוד. אנא נסי שנית."
      });
    } finally {
      setVerifyingOtp(false);
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
              {signupData.isPhoneVerified ? 
                "מספר הטלפון אומת בהצלחה" : 
                "נשלח אליך SMS לאימות מספר הטלפון שלך"}
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
              
              {!signupData.isPhoneVerified && !signupData.verificationStep.phoneSent && (
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
                    "שלח קוד אימות"
                  )}
                </Button>
              )}
              
              {!signupData.isPhoneVerified && signupData.verificationStep.phoneSent && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleVerifyOTP)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="otp"
                      render={({ field }) => (
                        <FormItem dir="rtl">
                          <FormLabel>קוד אימות</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="הזן קוד בן 6 ספרות" maxLength={6} dir="ltr" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between">
                      <Button
                        type="submit"
                        size="sm"
                        disabled={verifyingOtp || !form.formState.isValid}
                      >
                        {verifyingOtp ? "מאמת..." : "אמת קוד"}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleResendPhoneVerification}
                        disabled={sendingPhoneVerification}
                      >
                        שלח שוב
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/10 p-4 rounded-md">
        <h3 className="font-semibold">מה עכשיו?</h3>
        <p className="text-sm mt-1">
          {signupData.firstName}, אחרי שתאמתי את האימייל והטלפון שלך, תוכלי להמשיך בהקמת העסק.
          {!signupData.isEmailVerified && " יש לאמת את האימייל על ידי לחיצה על הקישור שנשלח אליך."}
          {!signupData.isPhoneVerified && signupData.isEmailVerified && " עכשיו נשאר רק לאמת את מספר הטלפון שלך."}
          {signupData.isEmailVerified && signupData.isPhoneVerified && " כל האימותים הושלמו בהצלחה! ניתן להמשיך בתהליך."}
        </p>
      </div>
    </div>
  );
};

export default VerificationStep;
