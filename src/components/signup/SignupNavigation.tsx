import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "@/contexts/SignupContext";

export const steps = [
  { id: 'personal', title: 'פרטים אישיים' },
  { id: 'visual', title: 'זהות ויזואלית' },
  { id: 'brand', title: 'הגדרות מותג' },
  { id: 'payment', title: 'מנוי' },
  { id: 'hours', title: 'שעות פעילות' },
  { id: 'success', title: 'סיום' }
];

interface SignupNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
}

const SignupNavigation = ({ onNext, onPrevious }: SignupNavigationProps) => {
  const { currentStep, isLoading, signupData } = useSignup();
  const navigate = useNavigate();
  
  // Handle the "back" button click
  const handleBack = () => {
    if (currentStep === 0) {
      // If on the first step, navigate to the homepage
      navigate('/');
    } else {
      // Otherwise, go to the previous step
      onPrevious();
    }
  };
  
  // Determine if the next button should be disabled based on the current step
  const isNextDisabled = () => {
    if (isLoading) return true;
    
    // Step-specific validation
    switch (currentStep) {
      case 0: // Personal info step
        return !signupData.isPersonalInfoValid;
      // Add validation for other steps as needed
      default:
        return false;
    }
  };
  
  return (
    <div className="flex justify-between mt-8" dir="rtl">
      <Button 
        variant="outline"
        onClick={handleBack}
        disabled={isLoading}
      >
        <ChevronRight className="ml-2 h-4 w-4" /> חזרה
      </Button>
      
      <Button 
        onClick={onNext}
        disabled={isNextDisabled()}
      >
        {currentStep === steps.length - 1 ? (
          'היכנסי ללוח הבקרה'
        ) : (
          <>
            המשך <ChevronLeft className="mr-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default SignupNavigation;
