
import PersonalInfoStep from "@/components/signup/PersonalInfoStep";
import VerificationStep from "@/components/signup/VerificationStep";
import VisualIdentityStep from "@/components/signup/VisualIdentityStep";
import BrandSettingsStep from "@/components/signup/BrandSettingsStep";
import PaymentStep from "./payment/PaymentStep";
import WorkingHoursStep from "@/components/signup/WorkingHoursStep";
import SuccessStep from "@/components/signup/SuccessStep";
import { SignupData } from "@/contexts/SignupContext";

// Define interface for StepRendererProps to ensure type safety
interface StepRendererProps {
  currentStep: number;
  businessName: string;
  businessDomain?: string;
  businessId?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  onResendVerification: () => void;
  signupData: SignupData;
  updateSignupData: (data: Partial<SignupData>) => void;
}

// Define step configuration for better organization
export const STEP_COMPONENTS = {
  PERSONAL_INFO: 0,
  VERIFICATION: 1,
  VISUAL_IDENTITY: 2,
  BRAND_SETTINGS: 3,
  WORKING_HOURS: 4,
  PAYMENT: 5,
  SUCCESS: 6
};

const StepRenderer = ({ 
  currentStep, 
  businessName,
  businessDomain,
  businessId,
  isEmailVerified,
  isPhoneVerified,
  onResendVerification,
  signupData,
  updateSignupData
}: StepRendererProps) => {
  // Use a switch statement for clear step rendering logic
  switch (currentStep) {
    case STEP_COMPONENTS.PERSONAL_INFO:
      return <PersonalInfoStep />;
      
    case STEP_COMPONENTS.VERIFICATION:
      return <VerificationStep />;
      
    case STEP_COMPONENTS.VISUAL_IDENTITY:
      return <VisualIdentityStep />;
      
    case STEP_COMPONENTS.BRAND_SETTINGS:
      return <BrandSettingsStep />;
      
    case STEP_COMPONENTS.WORKING_HOURS:
      return <WorkingHoursStep />;
      
    case STEP_COMPONENTS.PAYMENT:
      return (
        <PaymentStep 
          data={signupData}
          updateData={updateSignupData}
        />
      );
      
    case STEP_COMPONENTS.SUCCESS:
      return (
        <SuccessStep 
          businessName={businessName} 
          businessDomain={businessDomain}
          businessId={businessId}
          isEmailVerified={isEmailVerified}
          isPhoneVerified={isPhoneVerified}
          onResendVerification={onResendVerification}
        />
      );
      
    default:
      return <PersonalInfoStep />;
  }
};

export default StepRenderer;
