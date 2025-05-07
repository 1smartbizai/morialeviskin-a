
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import PersonalInfoStep from "@/components/signup/PersonalInfoStep";
import VisualIdentityStep from "@/components/signup/VisualIdentityStep";
import BrandSettingsStep from "@/components/signup/BrandSettingsStep";
import PaymentStep from "@/components/signup/PaymentStep";
import WorkingHoursStep from "@/components/signup/WorkingHoursStep";
import SuccessStep from "@/components/signup/SuccessStep";

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  businessName: string;
  logo?: File;
  logoUrl?: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  headingTextColor: string;
  bodyTextColor: string;
  actionTextColor: string;
  buttonBgColor1: string;
  buttonBgColor2: string;
  buttonTextColor1: string;
  buttonTextColor2: string;
  brandTone: string;
  subscriptionLevel: string;
  workingHours: {
    [key: string]: {
      active: boolean;
      start: string;
      end: string;
    };
  };
  googleCalendarConnected: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  businessDomain?: string;
  businessId?: string;
}

const steps = [
  { id: 'personal', title: 'פרטים אישיים' },
  { id: 'visual', title: 'זהות ויזואלית' },
  { id: 'brand', title: 'הגדרות מותג' },
  { id: 'payment', title: 'מנוי' },
  { id: 'hours', title: 'שעות פעילות' },
  { id: 'success', title: 'סיום' }
];

const BusinessOwnerSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [signupData, setSignupData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    primaryColor: "#6A0DAD", // Default purple
    accentColor: "#5AA9E6", // Default blue
    backgroundColor: "#FFFFFF",
    headingTextColor: "#1A1F2C",
    bodyTextColor: "#333333",
    actionTextColor: "#FFFFFF",
    buttonBgColor1: "#6A0DAD",
    buttonBgColor2: "#8B5CF6",
    buttonTextColor1: "#FFFFFF",
    buttonTextColor2: "#FFFFFF",
    brandTone: "professional",
    subscriptionLevel: "starter",
    workingHours: {
      monday: { active: true, start: "09:00", end: "17:00" },
      tuesday: { active: true, start: "09:00", end: "17:00" },
      wednesday: { active: true, start: "09:00", end: "17:00" },
      thursday: { active: true, start: "09:00", end: "17:00" },
      friday: { active: true, start: "09:00", end: "17:00" },
      saturday: { active: false, start: "10:00", end: "14:00" },
      sunday: { active: false, start: "10:00", end: "14:00" },
    },
    googleCalendarConnected: false,
    isEmailVerified: false,
    isPhoneVerified: false,
    businessDomain: "",
    businessId: "",
  });

  // Check for existing session on component mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        // Try to load existing signup data if available
        loadSavedSignupData(data.session.user.id);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        // If we get a new session, try to load saved data
        if (newSession && event === 'SIGNED_IN') {
          loadSavedSignupData(newSession.user.id);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  // Load any saved signup data
  const loadSavedSignupData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('business_owners')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        // No data yet, that's ok for new users
        console.log('No existing signup data found');
        return;
      }
      
      if (data) {
        // Pre-populate our form with saved data
        setSignupData(prev => ({
          ...prev,
          firstName: data.first_name || prev.firstName,
          lastName: data.last_name || prev.lastName,
          phone: data.phone || prev.phone,
          businessName: data.business_name || prev.businessName,
          primaryColor: data.primary_color || prev.primaryColor,
          accentColor: data.accent_color || prev.accentColor,
          backgroundColor: data.backgroundColor || prev.backgroundColor,
          headingTextColor: data.headingTextColor || prev.headingTextColor,
          bodyTextColor: data.bodyTextColor || prev.bodyTextColor,
          actionTextColor: data.actionTextColor || prev.actionTextColor,
          buttonBgColor1: data.buttonBgColor1 || prev.buttonBgColor1,
          buttonBgColor2: data.buttonBgColor2 || prev.buttonBgColor2,
          buttonTextColor1: data.buttonTextColor1 || prev.buttonTextColor1,
          buttonTextColor2: data.buttonTextColor2 || prev.buttonTextColor2,
          brandTone: data.brandTone || prev.brandTone,
          subscriptionLevel: data.subscription_level || prev.subscriptionLevel,
          logoUrl: data.logo_url || prev.logoUrl,
          workingHours: data.working_hours || prev.workingHours,
          googleCalendarConnected: data.google_calendar_connected || prev.googleCalendarConnected,
          isEmailVerified: data.isEmailVerified || prev.isEmailVerified,
          isPhoneVerified: data.isPhoneVerified || prev.isPhoneVerified,
        }));
        
        // Generate business domain and ID if we don't have them yet
        if (!signupData.businessDomain) {
          const domain = `bellevo.app/${data.business_name.toLowerCase().replace(/\s+/g, '-')}`;
          const id = `BIZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          
          setSignupData(prev => ({
            ...prev,
            businessDomain: domain,
            businessId: id,
          }));
        }
      }
    } catch (err) {
      console.error('Error loading saved signup data:', err);
    }
  };

  // Save signup data after each step
  const saveSignupData = async () => {
    if (!session?.user?.id) {
      console.log('No user ID available to save data');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For Personal Info step
      if (currentStep === 0) {
        // This gets saved when creating the user in handleNext
        return;
      } 
      // For Visual Identity and Brand Settings steps
      else if (currentStep === 1 || currentStep === 2) {
        const { error } = await supabase
          .from('business_owners')
          .upsert({
            user_id: session.user.id,
            first_name: signupData.firstName,
            last_name: signupData.lastName,
            phone: signupData.phone,
            business_name: signupData.businessName,
            logo_url: signupData.logoUrl,
            primary_color: signupData.primaryColor,
            accent_color: signupData.accentColor,
            backgroundColor: signupData.backgroundColor,
            headingTextColor: signupData.headingTextColor,
            bodyTextColor: signupData.bodyTextColor,
            actionTextColor: signupData.actionTextColor,
            buttonBgColor1: signupData.buttonBgColor1,
            buttonBgColor2: signupData.buttonBgColor2,
            buttonTextColor1: signupData.buttonTextColor1,
            buttonTextColor2: signupData.buttonTextColor2,
            brandTone: signupData.brandTone,
          });
          
        if (error) throw error;
      }
      // For Payment step
      else if (currentStep === 3) {
        const { error } = await supabase
          .from('business_owners')
          .update({
            subscription_active: true,
            subscription_level: signupData.subscriptionLevel,
            subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq('user_id', session.user.id);
          
        if (error) throw error;
      }
      // For Working Hours step
      else if (currentStep === 4) {
        const { error } = await supabase
          .from('business_owners')
          .update({
            working_hours: signupData.workingHours,
            google_calendar_connected: signupData.googleCalendarConnected,
          })
          .eq('user_id', session.user.id);
          
        if (error) throw error;
      }
    } catch (error: any) {
      toast.error("שגיאה בשמירת הנתונים", {
        description: error.message
      });
      console.error('Error saving signup data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    setIsLoading(true);
    
    try {
      // If this is the first step, we need to create the account
      if (currentStep === 0) {
        // Check if we already have a session
        if (!session) {
          // Create user in Supabase Auth
          const { data, error } = await supabase.auth.signUp({
            email: signupData.email,
            password: signupData.password,
            options: {
              data: {
                first_name: signupData.firstName,
                last_name: signupData.lastName,
              }
            }
          });

          if (error) throw error;
          
          // At this point we should have a session
          if (data.session) {
            setSession(data.session);
            
            // Initialize business owner record
            const { error: businessError } = await supabase
              .from('business_owners')
              .insert({
                user_id: data.user!.id,
                first_name: signupData.firstName,
                last_name: signupData.lastName,
                phone: signupData.phone,
                business_name: signupData.businessName || `${signupData.firstName}'s Business`,
              });
              
            if (businessError) throw businessError;
          } else {
            // This might happen if email confirmation is required
            toast.info("נשלח אליך אימות בדוא\"ל", {
              description: "אנא אמתי את חשבונך כדי להמשיך"
            });
          }
        }
        
        // Generate a business domain based on business name
        const domain = `bellevo.app/${signupData.businessName.toLowerCase().replace(/\s+/g, '-')}`;
        const id = `BIZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        setSignupData(prev => ({
          ...prev,
          businessDomain: domain,
          businessId: id,
        }));
        
        // Auto-send verification emails
        if (session?.user?.id) {
          await supabase.auth.resetPasswordForEmail(signupData.email);
          toast.info("נשלח אימות דוא\"ל", {
            description: "אנא בדקי את תיבת הדואר שלך לקישור אימות"
          });
        }
      } 
      // If this is the second step (visual identity), we upload the logo
      else if (currentStep === 1 && signupData.logo) {
        if (!session?.user?.id) {
          throw new Error("אינך מחוברת למערכת, נא להתחבר שנית");
        }
        
        const fileExt = signupData.logo.name.split('.').pop();
        const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('logos')
          .upload(filePath, signupData.logo);
        
        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('logos')
          .getPublicUrl(filePath);
          
        setSignupData({
          ...signupData,
          logoUrl: publicUrl
        });
      } 
      
      // If we're on the final step, complete all the setup
      if (currentStep === 5) {
        // Navigate to dashboard
        navigate('/admin');
      } else {
        // Save current step data
        await saveSignupData();
        
        // Move to next step
        setCurrentStep(currentStep + 1);
      }
    } catch (error: any) {
      toast.error("שגיאה בתהליך ההרשמה", {
        description: error.message
      });
      console.error('Error in signup process:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }));
  };
  
  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(signupData.email);
      toast.success("נשלחה בקשת אימות חדשה", {
        description: "בדקי את תיבת הדואר האלקטרוני שלך"
      });
    } catch (error: any) {
      toast.error("שגיאה בשליחת האימות", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep data={signupData} updateData={updateSignupData} />;
      case 1:
        return <VisualIdentityStep data={signupData} updateData={updateSignupData} />;
      case 2:
        return <BrandSettingsStep data={signupData} updateData={updateSignupData} />;
      case 3:
        return <PaymentStep data={signupData} updateData={updateSignupData} />;
      case 4:
        return <WorkingHoursStep data={signupData} updateData={updateSignupData} />;
      case 5:
        return (
          <SuccessStep 
            businessName={signupData.businessName} 
            businessDomain={signupData.businessDomain}
            businessId={signupData.businessId}
            isEmailVerified={signupData.isEmailVerified}
            isPhoneVerified={signupData.isPhoneVerified}
            onResendVerification={handleResendVerification}
          />
        );
      default:
        return <PersonalInfoStep data={signupData} updateData={updateSignupData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Bellevo</h1>
          <p className="text-muted-foreground mt-2">הפלטפורמה שמעצימה את העסק שלך</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>
              שלב {currentStep + 1} מתוך {steps.length}
            </CardDescription>
            <div className="flex space-x-2 mt-4">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isLoading}
                className="flex-row-reverse"
              >
                חזרה <ChevronLeft className="mr-2 h-4 w-4" />
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={isLoading}
                className="flex-row-reverse"
              >
                {currentStep === steps.length - 1 ? (
                  'היכנסי ללוח הבקרה'
                ) : (
                  <>
                    המשך <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessOwnerSignup;
