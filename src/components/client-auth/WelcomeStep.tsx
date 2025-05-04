
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface WelcomeStepProps {
  onContinue: () => void;
}

const WelcomeStep = ({ onContinue }: WelcomeStepProps) => {
  return (
    <div className="text-center py-6" dir="rtl">
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-green-100 p-3">
          <Check className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-2">
        איזה כיף שחזרת!
      </h3>
      
      <p className="text-muted-foreground mb-8">
        ההרשמה הושלמה בהצלחה. אנו שמחים לראות אותך כאן!
      </p>
      
      <Button 
        onClick={onContinue} 
        className="w-full"
      >
        המשך לאזור האישי
      </Button>
    </div>
  );
};

export default WelcomeStep;
