
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StepRenderer, { STEP_COMPONENTS } from "@/components/signup/StepRenderer";
import SignupProgress from "@/components/signup/SignupProgress";
import SignupNavigation, { steps } from "@/components/signup/SignupNavigation";
import { useSignup } from "@/contexts/SignupContext";
import { 
  loadSavedSignupData, 
  saveSignupData
} from "@/utils/signup/signupDataService";
import { 
  createUserAndBusiness,
  sendVerificationEmail 
} from "@/utils/signup/authUtils";
import { handleLogoUpload } from "@/utils/signup/storageUtils";
import { generateBusinessIdentifiers } from "@/utils/signup/helpers";
import { initStorage } from "@/utils/initStorage";

const SignupContent = () => {
  const navigate = useNavigate();
  const { 
    signupData, 
    updateSignupData, 
    isLoading, 
    setIsLoading,
    session,
    setSession,
    currentStep,
    setCurrentStep
  } = useSignup();

  // Check for existing session on component mount and ensure storage is initialized
  useEffect(() => {
    // Initialize storage buckets
    initStorage().catch(error => {
      console.error("נכשל באתחול אחסון:", error);
      toast({
        variant: "destructive",
        title: "שגיאה באתחול המערכת",
        description: "אנא נסי שוב מאוחר יותר"
      });
    });

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        // Try to load existing signup data if available
        loadSavedSignupData(data.session.user.id, updateSignupData);
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        // If we get a new session, try to load saved data
        if (newSession && event === 'SIGNED_IN') {
          loadSavedSignupData(newSession.user.id, updateSignupData);
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  const handleResendVerification = async () => {
    if (!signupData.email) {
      toast({
        variant: "destructive",
        title: "אין כתובת דוא\"ל זמינה",
        description: "אנא השלם את שלב הפרטים האישיים תחילה"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await sendVerificationEmail(signupData.email);
      toast({
        title: "נשלח אימות חדש",
        description: "נא לבדוק את תיבת הדוא\"ל שלך"
      });
    } catch (error: any) {
      console.error("שגיאה בשליחת האימות:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בשליחת האימות",
        description: error.message || "אנא נסי שוב מאוחר יותר"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    // Check for step-specific validation before proceeding
    if (currentStep === STEP_COMPONENTS.PERSONAL_INFO && !signupData.isPersonalInfoValid) {
      toast({
        variant: "destructive",
        title: "אנא השלימי את כל שדות החובה",
        description: "יש למלא את כל השדות בצורה תקינה לפני המשך התהליך"
      });
      return;
    }
    
    // Continue with the signup process
    setIsLoading(true);
    
    try {
      // If this is the first step, we create the user account 
      if (currentStep === STEP_COMPONENTS.PERSONAL_INFO) {
        // Generate business domain and ID
        const { domain, id } = generateBusinessIdentifiers(signupData.businessName);
        updateSignupData({ businessDomain: domain, businessId: id });
        
        // Create user if we don't have a session yet
        if (!session) {
          try {
            // Create user and initialize business records
            const result = await createUserAndBusiness(signupData, setSession);
            
            if (result?.session) {
              toast({
                title: "נוצר חשבון בהצלחה!",
                description: `שלום ${signupData.firstName}, המשיכי להגדיר את העסק שלך`
              });
            }
          } catch (accountError: any) {
            console.error("שגיאה ביצירת החשבון:", accountError);
            toast({
              variant: "destructive",
              title: "שגיאה ביצירת החשבון",
              description: accountError.message || "אנא נסי שנית מאוחר יותר"
            });
            return; // Don't proceed if account creation failed
          }
        }
      } 
      // If this is the visual identity step, handle logo upload
      else if (currentStep === STEP_COMPONENTS.VISUAL_IDENTITY && session?.user?.id) {
        // Only handle logo upload if we're using a custom logo and have a logo file
        if (!signupData.usesDefaultLogo && signupData.logo) {
          try {
            const logoUrl = await handleLogoUpload(session.user.id, signupData);
            if (logoUrl) {
              updateSignupData({ logoUrl });
            }
          } catch (logoError) {
            // Logo errors are non-blocking, already handled in handleLogoUpload
            console.log("Continuing despite logo upload issues");
          }
        }
        
        // Save the visual identity settings to the database
        await saveSignupData(currentStep, signupData, session.user.id);
      } 
      // For other steps, save the current data if we have a session
      else if (session?.user?.id) {
        await saveSignupData(currentStep, signupData, session.user.id);
      }
      
      // Handle final step navigation to dashboard
      if (currentStep === STEP_COMPONENTS.SUCCESS) {
        navigate('/admin');
      } else {
        // Move to next step
        setCurrentStep(currentStep + 1);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "שגיאה בתהליך ההרשמה",
        description: error.message || "אנא נסי שנית"
      });
      console.error('שגיאה בתהליך ההרשמה:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <SignupProgress />
      </CardHeader>
      <CardContent>
        <StepRenderer 
          currentStep={currentStep}
          businessName={signupData.businessName}
          businessDomain={signupData.businessDomain}
          businessId={signupData.businessId}
          isEmailVerified={signupData.isEmailVerified}
          isPhoneVerified={signupData.isPhoneVerified}
          onResendVerification={handleResendVerification}
          signupData={signupData}
          updateSignupData={updateSignupData}
        />
        <SignupNavigation onNext={handleNext} onPrevious={handlePrevious} />
      </CardContent>
    </Card>
  );
};

export default SignupContent;
