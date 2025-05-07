
import React from 'react';
import { Check } from 'lucide-react';

interface BookingStepperProps {
  currentStep: number;
}

const BookingStepper = ({ currentStep }: BookingStepperProps) => {
  const steps = [
    { number: 1, label: 'בחירת טיפול' },
    { number: 2, label: 'בחירת תאריך' },
    { number: 3, label: 'בחירת שעה' },
    { number: 4, label: 'אישור' }
  ];

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                currentStep > step.number 
                ? 'bg-beauty-primary text-white' 
                : currentStep === step.number 
                ? 'bg-beauty-primary text-white border-2 border-beauty-accent' 
                : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span className={`mt-2 text-xs ${
                currentStep === step.number ? 'font-medium text-beauty-primary' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${
                currentStep > index + 1 ? 'bg-beauty-primary' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BookingStepper;
