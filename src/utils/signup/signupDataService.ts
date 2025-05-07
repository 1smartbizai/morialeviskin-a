
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { SignupData } from "@/contexts/SignupContext";
import { getMetadataValue, isValidMetadata } from "./helpers";
import { DEFAULT_METADATA } from "./types";
import { signupDataToMetadata } from "./dataTransformers";
import { Json } from "@/integrations/supabase/types";

/**
 * Load saved signup data from Supabase
 */
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
    }
  } catch (err) {
    console.error('Error loading saved signup data:', err);
  }
};

/**
 * Save signup data to Supabase
 */
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
      const metadata = signupDataToMetadata(signupData) as Json;

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
          working_hours: workingHoursData as Json,
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
