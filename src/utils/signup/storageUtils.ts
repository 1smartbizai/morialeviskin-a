
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

// Define max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Validate logo file before upload
 */
const validateLogoFile = (logo: File): boolean => {
  // Check file size
  if (logo.size > MAX_FILE_SIZE) {
    toast.error("הקובץ גדול מדי", {
      description: "גודל הלוגו חייב להיות פחות מ-5MB"
    });
    return false;
  }
  
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif'];
  if (!validTypes.includes(logo.type)) {
    toast.error("סוג קובץ לא נתמך", {
      description: "הלוגו חייב להיות בפורמט תמונה תקין (JPEG, PNG, SVG, WEBP, GIF)"
    });
    return false;
  }
  
  return true;
}

/**
 * Upload logo to Supabase storage
 */
export const uploadLogo = async (logo: File, userId: string) => {
  if (!logo || !userId) {
    throw new Error("חסרים פרמטרים נדרשים: קובץ לוגו או מזהה משתמש");
  }
  
  // Validate file before uploading
  if (!validateLogoFile(logo)) {
    throw new Error("הקובץ לא עומד בדרישות");
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
