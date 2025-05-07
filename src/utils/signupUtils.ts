
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { SignupData } from "@/contexts/SignupContext";
import { Json } from "@/integrations/supabase/types";

// Define interface for business style metadata
interface BusinessStyleMetadata {
  background_color?: string;
  heading_text_color?: string;
  body_text_color?: string;
  action_text_color?: string;
  button_bg_color_1?: string;
  button_bg_color_2?: string;
  button_text_color_1?: string;
  button_text_color_2?: string;
  brand_tone?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  [key: string]: any; // Allow for additional properties
}

// Type guard to safely use metadata
function isValidMetadata(metadata: Json): metadata is Record<string, any> {
  return typeof metadata === 'object' && metadata !== null && !Array.isArray(metadata);
}

// Helper function to safely get metadata values
function getMetadataValue<T>(metadata: Json | null | undefined, key: string, defaultValue: T): T {
  if (!metadata || !isValidMetadata(metadata) || !(key in metadata)) {
    return defaultValue;
  }
  return (metadata[key] as any) ?? defaultValue;
}

// Load saved signup data from Supabase
export const loadSavedSignupData = async (userId: string, updateSignupData: (data: Partial<SignupData>) => void) => {
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
      const updatedData: Partial<SignupData> = {
        firstName: data.first_name || "",
        lastName: data.last_name || "",
        phone: data.phone || "",
        businessName: data.business_name || "",
        primaryColor: data.primary_color || "",
        accentColor: data.accent_color || "",
        logoUrl: data.logo_url || "",
        googleCalendarConnected: data.google_calendar_connected || false,
        subscriptionLevel: data.subscription_level || "",
      };

      // Handle metadata fields with proper type safety
      if (data.metadata) {
        updatedData.backgroundColor = getMetadataValue(data.metadata, 'background_color', "");
        updatedData.headingTextColor = getMetadataValue(data.metadata, 'heading_text_color', "");
        updatedData.bodyTextColor = getMetadataValue(data.metadata, 'body_text_color', "");
        updatedData.actionTextColor = getMetadataValue(data.metadata, 'action_text_color', "");
        updatedData.buttonBgColor1 = getMetadataValue(data.metadata, 'button_bg_color_1', "");
        updatedData.buttonBgColor2 = getMetadataValue(data.metadata, 'button_bg_color_2', "");
        updatedData.buttonTextColor1 = getMetadataValue(data.metadata, 'button_text_color_1', "");
        updatedData.buttonTextColor2 = getMetadataValue(data.metadata, 'button_text_color_2', "");
        updatedData.brandTone = getMetadataValue(data.metadata, 'brand_tone', "professional");
        updatedData.isEmailVerified = getMetadataValue(data.metadata, 'email_verified', false);
        updatedData.isPhoneVerified = getMetadataValue(data.metadata, 'phone_verified', false);
      }

      // Safely handle working hours with type assertion
      if (data.working_hours && typeof data.working_hours === 'object' && !Array.isArray(data.working_hours)) {
        // We need to ensure the working hours data conforms to our expected structure
        const workingHoursData = data.working_hours as Record<string, any>;
        const defaultDay = { active: false, start: "09:00", end: "17:00" };
        
        const typedWorkingHours: Record<string, { active: boolean; start: string; end: string }> = {};
        
        // Ensure each day has the right structure
        ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach(day => {
          const dayData = workingHoursData[day];
          if (dayData && typeof dayData === 'object') {
            typedWorkingHours[day] = {
              active: typeof dayData.active === 'boolean' ? dayData.active : false,
              start: typeof dayData.start === 'string' ? dayData.start : "09:00",
              end: typeof dayData.end === 'string' ? dayData.end : "17:00"
            };
          } else {
            typedWorkingHours[day] = { ...defaultDay };
          }
        });
        
        updatedData.workingHours = typedWorkingHours;
      }
      
      updateSignupData(updatedData);
      
      // Generate business domain and ID if we don't have them yet
      const businessName = data.business_name || "";
      const domain = `bellevo.app/${businessName.toLowerCase().replace(/\s+/g, '-')}`;
      const id = `BIZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      updateSignupData({
        businessDomain: domain,
        businessId: id,
      });
    }
  } catch (err) {
    console.error('Error loading saved signup data:', err);
  }
};

// Save signup data to Supabase
export const saveSignupData = async (
  currentStep: number, 
  signupData: SignupData, 
  userId: string
) => {
  if (!userId) {
    console.log('No user ID available to save data');
    return;
  }
  
  try {
    // For Personal Info step
    if (currentStep === 0) {
      // This gets saved when creating the user in handleNext
      return;
    } 
    // For Visual Identity and Brand Settings steps
    else if (currentStep === 1 || currentStep === 2) {
      // Create metadata object with all UI configuration fields
      const metadata: BusinessStyleMetadata = {
        background_color: signupData.backgroundColor || "",
        heading_text_color: signupData.headingTextColor || "",
        body_text_color: signupData.bodyTextColor || "",
        action_text_color: signupData.actionTextColor || "",
        button_bg_color_1: signupData.buttonBgColor1 || "",
        button_bg_color_2: signupData.buttonBgColor2 || "",
        button_text_color_1: signupData.buttonTextColor1 || "",
        button_text_color_2: signupData.buttonTextColor2 || "",
        brand_tone: signupData.brandTone || "professional",
        email_verified: signupData.isEmailVerified || false,
        phone_verified: signupData.isPhoneVerified || false
      };

      // Store core data in the main table fields
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
          metadata // Store additional fields in metadata JSON
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
        .eq('user_id', userId);
        
      if (error) throw error;
    }
    // For Working Hours step
    else if (currentStep === 4) {
      // Ensure the working hours data is properly structured for JSON
      const workingHoursData = signupData.workingHours;
      
      const { error } = await supabase
        .from('business_owners')
        .update({
          working_hours: workingHoursData,
          google_calendar_connected: signupData.googleCalendarConnected,
        })
        .eq('user_id', userId);
        
      if (error) throw error;
    }
  } catch (error: any) {
    toast.error("שגיאה בשמירת הנתונים", {
      description: error.message
    });
    console.error('Error saving signup data:', error);
  }
};

// Handle creation of user account and business owner record
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
    const metadata: BusinessStyleMetadata = {
      email_verified: false,
      phone_verified: false,
      background_color: "",
      heading_text_color: "",
      body_text_color: "",
      action_text_color: "",
      button_bg_color_1: "",
      button_bg_color_2: "",
      button_text_color_1: "",
      button_text_color_2: "",
      brand_tone: "professional"
    };
    
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

// Upload logo to Supabase storage
export const uploadLogo = async (logo: File, userId: string) => {
  const fileExt = logo.name.split('.').pop();
  const filePath = `${userId}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError, data: uploadData } = await supabase.storage
    .from('logos')
    .upload(filePath, logo);
  
  if (uploadError) throw uploadError;
  
  // Get public URL for the uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('logos')
    .getPublicUrl(filePath);
    
  return publicUrl;
};

// Send verification email to user
export const sendVerificationEmail = async (email: string) => {
  await supabase.auth.resetPasswordForEmail(email);
  toast.info("נשלח אימות דוא\"ל", {
    description: "אנא בדקי את תיבת הדואר שלך לקישור אימות"
  });
};

// Generate business domain and ID
export const generateBusinessIdentifiers = (businessName: string) => {
  const domain = `bellevo.app/${businessName.toLowerCase().replace(/\s+/g, '-')}`;
  const id = `BIZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  return { domain, id };
};
