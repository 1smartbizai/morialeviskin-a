
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { SignupData } from "@/contexts/SignupContext";
import { Json } from "@/integrations/supabase/types";

// Define interface for business style metadata
export interface BusinessStyleMetadata {
  background_color: string;
  heading_text_color: string;
  body_text_color: string;
  action_text_color: string;
  button_bg_color_1: string;
  button_bg_color_2: string;
  button_text_color_1: string;
  button_text_color_2: string;
  brand_tone: 'professional' | 'friendly' | 'luxury' | 'casual';
  email_verified: boolean;
  phone_verified: boolean;
}

// Default metadata values to ensure consistency
export const DEFAULT_METADATA: BusinessStyleMetadata = {
  background_color: "#FFFFFF",
  heading_text_color: "#1A1F2C",
  body_text_color: "#333333",
  action_text_color: "#FFFFFF",
  button_bg_color_1: "#6A0DAD",
  button_bg_color_2: "#8B5CF6",
  button_text_color_1: "#FFFFFF",
  button_text_color_2: "#FFFFFF",
  brand_tone: "professional",
  email_verified: false,
  phone_verified: false
};

// Type guard to safely use metadata
function isValidMetadata(metadata: Json): metadata is Record<string, any> {
  return typeof metadata === 'object' && metadata !== null && !Array.isArray(metadata);
}

// Helper function to safely get metadata values
function getMetadataValue<T>(
  metadata: Json | null | undefined, 
  key: keyof BusinessStyleMetadata, 
  defaultValue: T
): T {
  if (!metadata || !isValidMetadata(metadata) || !(key in metadata)) {
    return defaultValue;
  }
  return (metadata[key] as any) ?? defaultValue;
}

// Convert SignupData to BusinessStyleMetadata
function signupDataToMetadata(data: Partial<SignupData>): BusinessStyleMetadata {
  return {
    background_color: data.backgroundColor || DEFAULT_METADATA.background_color,
    heading_text_color: data.headingTextColor || DEFAULT_METADATA.heading_text_color,
    body_text_color: data.bodyTextColor || DEFAULT_METADATA.body_text_color,
    action_text_color: data.actionTextColor || DEFAULT_METADATA.action_text_color,
    button_bg_color_1: data.buttonBgColor1 || DEFAULT_METADATA.button_bg_color_1,
    button_bg_color_2: data.buttonBgColor2 || DEFAULT_METADATA.button_bg_color_2,
    button_text_color_1: data.buttonTextColor1 || DEFAULT_METADATA.button_text_color_1,
    button_text_color_2: data.buttonTextColor2 || DEFAULT_METADATA.button_text_color_2,
    brand_tone: (data.brandTone || DEFAULT_METADATA.brand_tone) as BusinessStyleMetadata['brand_tone'],
    email_verified: data.isEmailVerified || DEFAULT_METADATA.email_verified,
    phone_verified: data.isPhoneVerified || DEFAULT_METADATA.phone_verified
  };
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
        const metadata = data.metadata;
        updatedData.backgroundColor = getMetadataValue(metadata, 'background_color', DEFAULT_METADATA.background_color);
        updatedData.headingTextColor = getMetadataValue(metadata, 'heading_text_color', DEFAULT_METADATA.heading_text_color);
        updatedData.bodyTextColor = getMetadataValue(metadata, 'body_text_color', DEFAULT_METADATA.body_text_color);
        updatedData.actionTextColor = getMetadataValue(metadata, 'action_text_color', DEFAULT_METADATA.action_text_color);
        updatedData.buttonBgColor1 = getMetadataValue(metadata, 'button_bg_color_1', DEFAULT_METADATA.button_bg_color_1);
        updatedData.buttonBgColor2 = getMetadataValue(metadata, 'button_bg_color_2', DEFAULT_METADATA.button_bg_color_2);
        updatedData.buttonTextColor1 = getMetadataValue(metadata, 'button_text_color_1', DEFAULT_METADATA.button_text_color_1);
        updatedData.buttonTextColor2 = getMetadataValue(metadata, 'button_text_color_2', DEFAULT_METADATA.button_text_color_2);
        updatedData.brandTone = getMetadataValue(metadata, 'brand_tone', DEFAULT_METADATA.brand_tone);
        updatedData.isEmailVerified = getMetadataValue(metadata, 'email_verified', DEFAULT_METADATA.email_verified);
        updatedData.isPhoneVerified = getMetadataValue(metadata, 'phone_verified', DEFAULT_METADATA.phone_verified);
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
      if (!updatedData.businessDomain || !updatedData.businessId) {
        const businessName = data.business_name || "";
        const { domain, id } = generateBusinessIdentifiers(businessName);
        
        updateSignupData({
          businessDomain: domain,
          businessId: id,
        });
      }
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
      const metadata: BusinessStyleMetadata = signupDataToMetadata(signupData);

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
    const metadata = signupDataToMetadata(signupData);
    
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
  if (!logo || !userId) {
    throw new Error("Missing required parameters: logo file or user ID");
  }
  
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
  if (!email) {
    throw new Error("Email address is required");
  }
  
  await supabase.auth.resetPasswordForEmail(email);
  toast.info("נשלח אימות דוא\"ל", {
    description: "אנא בדקי את תיבת הדואר שלך לקישור אימות"
  });
};

// Generate business domain and ID
export const generateBusinessIdentifiers = (businessName: string) => {
  if (!businessName || typeof businessName !== 'string') {
    businessName = "business"; // Default fallback
  }
  
  const domain = `bellevo.app/${businessName.toLowerCase().replace(/\s+/g, '-')}`;
  const id = `BIZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  return { domain, id };
};
