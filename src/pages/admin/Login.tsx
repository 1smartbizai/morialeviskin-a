import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
import { Eye, EyeOff, Mail, Lock, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { GoogleIcon } from "@/components/icons/GoogleIcon";
import { Separator } from "@/components/ui/separator";

// Define the form schema with validation
const loginSchema = z.object({
  email: z.string().email("כתובת אימייל אינה תקינה"),
  password: z.string().min(6, "סיסמה חייבת להכיל לפחות 6 תווים"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { loginWithGoogle } = useAuth();
  
  // Business branding - In a real app, these would come from the database
  const businessLogo = "/placeholder.svg"; // Placeholder logo
  const businessName = "Bellevo";
  const businessPrimaryColor = "var(--primary)";

  // Check for verified parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const verified = params.get('verified') === 'true';
    
    if (verified) {
      setIsVerified(true);
      // Clean up URL without reloading the page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

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

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.error("Google login error:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות עם Google",
        description: "אירעה שגיאה בתהליך ההתחברות, נסה שנית"
      });
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
          
          {isVerified && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-600">האימייל שלך אומת בהצלחה!</AlertTitle>
              <AlertDescription>
                כעת אפשר להתחבר ולהמשיך בתהליך הקמת העסק.
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              <GoogleIcon className="h-5 w-5" />
              המשך עם Google
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                או התחבר עם אימייל וסיסמה
              </span>
            </div>
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
