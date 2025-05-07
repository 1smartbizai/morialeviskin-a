
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const { currentStep, isLoading } = useSignup();

  return (
    <div className="flex justify-between mt-8">
      <Button 
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 0 || isLoading}
        className="flex-row-reverse"
      >
        חזרה <ChevronLeft className="mr-2 h-4 w-4" />
      </Button>
      
      <Button 
        onClick={onNext}
        disabled={isLoading}
        className="flex-row-reverse"
      >
        {currentStep === steps.length - 1 ? (
          'היכנסי ללוח הבקרה'
        ) : (
          <>
            המשך <ChevronRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default SignupNavigation;
