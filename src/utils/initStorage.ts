
import { supabase } from "@/integrations/supabase/client";

// This function can be imported and called once when the app initializes to ensure the bucket exists
export const initStorage = async () => {
  try {
    // Check if the logos bucket exists, create if not
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    
    if (bucketError) {
      console.error('Error checking storage buckets:', bucketError.message);
      return;
    }
    
    // Create logos bucket if it doesn't exist
    if (!buckets?.find(bucket => bucket.name === 'logos')) {
      try {
        await supabase.storage.createBucket('logos', {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
          allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
        });
        
        console.log('Created logos storage bucket');
      } catch (error: any) {
        // Ignore if bucket already exists error (could happen in race conditions)
        if (error.message && !error.message.includes('already exists')) {
          console.error('Error creating logos bucket:', error);
        }
      }
    }
    
    // Check if the client_photos bucket exists, create if not
    if (!buckets?.find(bucket => bucket.name === 'client_photos')) {
      try {
        await supabase.storage.createBucket('client_photos', {
          public: false,
          fileSizeLimit: 1024 * 1024 * 5, // 5MB limit
        });
        
        console.log('Created client_photos storage bucket');
      } catch (error: any) {
        // Ignore if bucket already exists error (could happen in race conditions)
        if (error.message && !error.message.includes('already exists')) {
          console.error('Error creating client_photos bucket:', error);
        }
      }
    }
  } catch (error) {
    console.error('Unexpected error setting up storage:', error);
  }
};
