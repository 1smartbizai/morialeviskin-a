
import { useSignup } from "@/contexts/SignupContext";
import PlanOptions from "./PlanOptions";
import PaymentDetails from "./PaymentDetails";
import LegalDisclaimer from "./LegalDisclaimer";
import { PaymentStepProps } from "./types";
import { usePaymentStep } from "./usePaymentStep";
import { FeatureGate, PlanBadge } from "@/components/plan-gating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

      {/* Feature Preview Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>תצוגה מקדימה של הפונקציות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureGate 
              feature="unlimited_clients" 
              fallback={
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground">
                    לקוחות ללא הגבלה - זמין בתכנית Pro ומעלה
                  </p>
                </div>
              }
              showBadge={true}
            >
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium">✅ לקוחות ללא הגבלה</p>
              </div>
            </FeatureGate>

            <FeatureGate 
              feature="sms_messaging" 
              fallback={
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground">
                    הודעות SMS - זמין בתכנית Pro ומעלה
                  </p>
                </div>
              }
              showBadge={true}
            >
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium">✅ הודעות SMS</p>
              </div>
            </FeatureGate>

            <FeatureGate 
              feature="advanced_analytics" 
              fallback={
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground">
                    אנליטיקה מתקדמת - זמין בתכנית Pro ומעלה
                  </p>
                </div>
              }
              showBadge={true}
            >
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium">✅ דוחות מתקדמים</p>
              </div>
            </FeatureGate>

            <FeatureGate 
              feature="custom_branding" 
              fallback={
                <div className="text-center p-4">
                  <p className="text-sm text-muted-foreground">
                    מיתוג מותאם - זמין בתכנית Gold ומעלה
                  </p>
                </div>
              }
              showBadge={true}
            >
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium">✅ מיתוג מותאם אישית</p>
              </div>
            </FeatureGate>
          </div>
        </CardContent>
      </Card>

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
