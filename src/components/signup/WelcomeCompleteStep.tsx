
import { useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import SetupProgress from "./welcome/SetupProgress";
import WelcomeHeader from "./welcome/WelcomeHeader";
import BusinessSummaryCard from "./welcome/BusinessSummaryCard";
import FeaturesPreview from "./welcome/FeaturesPreview";
import NextStepsCard from "./welcome/NextStepsCard";
import WelcomeConfetti from "./welcome/WelcomeConfetti";

interface WelcomeCompleteStepProps {
  businessName: string;
  businessDomain?: string;
  businessId?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  onResendVerification: () => void;
}

const WelcomeCompleteStep = ({ 
  businessName,
  businessDomain,
  businessId,
  isEmailVerified,
  isPhoneVerified,
  onResendVerification
}: WelcomeCompleteStepProps) => {
  const { signupData } = useSignup();
  const [isComplete, setIsComplete] = useState(false);

  const handleSetupComplete = () => {
    setIsComplete(true);
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center space-y-8 animate-fade-in" dir="rtl">
      <WelcomeConfetti onComplete={isComplete} />

      {!isComplete ? (
        <SetupProgress onComplete={handleSetupComplete} />
      ) : (
        <>
          <WelcomeHeader businessName={businessName} businessDomain={businessDomain} />
          <BusinessSummaryCard businessName={businessName} businessDomain={businessDomain} />
          <FeaturesPreview businessName={businessName} />
          <NextStepsCard />
        </>
      )}
    </div>
  );
};

export default WelcomeCompleteStep;
