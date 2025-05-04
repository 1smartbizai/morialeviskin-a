
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// UI Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

// Define the form schema with validation
const resetSchema = z.object({
  email: z.string().email("כתובת אימייל אינה תקינה"),
});

type ResetFormValues = z.infer<typeof resetSchema>;

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { toast } = useToast();
  
  // Business branding - In a real app, these would come from the database
  const businessLogo = "/placeholder.svg"; // Placeholder logo
  const businessName = "Bellevo";
  const businessPrimaryColor = "var(--primary)";

  // Initialize the form
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: window.location.origin + "/admin/update-password",
      });
      
      if (error) {
        throw error;
      }

      // Mark as sent and show success message
      setResetSent(true);
      toast({
        title: "הוראות לאיפוס סיסמה נשלחו",
        description: "בדוק את תיבת הדואר האלקטרוני שלך",
      });
      
    } catch (error: any) {
      console.error("Reset password error:", error);
      
      toast({
        variant: "destructive",
        title: "שגיאה בשליחת הוראות איפוס",
        description: "אנא וודא שהזנת כתובת אימייל נכונה ונסה שנית",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 rtl">
      <Card className="w-full max-w-md mx-auto border border-muted">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center mb-6">
            <img 
              src={businessLogo} 
              alt={businessName} 
              className="h-16 w-16 mb-2" 
            />
            <h1 
              className="text-2xl font-semibold text-center"
              style={{ color: businessPrimaryColor }}
            >
              {businessName}
            </h1>
            <p className="text-muted-foreground text-center mt-1">
              איפוס סיסמה
            </p>
          </div>

          {resetSent ? (
            <div className="text-center space-y-4">
              <div className="rounded-full bg-green-100 text-green-800 p-3 inline-flex">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold">הוראות נשלחו בהצלחה!</h2>
              <p className="text-muted-foreground">
                שלחנו הוראות לאיפוס הסיסמה לכתובת האימייל שהזנת.
                אנא בדוק את תיבת הדואר האלקטרוני שלך ועקוב אחר ההוראות.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => setResetSent(false)}
              >
                שלח שוב
              </Button>
              <div className="pt-2">
                <Link to="/admin/login" className="text-primary hover:underline">
                  חזור למסך התחברות
                </Link>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  הזן את כתובת האימייל שלך ואנו נשלח לך קישור לאיפוס הסיסמה.
                </p>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>אימייל</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="your@email.com" 
                            {...field} 
                            disabled={isLoading}
                            className="pr-10"
                          />
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
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
                  {isLoading ? "שולח..." : "שלח הוראות איפוס"}
                </Button>
                
                <div className="text-center text-sm mt-4">
                  <Link to="/admin/login" className="text-primary hover:underline">
                    חזור למסך התחברות
                  </Link>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
