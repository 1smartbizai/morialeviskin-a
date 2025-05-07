
import PersonalInfoStep from "@/components/signup/PersonalInfoStep";
import VisualIdentityStep from "@/components/signup/VisualIdentityStep";
import BrandSettingsStep from "@/components/signup/BrandSettingsStep";
import PaymentStep from "@/components/signup/PaymentStep";
import WorkingHoursStep from "@/components/signup/WorkingHoursStep";
import SuccessStep from "@/components/signup/SuccessStep";
import { SignupData } from "@/contexts/SignupContext";

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
  switch (currentStep) {
    case 0:
      return <PersonalInfoStep />;
    case 1:
      return <VisualIdentityStep />;
    case 2:
      return <BrandSettingsStep />;
    case 3:
      return <PaymentStep 
        data={signupData}
        updateData={updateSignupData}
      />;
    case 4:
      return <WorkingHoursStep />;
    case 5:
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
