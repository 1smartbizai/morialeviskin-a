
import { SignupData } from "@/contexts/SignupContext";

// Transform SignupData to the metadata format expected by the database
export const signupDataToMetadata = (signupData: SignupData) => {
  return {
    background_color: signupData.backgroundColor,
    heading_text_color: signupData.headingTextColor,
    body_text_color: signupData.bodyTextColor,
    action_text_color: signupData.actionTextColor,
    button_bg_color_1: signupData.buttonBgColor1,
    button_bg_color_2: signupData.buttonBgColor2,
    button_text_color_1: signupData.buttonTextColor1,
    button_text_color_2: signupData.buttonTextColor2,
    brand_tone: signupData.brandTone,
    email_verified: signupData.isEmailVerified,
    phone_verified: signupData.isPhoneVerified,
    uses_default_logo: signupData.usesDefaultLogo,
    default_logo_id: signupData.defaultLogoId
  };
};
