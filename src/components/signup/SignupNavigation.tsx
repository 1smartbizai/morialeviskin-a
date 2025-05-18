
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSignup } from "@/contexts/SignupContext";
import { STEP_COMPONENTS } from "./StepRenderer";

interface NavigationProps {
  onNext: () => void;
  onPrevious: () => void;
}

// Define step configuration for UI display
export const steps = [
  { title: "פרטים אישיים" },
  { title: "זהות ויזואלית" },
  { title: "הגדרות מותג" },
  { title: "שעות פעילות" },
  { title: "מנוי" },
  { title: "סיום" },
];

const SignupNavigation = ({ onNext, onPrevious }: NavigationProps) => {
  const { currentStep, isLoading, signupData } = useSignup();
  
  // Calculate progress percentage for current step
  // Note: We use steps.length to calculate progress, the verification step is "special" and not reflected in the progress
  const totalSteps = steps.length;
  const currentStepIndex = currentStep === STEP_COMPONENTS.VERIFICATION 
    ? 0 // Keep at 0% for verification step 
    : currentStep > STEP_COMPONENTS.VERIFICATION 
      ? currentStep - 1 // Adjust for verification step in progress calculation
      : currentStep;
  
  const progress = ((currentStepIndex) / (totalSteps - 1)) * 100;

  // Determine button text based on the current step
  const getNextButtonText = () => {
    if (isLoading) return "טוען...";
    
    if (currentStep === STEP_COMPONENTS.PERSONAL_INFO) return "המשך";
    if (currentStep === STEP_COMPONENTS.VERIFICATION) {
      if (signupData.isEmailVerified) return "המשך להקמת העסק";
      return "אני מבינה";
    }
    if (currentStep === STEP_COMPONENTS.SUCCESS) return "מעבר למערכת";
    return "המשך";
  };

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0 || isLoading}
        className="flex items-center gap-2"
      >
        <ChevronRight className="h-4 w-4" />
        חזרה
      </Button>

      <div className="text-sm text-muted-foreground">
        {Math.round(progress)}% הושלם
      </div>

      <Button
        onClick={onNext}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        {getNextButtonText()}
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SignupNavigation;
