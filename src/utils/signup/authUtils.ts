
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { SignupData } from "@/contexts/SignupContext";
import { BusinessStyleMetadataJson } from "./types";
import { signupDataToMetadata } from "./dataTransformers";

/**
 * Send verification email to user
 */
export const sendVerificationEmail = async (email: string) => {
  if (!email) {
    throw new Error("Email address is required");
  }
  
  await supabase.auth.resetPasswordForEmail(email);
  toast.info("נשלח אימות דוא\"ל", {
    description: "אנא בדקי את תיבת הדואר שלך לקישור אימות"
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
      }
    }
  });

  if (error) throw error;
  
  // At this point we should have a session
  if (data.session) {
    setSession(data.session);
    
    // Create metadata object with initial values
    const metadata = signupDataToMetadata(signupData) as any;
    
    // Initialize business owner record with metadata
    const { error: businessError } = await supabase
      .from('business_owners')
      .insert({
        user_id: data.user!.id,
        first_name: signupData.firstName,
        last_name: signupData.lastName,
        phone: signupData.phone,
        business_name: signupData.businessName || `${signupData.firstName}'s Business`,
        metadata: metadata
      });
      
    if (businessError) throw businessError;
  } else {
    // This might happen if email confirmation is required
    toast.info("נשלח אליך אימות בדוא\"ל", {
      description: "אנא אמתי את חשבונך כדי להמשיך"
    });
  }

  return data;
};
