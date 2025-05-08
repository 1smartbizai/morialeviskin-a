
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

/**
 * Upload logo to Supabase storage
 */
export const uploadLogo = async (logo: File, userId: string) => {
  if (!logo || !userId) {
    throw new Error("חסרים פרמטרים נדרשים: קובץ לוגו או מזהה משתמש");
  }
  
  try {
    const fileExt = logo.name.split('.').pop();
    const filePath = `${userId}/${Date.now()}.${fileExt}`;
    
    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('logos')
      .upload(filePath, logo);
    
    if (uploadError) {
      console.error("שגיאה בהעלאת הלוגו:", uploadError);
      throw uploadError;
    }
    
    // Get public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('logos')
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error: any) {
    console.error("שגיאה בהעלאת הלוגו:", error);
    toast.error("שגיאה בהעלאת הלוגו", {
      description: error.message || "אנא נסי שוב מאוחר יותר"
    });
    throw error;
  }
};
