import PersonalInfoStep from "@/components/signup/PersonalInfoStep";
import PlanSelectionStep from "@/components/signup/PlanSelectionStep";
import { VerificationStep } from "@/components/signup/verification";
import WelcomeVerificationStep from "@/components/signup/verification/WelcomeVerificationStep";
import BrandIdentityStep from "@/components/signup/BrandIdentityStep";
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
  BRAND_IDENTITY: 4,
  INTEGRATIONS: 5,
  WORKING_HOURS: 6,
  WELCOME_COMPLETE: 7
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
      
    case STEP_COMPONENTS.BRAND_IDENTITY:
      return <BrandIdentityStep />;
      
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
