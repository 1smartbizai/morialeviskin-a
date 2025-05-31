import { useEffect, useRef } from "react";
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
  sendVerificationEmail,
  checkUrlForVerification 
} from "@/utils/signup/authUtils";
import { handleLogoUpload } from "@/utils/signup/storageUtils";
import { generateBusinessIdentifiers } from "@/utils/signup/helpers";
import { initStorage } from "@/utils/initStorage";
import VerificationReminder from "@/components/signup/success/VerificationReminder";

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

  // Reference to the container to scroll to top when changing steps
  const containerRef = useRef<HTMLDivElement>(null);

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
        
        // Check if user has verified email
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.email_confirmed_at) {
          updateSignupData({ isEmailVerified: true });
          
          // Show success toast when email is verified
          toast({
            title: "כתובת הדוא\"ל אומתה בהצלחה!",
            description: "תודה! כעת ניתן להמשיך בתהליך ההרשמה"
          });
        }
      }
      
      // Check if URL indicates verification
      if (checkUrlForVerification()) {
        updateSignupData({ isEmailVerified: true });
        
        toast({
          title: "כתובת הדוא\"ל אומתה בהצלחה!",
          description: "תודה! כעת ניתן להמשיך בתהליך ההרשמה"
        });
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
          
          // Check if user has verified their email
          if (newSession.user.email_confirmed_at) {
            updateSignupData({ isEmailVerified: true });
            
            // Show success toast
            toast({
              title: "כתובת הדוא\"ל אומתה בהצלחה!",
              description: "תודה! כעת ניתן להמשיך בתהליך ההרשמה"
            });
          }
        }
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);

  // Function to scroll to the top of the container when changing steps
  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
      
      // Update the verification step state
      updateSignupData({ 
        verificationStep: {
          ...signupData.verificationStep,
          emailSent: true
        }
      });
      
      toast({
        title: "נשלח אימות חדש",
        description: `היי ${signupData.firstName}, נא לבדוק את תיבת הדוא"ל שלך`
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
    // Always scroll to top before proceeding
    scrollToTop();
    
    // Check for step-specific validation before proceeding
    if (currentStep === STEP_COMPONENTS.PERSONAL_INFO && !signupData.isPersonalInfoValid) {
      toast({
        variant: "destructive",
        title: `${signupData.firstName}, אנא השלימי את כל שדות החובה`,
        description: "יש למלא את כל השדות בצורה תקינה לפני המשך התהליך"
      });
      return;
    }
    
    // Plan selection step - create user account
    if (currentStep === STEP_COMPONENTS.PLAN_SELECTION) {
      setIsLoading(true);
      try {
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
                title: `ברוכה הבאה, ${signupData.firstName}!`,
                description: "החשבון שלך נוצר בהצלחה. כעת עליך לאמת את כתובת האימייל שלך."
              });
              
              // Move to verification step
              setCurrentStep(STEP_COMPONENTS.VERIFICATION);
              setIsLoading(false);
              return;
            }
          } catch (accountError: any) {
            console.error("שגיאה ביצירת החשבון:", accountError);
            toast({
              variant: "destructive",
              title: "שגיאה ביצירת החשבון",
              description: accountError.message || `${signupData.firstName}, אנא נסי שנית מאוחר יותר`
            });
            setIsLoading(false);
            return;
          }
        }
        
        // If we reach here with a session, go to verification step
        setCurrentStep(STEP_COMPONENTS.VERIFICATION);
        setIsLoading(false);
        return;
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "שגיאה בתהליך ההרשמה",
          description: error.message || `${signupData.firstName}, אנא נסי שנית`
        });
        console.error('שגיאה בתהליך ההרשמה:', error);
        setIsLoading(false);
        return;
      }
    }
    
    // Verification step validation with personalized message
    if (currentStep === STEP_COMPONENTS.VERIFICATION) {
      if (!signupData.isEmailVerified) {
        toast({
          variant: "destructive",
          title: "נדרש אימות אימייל",
          description: `${signupData.firstName}, עלייך לאמת את כתובת הדוא"ל שלך כדי להמשיך.`
        });
        return;
      }
    }
    
    // Continue with the signup process
    setIsLoading(true);
    
    try {
      // If this is the verification step, check email verification (phone is optional)
      if (currentStep === STEP_COMPONENTS.VERIFICATION) {
        // Check email verification - phone verification is optional
        if (!signupData.isEmailVerified) {
          toast({
            variant: "destructive", 
            title: "נדרש אימות אימייל",
            description: `${signupData.firstName}, עלייך לאמת את כתובת הדוא"ל שלך כדי להמשיך.`
          });
          setIsLoading(false);
          return;
        }
        
        // Save current step to metadata for resuming later
        if (session?.user?.id) {
          const metadata = {
            isSignupComplete: false,
            currentStep: STEP_COMPONENTS.BUSINESS_SETUP,
            lastUpdated: new Date().toISOString()
          };
          
          const { error } = await supabase
            .from('business_owners')
            .update({ 
              metadata: metadata
            })
            .eq('user_id', session.user.id);
            
          if (error) {
            console.error("Error saving signup progress:", error);
          }
        }
        
        // If phone is not verified, show a warning but allow to proceed
        if (!signupData.isPhoneVerified) {
          toast({
            variant: "default", 
            title: "אזהרה: מספר הטלפון לא אומת", 
            description: `${signupData.firstName}, את ממשיכה ללא אימות מספר הטלפון. ניתן לאמת אותו מאוחר יותר.`
          });
        }
        
        // Save verification state
        if (session?.user?.id) {
          await saveSignupData(currentStep, signupData, session.user.id);
          
          // Now proceed to business setup step
          setCurrentStep(STEP_COMPONENTS.BUSINESS_SETUP);
          setIsLoading(false);
          return;
        }
      }
      // If this is the visual identity step, handle logo upload
      else if (currentStep === STEP_COMPONENTS.VISUAL_IDENTITY && session?.user?.id) {
        // Update metadata with current step
        const metadata = {
          isSignupComplete: false,
          currentStep: STEP_COMPONENTS.BRAND_SETTINGS,
          lastUpdated: new Date().toISOString()
        };
        
        await supabase
          .from('business_owners')
          .update({ metadata })
          .eq('user_id', session.user.id);
          
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
        // Update metadata with current step for all other steps
        let nextStep = currentStep + 1;
        
        // For the last step, mark signup as complete
        if (nextStep >= STEP_COMPONENTS.WELCOME_COMPLETE) {
          const metadata = {
            isSignupComplete: true,
            currentStep: nextStep,
            lastUpdated: new Date().toISOString()
          };
          
          await supabase
            .from('business_owners')
            .update({ metadata })
            .eq('user_id', session.user.id);
        } else {
          const metadata = {
            isSignupComplete: false,
            currentStep: nextStep,
            lastUpdated: new Date().toISOString()
          };
          
          await supabase
            .from('business_owners')
            .update({ metadata })
            .eq('user_id', session.user.id);
        }
        
        await saveSignupData(currentStep, signupData, session.user.id);
      }
      
      // Handle final step navigation to dashboard
      if (currentStep === STEP_COMPONENTS.WELCOME_COMPLETE) {
        toast({
          title: "התהליך הושלם בהצלחה!",
          description: `${signupData.firstName}, העסק שלך מוכן לשימוש. מעבר למערכת...`
        });
        navigate('/admin');
      } else {
        // Move to next step
        setCurrentStep(currentStep + 1);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "שגיאה בתהליך ההרשמה",
        description: error.message || `${signupData.firstName}, אנא נסי שנית`
      });
      console.error('שגיאה בתהליך ההרשמה:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    // Always scroll to top before proceeding
    scrollToTop();
    
    // If at the verification step, go back to plan selection
    if (currentStep === STEP_COMPONENTS.VERIFICATION) {
      setCurrentStep(STEP_COMPONENTS.PLAN_SELECTION);
    }
    // For all other steps
    else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get the step title, considering the new steps structure
  const getStepTitle = () => {
    // If we're on the verification step, use a custom title
    if (currentStep === STEP_COMPONENTS.VERIFICATION) {
      return "אימות חשבון";
    }
    
    // Otherwise use the title from the steps array
    return steps[Math.min(currentStep, steps.length - 1)].title;
  };

  return (
    <div ref={containerRef}>
      <Card className="w-full" dir="rtl">
        <CardHeader>
          <CardTitle>{getStepTitle()}</CardTitle>
          <SignupProgress />
        </CardHeader>
        <CardContent>
          {/* If phone is not verified and we're past verification step, show reminder */}
          {!signupData.isPhoneVerified && 
           signupData.isEmailVerified && 
           currentStep > STEP_COMPONENTS.VERIFICATION && (
            <div className="mb-4">
              <VerificationReminder
                isEmailVerified={signupData.isEmailVerified}
                isPhoneVerified={signupData.isPhoneVerified}
                onResendVerification={handleResendVerification}
              />
            </div>
          )}

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
    </div>
  );
};

export default SignupContent;
