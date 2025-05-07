import { Json } from "@/integrations/supabase/types";

/**
 * Formats attachment data from the database to ensure it matches the expected format
 */
export const formatAttachments = (attachments: Json | null): { name: string; type: string; url: string }[] => {
  // If null or undefined, return empty array
  if (attachments === null || attachments === undefined) {
    return [];
  }
  
  // If it's already an array, map it
  if (Array.isArray(attachments)) {
    return attachments.map((attachment: any) => {
      // If attachment is already in the correct format, use it
      if (attachment && typeof attachment === 'object' && 'name' in attachment && 'type' in attachment && 'url' in attachment) {
        return {
          name: attachment.name,
          type: attachment.type,
          url: attachment.url
        };
      }
      // Otherwise, create a placeholder or extract information if possible
      return {
        name: typeof attachment === 'object' && attachment?.name ? attachment.name : 'Attachment',
        type: typeof attachment === 'object' && attachment?.type ? attachment.type : 'unknown',
        url: typeof attachment === 'string' ? attachment : 
             (typeof attachment === 'object' && attachment?.url ? attachment.url : '')
      };
    });
  }
  
  // If it's a single string (URL), wrap it in an array with default values
  if (typeof attachments === 'string') {
    return [{
      name: 'Attachment',
      type: 'unknown',
      url: attachments
    }];
  }
  
  // If it's a single object, check if it has the expected format
  if (typeof attachments === 'object') {
    if ('name' in attachments && 'type' in attachments && 'url' in attachments) {
      return [{
        name: attachments.name as string,
        type: attachments.type as string,
        url: attachments.url as string
      }];
    }
    
    // If it has an url property, use it
    if ('url' in attachments) {
      return [{
        name: 'Attachment',
        type: 'unknown',
        url: attachments.url as string
      }];
    }
  }
  
  // For any other case, return empty array
  return [];
};
