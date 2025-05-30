
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface BusinessData {
  id: string;
  business_name: string;
  first_name: string;
  last_name: string;
  primary_color: string;
  accent_color: string;
  logo_url: string | null;
  subscription_level: string | null;
  metadata: any;
}

interface OnboardingStatus {
  isNewBusiness: boolean;
  hasCompletedTour: boolean;
  businessData: BusinessData | null;
  hasAnyData: boolean;
  isLoading: boolean;
}

export const useBusinessOnboarding = (): OnboardingStatus => {
  const { user } = useAuth();
  const [status, setStatus] = useState<OnboardingStatus>({
    isNewBusiness: false,
    hasCompletedTour: false,
    businessData: null,
    hasAnyData: false,
    isLoading: true
  });

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user?.id) {
        setStatus(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // Get business owner data
        const { data: businessData, error } = await supabase
          .from('business_owners')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error || !businessData) {
          setStatus(prev => ({ ...prev, isLoading: false }));
          return;
        }

        // Check if signup is complete
        const metadata = businessData.metadata as any;
        const isSignupComplete = metadata?.isSignupComplete === true;
        const hasCompletedTour = metadata?.hasCompletedOnboardingTour === true;

        // Check if business has any real data
        const [clientsResult, appointmentsResult, treatmentsResult] = await Promise.all([
          supabase.from('clients').select('id').eq('user_id', user.id).limit(1),
          supabase.from('appointments').select('id').eq('business_owner_id', user.id).limit(1),
          supabase.from('treatments').select('id').eq('user_id', user.id).limit(1)
        ]);

        const hasAnyData = 
          (clientsResult.data && clientsResult.data.length > 0) ||
          (appointmentsResult.data && appointmentsResult.data.length > 0) ||
          (treatmentsResult.data && treatmentsResult.data.length > 0);

        setStatus({
          isNewBusiness: isSignupComplete && !hasAnyData,
          hasCompletedTour,
          businessData,
          hasAnyData,
          isLoading: false
        });

      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setStatus(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkOnboardingStatus();
  }, [user?.id]);

  return status;
};
