
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
  
  // Use the correct function to send email verification
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: window.location.origin + '/admin'
    }
  });
  
  if (error) throw error;
  
  toast({
    title: "נשלח אימות דוא\"ל",
    description: "אנא בדקי את תיבת הדואר שלך לקישור האימות"
  });
};

/**
 * Handle creation of user account and business owner record
 */
export const createUserAndBusiness = async (
  signupData: SignupData, 
  setSession: (session: any) => void
) => {
  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: signupData.email,
    password: signupData.password,
    options: {
      data: {
        first_name: signupData.firstName,
        last_name: signupData.lastName,
      },
      emailRedirectTo: window.location.origin + '/admin'
    }
  });

  if (error) throw error;
  
  // At this point we should have a session
  if (data.session) {
    setSession(data.session);
    
    // Create metadata object with initial values
    const metadata = signupDataToMetadata(signupData) as Json;
    
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
      title: "החשבון נוצר בהצלחה!",
      description: "ברוכה הבאה ל-Bellevo"
    });
  } else {
    // This might happen if email confirmation is required
    toast({
      title: "נשלח אליך אימות בדוא\"ל",
      description: "אנא אמתי את חשבונך כדי להמשיך"
    });
  }

  return data;
};
