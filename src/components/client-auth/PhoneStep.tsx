
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Phone } from "lucide-react";

const phoneSchema = z.object({
  phone: z.string().min(10, "מספר טלפון לא תקין").max(15),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

interface PhoneStepProps {
  onSubmit: (phone: string) => void;
}

const PhoneStep = ({ onSubmit }: PhoneStepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { sendOTP } = useAuth();
  const { toast } = useToast();

  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phone: "",
    },
  });

  const handleSubmit = async (values: PhoneFormValues) => {
    setIsLoading(true);
    try {
      // Format phone with international code if not provided
      let formattedPhone = values.phone.trim();
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
          title: "נשלח קוד אימות",
          description: "בדקו את ההודעות בטלפון שלכם",
        });
        onSubmit(formattedPhone);
      } else {
        toast({
          variant: "destructive",
          title: "שגיאה",
          description: result.error || "לא ניתן לשלוח קוד אימות, נסו שוב",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן לשלוח קוד אימות, נסו שוב",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="text-center mb-6">
          <p className="text-muted-foreground">הכניסו את מספר הטלפון שלכם ונשלח לכם קוד אימות</p>
        </div>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem dir="rtl">
              <FormLabel>מספר טלפון</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    placeholder="הכניסו את מספר הטלפון שלכם"
                    type="tel"
                    autoComplete="tel"
                    className="text-right"
                    dir="ltr"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "שולח..." : "שלח קוד אימות"}
        </Button>
      </form>
    </Form>
  );
};

export default PhoneStep;
