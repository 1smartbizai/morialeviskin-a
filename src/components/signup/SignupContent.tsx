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
      console.error("Failed to initialize storage:", error);
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
    } catch (error: any) {
      toast.error("שגיאה בשליחת האימות", {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
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
          console.log("Logo will be uploaded in the final step when account is created");
        }
      } 
      
      // If we're on the final step, complete all the setup and create the account
      if (currentStep === STEP_COMPONENTS.SUCCESS) {
        // Now create the user and business if we haven't already
        if (!session) {
          // Create user and initialize business records
          await createUserAndBusiness(signupData, setSession);
          
          // Upload the logo if it's still pending and we now have a session
          if (signupData.logo && !signupData.logoUrl && session?.user?.id) {
            const publicUrl = await uploadLogo(signupData.logo, session.user.id);
            updateSignupData({ logoUrl: publicUrl });
          }
          
          // Auto-send verification emails
          if (signupData.email) {
            await sendVerificationEmail(signupData.email);
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

  return (
    <Card className="w-full">
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
