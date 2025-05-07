
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

/**
 * Upload logo to Supabase storage
 */
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
