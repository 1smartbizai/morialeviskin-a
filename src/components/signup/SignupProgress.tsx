
import { useSignup } from "@/contexts/SignupContext";
import { steps } from "./SignupNavigation";

const SignupProgress = () => {
  const { currentStep } = useSignup();

  return (
    <div dir="rtl">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">שלב {currentStep + 1} מתוך {steps.length}</span>
        <span className="text-sm font-medium">{steps[currentStep].title}</span>
      </div>
      <div className="flex gap-1">
        {steps.map((step, index) => (
          <div 
            key={index} // Using index as key since 'id' property doesn't exist
            className={`h-2 flex-1 rounded-full transition-colors ${
              index <= currentStep ? 'bg-primary' : 'bg-muted'
            }`}
            aria-label={`שלב ${index + 1}: ${step.title}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SignupProgress;
