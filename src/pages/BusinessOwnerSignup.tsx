import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import PersonalInfoStep from "@/components/signup/PersonalInfoStep";
import VisualIdentityStep from "@/components/signup/VisualIdentityStep";
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
  subscriptionLevel: string;
  workingHours: {
    [key: string]: {
      active: boolean;
      start: string;
      end: string;
    };
  };
  googleCalendarConnected: boolean;
}

const steps = [
  { id: 'personal', title: 'Personal Info' },
  { id: 'visual', title: 'Brand Identity' },
  { id: 'payment', title: 'Subscription' },
  { id: 'hours', title: 'Working Hours' },
  { id: 'success', title: 'All Done!' }
];

const BusinessOwnerSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [signupData, setSignupData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    businessName: "",
    primaryColor: "#6A0DAD", // Default purple
    accentColor: "#5AA9E6", // Default blue
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
  });

  const handleNext = async () => {
    // If this is the first step, we need to create the account
    if (currentStep === 0) {
      setIsLoading(true);
      try {
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

        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        toast.error("Error creating account", {
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    } 
    // If this is the second step (visual identity), we upload the logo
    else if (currentStep === 1 && signupData.logo) {
      setIsLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        
        if (!userId) {
          throw new Error("You must be logged in to continue");
        }
        
        const fileExt = signupData.logo.name.split('.').pop();
        const filePath = `${userId}/${Date.now()}.${fileExt}`;
        
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
        
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        toast.error("Error uploading logo", {
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    } 
    // If this is the payment step
    else if (currentStep === 2) {
      // In a real app, this is where you'd integrate with Tranzila
      // For now, we'll just simulate a successful payment
      setIsLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        
        if (!userId) {
          throw new Error("You must be logged in to continue");
        }
        
        // Insert or update business owner record with all the info collected so far
        const { error } = await supabase
          .from('business_owners')
          .upsert({
            user_id: userId,
            first_name: signupData.firstName,
            last_name: signupData.lastName,
            phone: signupData.phone,
            business_name: signupData.businessName,
            logo_url: signupData.logoUrl,
            primary_color: signupData.primaryColor,
            accent_color: signupData.accentColor,
            subscription_active: true,
            subscription_level: signupData.subscriptionLevel,
            subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          });
          
        if (error) throw error;
        
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        toast.error("Error processing payment", {
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    } 
    // If this is the working hours step
    else if (currentStep === 3) {
      setIsLoading(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        
        if (!userId) {
          throw new Error("You must be logged in to continue");
        }
        
        // Update business owner record with working hours
        const { error } = await supabase
          .from('business_owners')
          .update({
            working_hours: signupData.workingHours,
            google_calendar_connected: signupData.googleCalendarConnected,
          })
          .eq('user_id', userId);
          
        if (error) throw error;
        
        setCurrentStep(currentStep + 1);
      } catch (error: any) {
        toast.error("Error saving working hours", {
          description: error.message
        });
      } finally {
        setIsLoading(false);
      }
    } 
    // If this is the success step, navigate to dashboard
    else if (currentStep === 4) {
      navigate('/admin');
    } 
    // Otherwise just move to the next step
    else {
      setCurrentStep(currentStep + 1);
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

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep data={signupData} updateData={updateSignupData} />;
      case 1:
        return <VisualIdentityStep data={signupData} updateData={updateSignupData} />;
      case 2:
        return <PaymentStep data={signupData} updateData={updateSignupData} />;
      case 3:
        return <WorkingHoursStep data={signupData} updateData={updateSignupData} />;
      case 4:
        return <SuccessStep businessName={signupData.businessName} />;
      default:
        return <PersonalInfoStep data={signupData} updateData={updateSignupData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Bellevo</h1>
          <p className="text-muted-foreground mt-2">הפלטפורמה שמעצימה את העסק שלך</p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>
              Step {currentStep + 1} of {steps.length}
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
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={isLoading}
              >
                {currentStep === steps.length - 1 ? (
                  'Go to Dashboard'
                ) : (
                  <>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
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
