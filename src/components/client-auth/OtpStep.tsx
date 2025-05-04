
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";

const otpSchema = z.object({
  otp: z.string().min(6, "נדרש קוד בן 6 ספרות").max(6),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpStepProps {
  phone: string;
  onVerified: (isNewUser: boolean) => void;
  onBack: () => void;
}

const OtpStep = ({ phone, onVerified, onBack }: OtpStepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { verifyOTP, sendOTP } = useAuth();
  const { toast } = useToast();

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const handleSubmit = async (values: OtpFormValues) => {
    setIsLoading(true);
    try {
      const result = await verifyOTP(phone, values.otp);
      if (result.success) {
        toast({
          title: "אימות בוצע בהצלחה",
        });
        onVerified(!!result.isNewUser);
      } else {
        toast({
          variant: "destructive",
          title: "קוד שגוי",
          description: "הקוד שהוזן אינו תקין, נסו שוב",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן לאמת את הקוד, נסו שוב",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const result = await sendOTP(phone);
      if (result.success) {
        toast({
          title: "קוד חדש נשלח",
          description: "בדקו את ההודעות בטלפון שלכם",
        });
      } else {
        toast({
          variant: "destructive",
          title: "שגיאה",
          description: "לא ניתן לשלוח קוד חדש, נסו שוב מאוחר יותר",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן לשלוח קוד חדש, נסו שוב מאוחר יותר",
      });
    } finally {
      setResendLoading(false);
    }
  };

  // Auto-submit when OTP is complete
  const handleOTPComplete = (value: string) => {
    if (value.length === 6) {
      form.setValue("otp", value);
      form.handleSubmit(handleSubmit)();
    }
  };

  // Format phone for display
  const displayPhone = phone.replace(/^\+972/, '0');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="text-center mb-6">
          <p className="text-muted-foreground">
            הזינו את הקוד שנשלח למספר {displayPhone}
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4">
          <InputOTP
            maxLength={6}
            value={form.watch("otp")}
            onChange={(value) => {
              form.setValue("otp", value);
              handleOTPComplete(value);
            }}
            dir="ltr"
          >
            <InputOTPGroup className="gap-2">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <div className="flex flex-col space-y-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || form.watch("otp").length !== 6}
          >
            {isLoading ? "מאמת..." : "אמת קוד"}
          </Button>
          
          <div className="flex justify-between items-center mt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-sm"
            >
              <ArrowRight className="h-4 w-4 ml-1" /> חזרה לשינוי מספר
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="text-sm"
            >
              {resendLoading ? "שולח..." : "שלח קוד חדש"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default OtpStep;
