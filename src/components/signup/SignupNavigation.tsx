
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "@/contexts/SignupContext";

export const steps = [
  { id: 'personal', title: 'פרטים אישיים' },
  { id: 'visual', title: 'זהות ויזואלית' },
  { id: 'brand', title: 'הגדרות מותג' },
  { id: 'connections', title: 'שעות פעילות וחיבורים' },
  { id: 'payment', title: 'בחירת תכנית' },
  { id: 'success', title: 'סיום' }
];

interface SignupNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
}

const SignupNavigation = ({ onNext, onPrevious }: SignupNavigationProps) => {
  const { currentStep, isLoading, signupData } = useSignup();
  const navigate = useNavigate();
  const isPaymentStep = currentStep === 4; // Payment is step index 4
  const isLastStep = currentStep === steps.length - 1;
  
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

  // Define container class based on current step
  const containerClass = isPaymentStep 
    ? "flex flex-col items-center mt-8" 
    : "flex justify-between mt-8";
  
  return (
    <div className={containerClass} dir="rtl">
      {!isPaymentStep ? (
        // Regular navigation with buttons on both sides
        <>
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
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                מעבד...
              </span>
            ) : isLastStep ? (
              'כניסה למערכת'
            ) : (
              <>
                המשך <ChevronLeft className="mr-2 h-4 w-4" />
              </>
            )}
          </Button>
        </>
      ) : (
        // Special centered layout for payment step
        <>
          <Button 
            variant="outline"
            onClick={handleBack}
            className="mb-6 self-start"
            disabled={isLoading}
          >
            <ChevronRight className="ml-2 h-4 w-4" /> חזרה
          </Button>
          
          <Button 
            onClick={onNext}
            disabled={isNextDisabled()}
            size="lg" 
            className="px-10 py-6 text-lg font-bold"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                מעבד תשלום...
              </span>
            ) : (
              'סיום ויצירת עסק'
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default SignupNavigation;
