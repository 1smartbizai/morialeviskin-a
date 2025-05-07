
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

// Convert BusinessStyleMetadata to a type that can be used with Supabase
export type BusinessStyleMetadataJson = {
  [K in keyof BusinessStyleMetadata]: BusinessStyleMetadata[K];
}

// Define the working hours data structure
export interface WorkingHoursData {
  [key: string]: {
    active: boolean;
    start: string;
    end: string;
  };
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

// Default working hours
export const DEFAULT_WORKING_HOURS: WorkingHoursData = {
  monday: { active: true, start: "09:00", end: "17:00" },
  tuesday: { active: true, start: "09:00", end: "17:00" },
  wednesday: { active: true, start: "09:00", end: "17:00" },
  thursday: { active: true, start: "09:00", end: "17:00" },
  friday: { active: true, start: "09:00", end: "17:00" },
  saturday: { active: false, start: "10:00", end: "14:00" },
  sunday: { active: false, start: "10:00", end: "14:00" },
};
