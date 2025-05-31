
import { useState, useEffect } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Star, Crown, Gem, Info, CreditCard } from "lucide-react";
import { plans } from "./payment/planData";
import PaymentDetails from "./payment/PaymentDetails";
import { PaymentInfoState } from "./payment/types";

interface PlanSelectionStepProps {
  data: any;
  updateData: (data: any) => void;
}

const PlanSelectionStep = ({ data, updateData }: PlanSelectionStepProps) => {
  const { signupData } = useSignup();
  const [selectedPlan, setSelectedPlan] = useState<string>("pro"); // Pro as default
  const [showPaymentInfo, setShowPaymentInfo] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoState>({
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardholderName: "",
    errors: {}
  });

  // Check if the selected plan requires payment
  const selectedPlanDetails = plans.find(plan => plan.id === selectedPlan);
  const isPaidPlan = selectedPlanDetails && !selectedPlanDetails.isFree;

  // Show payment info for paid plans
  useEffect(() => {
    if (isPaidPlan) {
      setShowPaymentInfo(true);
    } else {
      setShowPaymentInfo(false);
    }
  }, [selectedPlan, isPaidPlan]);

  // Update context when plan changes
  useEffect(() => {
    updateData({ 
      subscriptionLevel: selectedPlan,
      trialEndDate: selectedPlan === 'starter' ? 
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : 
        undefined
    });
  }, [selectedPlan, updateData]);

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
  };

  // Handle payment info changes
  const handlePaymentInfoChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: undefined
      }
    }));
  };

  // Validate payment information
  const validatePaymentInfo = () => {
    if (selectedPlan === 'starter') {
      return true; // No payment needed for free plan
    }

    const { cardNumber, cardExpiry, cardCvv, cardholderName } = paymentInfo;
    const errors: PaymentInfoState['errors'] = {};
    
    if (!cardholderName.trim()) {
      errors.cardholderName = "אנא הזיני את שם בעל/ת הכרטיס";
    }
    
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber) {
      errors.cardNumber = "אנא הזיני את מספר הכרטיס";
    } else if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
      errors.cardNumber = "מספר כרטיס לא תקין";
    }
    
    if (!cardExpiry) {
      errors.cardExpiry = "אנא הזיני את תוקף הכרטיס";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      errors.cardExpiry = "פורמט לא תקין";
    }
    
    if (!cardCvv) {
      errors.cardCvv = "אנא הזיני את קוד האבטחה";
    } else if (!/^\d{3,4}$/.test(cardCvv)) {
      errors.cardCvv = "קוד אבטחה לא תקין";
    }
    
    setPaymentInfo(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter': return <Star className="h-6 w-6" />;
      case 'pro': return <CheckCircle2 className="h-6 w-6" />;
      case 'gold': return <Crown className="h-6 w-6" />;
      case 'premium': return <Gem className="h-6 w-6" />;
      default: return <Star className="h-6 w-6" />;
    }
  };

  const isFormValid = () => {
    if (selectedPlan === 'starter') return true;
    return validatePaymentInfo();
  };

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-primary">
          {signupData.firstName ? `${signupData.firstName}, ` : ''}בחרי את התכנית המתאימה לעסק שלך
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          התכנית שתבחרי תקבע את היכולות שיהיו זמינות לך ב-Bellevo
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg hover-scale ${
              selectedPlan === plan.id 
                ? 'ring-2 ring-primary shadow-lg scale-105' 
                : 'hover:ring-1 hover:ring-gray-300'
            }`}
            onClick={() => handlePlanChange(plan.id)}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white px-4 py-1">הכי פופולרי</Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`mx-auto mb-3 p-3 rounded-full ${
                selectedPlan === plan.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                {getPlanIcon(plan.id)}
              </div>
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {plan.isFree ? 'חינם' : `₪${plan.price}`}
                  {!plan.isFree && <span className="text-sm font-normal text-muted-foreground">/חודש</span>}
                </div>
                {plan.isFree && (
                  <p className="text-sm text-orange-600 font-medium">
                    14 ימי עסקים בלבד
                  </p>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-center text-muted-foreground mb-4">
                {plan.description}
              </p>
              
              <ul className="space-y-2 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              {selectedPlan === plan.id && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 text-primary font-medium text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    תכנית נבחרת
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Free Plan Warning */}
      {selectedPlan === 'starter' && (
        <Alert className="bg-orange-50 border-orange-200 animate-fade-in">
          <Info className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-800">
            <div className="font-medium mb-1">תכנית מוגבלת</div>
            <p>התכנית החינמית מוגבלת ל-14 ימי עסקים בלבד. לאחר תום התקופה תצטרכי לשדרג לתכנית בתשלום כדי להמשיך להשתמש במערכת.</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Details for Paid Plans */}
      {showPaymentInfo && isPaidPlan && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-semibold">פרטי תשלום</h3>
          </div>
          <PaymentDetails 
            paymentInfo={paymentInfo}
            onPaymentInfoChange={handlePaymentInfoChange}
            onValidate={validatePaymentInfo}
          />
        </div>
      )}

      {/* Selected Plan Summary */}
      {selectedPlanDetails && (
        <Card className="bg-gradient-to-l from-purple-50 to-pink-50 border-primary/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  התכנית שנבחרה: {selectedPlanDetails.name}
                </h3>
                <p className="text-muted-foreground">
                  {selectedPlanDetails.isFree ? 'חינם ל-14 ימי עסקים' : `₪${selectedPlanDetails.price} לחודש`}
                </p>
              </div>
              <div className="text-primary">
                {getPlanIcon(selectedPlan)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanSelectionStep;
