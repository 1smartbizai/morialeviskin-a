
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const consentSchema = z.object({
  terms: z.boolean().refine((value) => value === true, {
    message: "חובה להסכים לתנאי השימוש כדי להמשיך",
  }),
  marketing: z.boolean().optional(),
});

type ConsentFormValues = z.infer<typeof consentSchema>;

interface ConsentStepProps {
  userData: {
    first_name: string;
    last_name: string;
    birthdate: string;
    skin_goals: string;
    photo_url?: string;
  };
  onSubmit: () => void;
}

const ConsentStep = ({ userData, onSubmit }: ConsentStepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<ConsentFormValues>({
    resolver: zodResolver(consentSchema),
    defaultValues: {
      terms: false,
      marketing: false,
    },
  });

  const handleSubmit = async (values: ConsentFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "נא להתחבר מחדש ולנסות שוב",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Save user data to database
      const { error } = await supabase.from("clients").upsert({
        user_id: user.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: user.phone || "",
        birthdate: userData.birthdate || null,
        skin_goals: userData.skin_goals || null,
        photo_url: userData.photo_url || null,
        terms_accepted: values.terms,
        marketing_consent: values.marketing || false,
        status: "new_lead",
      });

      if (error) throw error;

      toast({
        title: "ההרשמה הושלמה בהצלחה!",
        description: "ברוכים הבאים לפורטל הלקוחות",
      });
      
      onSubmit();
    } catch (error: any) {
      console.error("Error saving user data:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בשמירת הנתונים",
        description: error.message || "אנא נסו שוב",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" dir="rtl">
        <div className="text-center mb-6">
          <p className="text-muted-foreground">כמעט סיימנו! אנא אשרו את ההסכמות הבאות:</p>
        </div>

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none mr-3">
                <FormDescription className="text-foreground">
                  אני מסכימ/ה ל<a href="#" className="underline">תנאי השימוש</a> ול<a href="#" className="underline">מדיניות הפרטיות</a> של האתר
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="marketing"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none mr-3">
                <FormDescription>
                  אני מעוניינ/ת לקבל עדכונים ומבצעים בדוא"ל ובהודעות SMS
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !form.watch("terms")}
        >
          {isLoading ? "שומר..." : "סיום הרשמה"}
        </Button>
      </form>
    </Form>
  );
};

export default ConsentStep;
