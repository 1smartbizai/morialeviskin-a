
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import StepRenderer, { STEP_COMPONENTS } from "@/components/signup/StepRenderer";
import SignupProgress from "@/components/signup/SignupProgress";
import SignupNavigation, { steps } from "@/components/signup/SignupNavigation";
import { useSignup } from "@/contexts/SignupContext";
import { 
  loadSavedSignupData, 
  saveSignupData, 
  createUserAndBusiness,
  uploadLogo,
  sendVerificationEmail,
  generateBusinessIdentifiers
} from "@/utils/signup";
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
      toast.error("שגיאה באתחול המערכת", {
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
      toast.error("אין כתובת דוא\"ל זמינה", {
        description: "אנא השלם את שלב הפרטים האישיים תחילה"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await sendVerificationEmail(signupData.email);
      toast.success("נשלח אימות חדש", {
        description: "נא לבדוק את תיבת הדוא\"ל שלך"
      });
    } catch (error: any) {
      console.error("שגיאה בשליחת האימות:", error);
      toast.error("שגיאה בשליחת האימות", {
        description: error.message || "אנא נסי שוב מאוחר יותר"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    // Check for step-specific validation before proceeding
    if (currentStep === STEP_COMPONENTS.PERSONAL_INFO && !signupData.isPersonalInfoValid) {
      toast.error("אנא השלימי את כל שדות החובה", {
        description: "יש למלא את כל השדות בצורה תקינה לפני המשך התהליך"
      });
      return;
    }
    
    // Continue with the signup process
    setIsLoading(true);
    
    try {
      // If this is the first step, we need to prepare business identifiers but don't create user yet
      if (currentStep === STEP_COMPONENTS.PERSONAL_INFO) {
        // Generate business domain and ID
        const { domain, id } = generateBusinessIdentifiers(signupData.businessName);
        updateSignupData({ businessDomain: domain, businessId: id });
        
        // We'll delay account creation until the final step
        // Just move to next step without requiring authentication
      } 
      // If this is the second step (visual identity), we handle logo upload with temp storage
      else if (currentStep === STEP_COMPONENTS.VISUAL_IDENTITY && signupData.logo) {
        // If we have a session, we can upload the logo properly
        if (session?.user?.id) {
          const publicUrl = await uploadLogo(signupData.logo, session.user.id);
          updateSignupData({ logoUrl: publicUrl });
        } else {
          // Store the logo in state for later upload when we have a session
          // We'll keep the File object in memory until final step
          console.log("הלוגו יועלה בשלב האחרון כשהחשבון ייווצר");
        }
      } 
      
      // If we're on the final step, complete all the setup and create the account
      if (currentStep === STEP_COMPONENTS.SUCCESS) {
        // Now create the user and business if we haven't already
        if (!session) {
          try {
            // Create user and initialize business records
            const result = await createUserAndBusiness(signupData, setSession);
            
            if (result?.session) {
              // Upload the logo if it's still pending
              if (signupData.logo && !signupData.logoUrl) {
                try {
                  const publicUrl = await uploadLogo(signupData.logo, result.session.user.id);
                  updateSignupData({ logoUrl: publicUrl });
                } catch (logoError: any) {
                  console.error("שגיאה בהעלאת הלוגו:", logoError);
                  toast.error("הלוגו לא הועלה בהצלחה", {
                    description: "ניתן לעדכן את הלוגו מאוחר יותר בהגדרות"
                  });
                }
              }
            }
          } catch (accountError: any) {
            console.error("שגיאה ביצירת החשבון:", accountError);
            toast.error("שגיאה ביצירת החשבון", {
              description: accountError.message || "אנא נסי שנית מאוחר יותר"
            });
            return; // Don't proceed to dashboard if account creation failed
          }
        }
        
        // Navigate to dashboard
        navigate('/admin');
      } else {
        // Save current step data if we have a session
        if (session?.user?.id) {
          await saveSignupData(currentStep, signupData, session.user.id);
        }
        
        // Move to next step
        setCurrentStep(currentStep + 1);
      }
    } catch (error: any) {
      toast.error("שגיאה בתהליך ההרשמה", {
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
