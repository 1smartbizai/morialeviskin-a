
import { Json } from "@/integrations/supabase/types";
import { DEFAULT_METADATA, BusinessStyleMetadataJson } from "./types";

// Type guard to check if metadata is valid
export const isValidMetadata = (metadata: Json | null): boolean => {
  if (!metadata || typeof metadata !== 'object') return false;
  
  // Check for required keys that are part of our metadata definition
  const requiredKeys = [
    'background_color',
    'heading_text_color',
    'body_text_color',
  ];
  
  return requiredKeys.every(key => key in metadata);
};

// Get a metadata value with type safety
export const getMetadataValue = <T>(
  metadata: Json | null, 
  key: keyof BusinessStyleMetadataJson, 
  defaultValue: T
): T => {
  if (!metadata || typeof metadata !== 'object') return defaultValue;
  return (metadata[key] as T) ?? defaultValue;
};

// Create a safe URL for the business domain based on business name
export const generateBusinessIdentifiers = (businessName: string) => {
  // Generate a safe domain name
  const safeBusinessName = businessName
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple dashes with single dash
    .replace(/^-+/, '') // Trim dashes from start
    .replace(/-+$/, ''); // Trim dashes from end
    
  const randomId = Math.random().toString(36).substring(2, 8);
  
  return {
    domain: safeBusinessName || `business-${randomId}`,
    id: `biz_${randomId}`
  };
};

// Check if user is using a default logo
export const isUsingDefaultLogo = (metadata: Json | null) => {
  if (!metadata || typeof metadata !== 'object') return true; // Default to true if no metadata
  return metadata.uses_default_logo === true;
};

// Get default logo path from ID
export const getDefaultLogoPath = (logoId: string | null | undefined) => {
  if (!logoId) return "/logos/salon-logo.png"; // Default fallback
  
  // Import the array from types
  const { DEFAULT_LOGOS } = require('./types');
  
  const logo = DEFAULT_LOGOS.find(l => l.id === logoId);
  return logo ? logo.path : "/logos/salon-logo.png";
};
