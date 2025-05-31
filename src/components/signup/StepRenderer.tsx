
import PersonalInfoStep from "@/components/signup/PersonalInfoStep";
import PlanSelectionStep from "@/components/signup/PlanSelectionStep";
import { VerificationStep } from "@/components/signup/verification";
import VisualIdentityStep from "@/components/signup/VisualIdentityStep";
import BrandSettingsStep from "@/components/signup/BrandSettingsStep";
import BusinessSetupStep from "@/components/signup/BusinessSetupStep";
import IntegrationsStep from "@/components/signup/IntegrationsStep";
import WorkingHoursStep from "@/components/signup/WorkingHoursStep";
import WelcomeCompleteStep from "@/components/signup/WelcomeCompleteStep";
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
  onCreateAccount?: () => void;
}

// Define step configuration for better organization
export const STEP_COMPONENTS = {
  PERSONAL_INFO: 0,
  PLAN_SELECTION: 1,
  VERIFICATION: 2,
  BUSINESS_SETUP: 3,
  VISUAL_IDENTITY: 4,
  BRAND_SETTINGS: 5,
  INTEGRATIONS: 6,
  WORKING_HOURS: 7,
  WELCOME_COMPLETE: 8
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
  updateSignupData,
  onCreateAccount
}: StepRendererProps) => {
  // Use a switch statement for clear step rendering logic
  switch (currentStep) {
    case STEP_COMPONENTS.PERSONAL_INFO:
      return (
        <PersonalInfoStep 
          onCreateAccount={onCreateAccount}
        />
      );
      
    case STEP_COMPONENTS.PLAN_SELECTION:
      return (
        <PlanSelectionStep 
          data={signupData}
          updateData={updateSignupData}
        />
      );
      
    case STEP_COMPONENTS.VERIFICATION:
      return <VerificationStep />;
      
    case STEP_COMPONENTS.BUSINESS_SETUP:
      return <BusinessSetupStep />;
      
    case STEP_COMPONENTS.VISUAL_IDENTITY:
      return <VisualIdentityStep />;
      
    case STEP_COMPONENTS.BRAND_SETTINGS:
      return <BrandSettingsStep />;
      
    case STEP_COMPONENTS.INTEGRATIONS:
      return <IntegrationsStep />;
      
    case STEP_COMPONENTS.WORKING_HOURS:
      return <WorkingHoursStep />;
      
    case STEP_COMPONENTS.WELCOME_COMPLETE:
      return (
        <WelcomeCompleteStep 
          businessName={businessName} 
          businessDomain={businessDomain}
          businessId={businessId}
          isEmailVerified={isEmailVerified}
          isPhoneVerified={isPhoneVerified}
          onResendVerification={onResendVerification}
        />
      );
      
    default:
      return (
        <PersonalInfoStep 
          onCreateAccount={onCreateAccount}
        />
      );
  }
};

export default StepRenderer;
