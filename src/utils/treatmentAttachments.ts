/**
 * Formats attachment data from the database to ensure it matches the expected format
 */
export const formatAttachments = (attachments: any[] | null): { name: string; type: string; url: string }[] => {
  if (!Array.isArray(attachments)) return [];
  
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
};
