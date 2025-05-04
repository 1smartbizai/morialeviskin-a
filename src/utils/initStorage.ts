
import { supabase } from "@/integrations/supabase/client";

// This function can be imported and called once when the app initializes to ensure the bucket exists
export const initStorage = async () => {
  // Check if the logos bucket exists, create if not
  const { data: buckets } = await supabase.storage.listBuckets();
  
  if (!buckets?.find(bucket => bucket.name === 'logos')) {
    try {
      await supabase.storage.createBucket('logos', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
      });
      
      console.log('Created logos storage bucket');
      
      // Set public access policy for the bucket
      const { error } = await supabase.storage.from('logos').createSignedUrl('dummy.txt', 1);
      
      if (error && error.message.includes('The resource was not found')) {
        console.log('Storage bucket created successfully');
      }
    } catch (error) {
      console.error('Error setting up storage:', error);
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
    } catch (error) {
      console.error('Error setting up client_photos storage:', error);
    }
  }
};
