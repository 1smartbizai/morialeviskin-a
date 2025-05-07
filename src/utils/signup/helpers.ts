
import { Json } from "@/integrations/supabase/types";
import { BusinessStyleMetadata, DEFAULT_METADATA } from "./types";

/**
 * Type guard to safely use metadata
 */
export function isValidMetadata(metadata: Json): metadata is Record<string, any> {
  return typeof metadata === 'object' && metadata !== null && !Array.isArray(metadata);
}

/**
 * Helper function to safely get metadata values
 */
export function getMetadataValue<T>(
  metadata: Json | null | undefined, 
  key: keyof BusinessStyleMetadata, 
  defaultValue: T
): T {
  if (!metadata || !isValidMetadata(metadata) || !(key in metadata)) {
    return defaultValue;
  }
  return (metadata[key] as any) ?? defaultValue;
}

/**
 * Generate business domain and ID
 */
export const generateBusinessIdentifiers = (businessName: string) => {
  if (!businessName || typeof businessName !== 'string') {
    businessName = "business"; // Default fallback
  }
  
  const domain = `bellevo.app/${businessName.toLowerCase().replace(/\s+/g, '-')}`;
  const id = `BIZ-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  
  return { domain, id };
};
