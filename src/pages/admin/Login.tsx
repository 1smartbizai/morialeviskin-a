
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// Define the form schema with validation
const loginSchema = z.object({
  email: z.string().email("כתובת אימייל אינה תקינה"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Business branding - In a real app, these would come from the database
  const businessLogo = "/placeholder.svg"; // Placeholder logo
  const businessName = "Bellevo";
  const businessPrimaryColor = "var(--primary)";

  // Initialize the form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        throw error;
      }

      if (data.user) {
        toast({
          title: "התחברת בהצלחה",
          description: "מעבר ללוח הבקרה...",
        });
        
        // Redirect to admin dashboard
        navigate("/admin");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Handle different error types
      const errorMessage = error.message === "Invalid login credentials"
        ? "פרטי התחברות לא נכונים"
        : "אירעה שגיאה בהתחברות, נסה שנית";
      
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות",
        description: errorMessage,
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
              התחברות לניהול העסק
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>סיסמה</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-2.5 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                        <Lock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link 
                  to="/admin/reset-password" 
                  className="text-sm text-primary hover:underline"
                >
                  שכחת סיסמה?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "מתחבר..." : "התחבר"}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                אין לך חשבון?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  הרשם עכשיו
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
