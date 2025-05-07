
import { SignupData } from "@/contexts/SignupContext";
import { BusinessStyleMetadata, DEFAULT_METADATA, BusinessStyleMetadataJson } from "./types";

/**
 * Convert SignupData to BusinessStyleMetadata
 */
export function signupDataToMetadata(data: Partial<SignupData>): BusinessStyleMetadataJson {
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
