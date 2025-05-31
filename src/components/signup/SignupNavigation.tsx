
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
  { title: "בחירת תכנית" },
  { title: "אימות חשבון" },
  { title: "הגדרות עסק" },
  { title: "זהות ויזואלית" },
  { title: "הגדרות מותג" },
  { title: "אינטגרציות" },
  { title: "שעות פעילות" },
  { title: "סיום" },
];

const SignupNavigation = ({ onNext, onPrevious }: NavigationProps) => {
  const { currentStep, isLoading, signupData } = useSignup();
  
  // Calculate progress percentage for current step
  const totalSteps = steps?.length || 9;
  const progress = (currentStep / (totalSteps - 1)) * 100;

  // Determine button text based on the current step
  const getNextButtonText = () => {
    if (isLoading) return "טוען...";
    
    if (currentStep === STEP_COMPONENTS.PERSONAL_INFO) return "המשך לבחירת תכנית";
    if (currentStep === STEP_COMPONENTS.PLAN_SELECTION) return "פתח חשבון";
    if (currentStep === STEP_COMPONENTS.VERIFICATION) {
      if (signupData?.isEmailVerified) return "המשך להקמת העסק";
      return "אני מבינה";
    }
    if (currentStep === STEP_COMPONENTS.WELCOME_COMPLETE) return "מעבר למערכת";
    return "המשך";
  };

  // Hide navigation on welcome complete step until setup is done
  if (currentStep === STEP_COMPONENTS.WELCOME_COMPLETE) {
    return (
      <div className="flex justify-center items-center mt-8 pt-6 border-t">
        <Button
          onClick={onNext}
          disabled={isLoading}
          className="px-8 py-3 text-lg font-semibold flex items-center gap-2 hover-scale"
          size="lg"
        >
          {getNextButtonText()}
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0 || isLoading}
        className="flex items-center gap-2 hover-scale"
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
        className="flex items-center gap-2 hover-scale"
      >
        {getNextButtonText()}
        <ChevronLeft className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SignupNavigation;
