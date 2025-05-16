
import { useSignup } from "@/contexts/SignupContext";
import PlanOptions from "./PlanOptions";
import PaymentDetails from "./PaymentDetails";
import LegalDisclaimer from "./LegalDisclaimer";
import { PaymentStepProps } from "./types";
import { usePaymentStep } from "./usePaymentStep";

const PaymentStep = ({ data, updateData }: PaymentStepProps) => {
  const {
    firstName,
    selectedPlan,
    showPaymentInfo,
    paymentInfo,
    isPaidPlan,
    handlePlanChange,
    handlePaymentInfoChange,
    validatePaymentInfo,
    processPayment
  } = usePaymentStep(data, updateData);

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
