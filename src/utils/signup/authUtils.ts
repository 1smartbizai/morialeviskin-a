import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { SignupData } from "@/contexts/SignupContext";
import { BusinessStyleMetadataJson } from "./types";
import { signupDataToMetadata } from "./dataTransformers";
import { Json } from "@/integrations/supabase/types";
import { handleLogoUpload } from "./storageUtils";

/**
 * Send verification email to user
 */
export const sendVerificationEmail = async (email: string) => {
  if (!email) {
    throw new Error("כתובת דוא\"ל נדרשת");
  }
  
  // Updated to redirect to login page with verified flag
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: window.location.origin + '/admin/login?verified=true'
    }
  });
  
  if (error) throw error;
  
  toast({
    title: "נשלח אימות דוא\"ל",
    description: "אנא בדקי את תיבת הדואר שלך לקישור האימות"
  });
};

/**
 * Check if an email is already registered in the system
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  if (!email || !email.includes('@')) return false;
  
  try {
    // First check if email might be in auth.users table
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false
      }
    });
    
    // No error means the email exists in auth system
    if (!error) {
      return true;
    }
    
    // For the RPC call, we need to use the generic with the correct structure
    // First type argument is the return type, second is the params type
    const { data: business } = await supabase
      .rpc('check_email_exists', {
        email_to_check: email.toLowerCase().trim()
      }) as { data: boolean };
    
    return business === true;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
};

/**
 * Check if a phone number is already registered in the system
 */
export const checkPhoneExists = async (phone: string): Promise<boolean> => {
  if (!phone || phone.length < 9) return false;
  
  try {
    // Format phone number for consistent checking
    let formattedPhone = phone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+972' + formattedPhone.substring(1);
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+972' + formattedPhone;
    }
    
    // Check business_owners table for the phone number
    const { data, error } = await supabase
      .from('business_owners')
      .select('id')
      .eq('phone', formattedPhone)
      .maybeSingle();
    
    // Also check clients table
    const { data: clientData } = await supabase
      .from('clients')
      .select('id')
      .eq('phone', formattedPhone)
      .maybeSingle();
    
    return !!data || !!clientData;
  } catch (error) {
    console.error("Error checking phone existence:", error);
    return false;
  }
};

/**
 * Handle creation of user account and business owner record
 */
export const createUserAndBusiness = async (
  signupData: SignupData, 
  setSession: (session: any) => void
) => {
  // Double-check for existing email before attempting to create
  const emailExists = await checkEmailExists(signupData.email);
  if (emailExists) {
    throw new Error("כתובת האימייל כבר רשומה במערכת. ניתן להתחבר באמצעות הכתובת הזו או לבחור כתובת אחרת.");
  }
  
  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: signupData.email,
    password: signupData.password,
    options: {
      data: {
        first_name: signupData.firstName,
        last_name: signupData.lastName,
      },
      // Updated to redirect to login page with verified flag
      emailRedirectTo: window.location.origin + '/admin/login?verified=true'
    }
  });

  if (error) throw error;
  
  // At this point we should have a session
  if (data.session) {
    setSession(data.session);
    
    // Create metadata object with initial values
    const metadata = {
      ...signupDataToMetadata(signupData),
      isSignupComplete: false,
      currentStep: 1, // Verification step
      lastUpdated: new Date().toISOString()
    } as Json;
    
    // Initialize business owner record with metadata
    const { error: businessError } = await supabase
      .from('business_owners')
      .insert({
        user_id: data.user!.id,
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        phone: signupData.phone,
        business_name: signupData.businessName || `${signupData.firstName}'s Business`,
        metadata: metadata,
        primary_color: signupData.primaryColor,
        accent_color: signupData.accentColor
      });
      
    if (businessError) throw businessError;
    
    toast({
      title: `ברוכה הבאה, ${signupData.firstName}!`,
      description: "החשבון שלך נוצר בהצלחה. אנו נלווה אותך בתהליך הקמת העסק."
    });
  } else {
    // This might happen if email confirmation is required
    toast({
      title: `היי ${signupData.firstName}, נשלח אליך אימות בדוא"ל`,
      description: "אנא אמתי את חשבונך בלחיצה על הקישור שנשלח אליך כדי להמשיך"
    });
  }

  return data;
};

// Helper function to check URL parameters for verification status
export const checkUrlForVerification = (): boolean => {
  const params = new URLSearchParams(window.location.search);
  return params.get('verified') === 'true';
};
