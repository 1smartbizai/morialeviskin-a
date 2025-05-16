
import { useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import PlanOptions from "./PlanOptions";
import PaymentDetails from "./PaymentDetails";
import LegalDisclaimer from "./LegalDisclaimer";
import { plans } from "./planData";
import { usePaymentLogic } from "./usePaymentLogic";
import { PaymentStepProps } from "./types";

const PaymentStep = ({ data, updateData }: PaymentStepProps) => {
  const { signupData } = useSignup();
  const [firstName] = useState<string>(signupData.firstName || '');
  
  const {
    selectedPlan,
    showPaymentInfo,
    paymentInfo,
    handlePlanChange,
    handlePaymentInfoChange,
    validatePaymentInfo,
    processPayment
  } = usePaymentLogic(data?.subscriptionLevel, updateData);

  // Check if the selected plan requires payment
  const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan);
  const isPaidPlan = selectedPlanDetails && !selectedPlanDetails.isFree;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-medium">
          {firstName ? `${firstName}, ` : ''}בחרי את המסלול המתאים לעסק שלך
        </h3>
        <p className="text-muted-foreground mt-2">
          התכנית שתבחרי תקבע את היכולות שיהיו זמינות לך ב-Bellevo
        </p>
      </div>
      
      <PlanOptions 
        selectedPlan={selectedPlan}
        onPlanChange={handlePlanChange}
      />

      {showPaymentInfo && (
        <PaymentDetails 
          paymentInfo={paymentInfo}
          onPaymentInfoChange={handlePaymentInfoChange}
          onValidate={validatePaymentInfo}
        />
      )}

      <LegalDisclaimer isPaidPlan={isPaidPlan} />

      {/* Export the processPayment function so it can be used in SignupContent */}
      {/* @ts-ignore - Intentionally attaching to component for use in parent */}
      PaymentStep.processPayment = processPayment;
    </div>
  );
};

export default PaymentStep;
