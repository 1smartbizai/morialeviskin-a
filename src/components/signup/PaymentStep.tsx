
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle, CreditCard } from "lucide-react";
import { SignupData, useSignup } from "@/contexts/SignupContext";
import { toast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/utils/formatters";

interface PaymentStepProps {
  data: Partial<SignupData>;
  updateData: (data: Partial<SignupData>) => void;
}

interface PlanOption {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
  isFree?: boolean;
  trialDays?: number;
}

const plans: PlanOption[] = [
  {
    id: "free",
    name: "חינמי",
    price: 0,
    features: [
      "עד 10 לקוחות",
      "ניהול תורים בסיסי",
      "מאגר לקוחות בסיסי",
      "זמין לניסיון 30 יום",
    ],
    isFree: true,
    trialDays: 30
  },
  {
    id: "lite",
    name: "Lite",
    price: 2990,  // 29.90₪ in agorot (before VAT)
    features: [
      "עד 50 לקוחות",
      "ניהול תורים",
      "מאגר לקוחות",
      "מעקב תשלומים",
      "הודעות SMS",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 9900,  // 99₪ in agorot
    features: [
      "עד 200 לקוחות",
      "ניהול תורים מתקדם",
      "מאגר לקוחות עם פרופילים מפורטים",
      "מעקב תשלומים וחשבוניות",
      "כלי שיווק",
      "הודעות SMS",
      "חיבור לרשתות חברתיות",
    ],
    recommended: true,
  },
  {
    id: "gold",
    name: "Gold",
    price: 19900,  // 199₪ in agorot
    features: [
      "לקוחות ללא הגבלה",
      "מערכת תורים מלאה",
      "פרופילי לקוחות מקיפים",
      "ניהול פיננסי מלא",
      "קמפיינים שיווקיים מתקדמים",
      "תמיכה בצוות עבודה",
      "מיתוג מותאם אישית",
      "תמיכה בעדיפות גבוהה",
    ],
  },
];

const PaymentStep = ({ data, updateData }: PaymentStepProps) => {
  const { signupData, currentStep } = useSignup();
  const [selectedPlan, setSelectedPlan] = useState<string>(data?.subscriptionLevel || "pro");
  const [showPaymentInfo, setShowPaymentInfo] = useState<boolean>(false);
  const [firstName] = useState<string>(signupData.firstName || '');
  const [isPaymentValid, setIsPaymentValid] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardholderName: "",
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
      // For free plans, we don't need validation of payment
      setIsPaymentValid(true);
    }
  }, [selectedPlan, isPaidPlan]);

  // Make sure the selected plan is synced with the context
  useEffect(() => {
    if (data?.subscriptionLevel && data.subscriptionLevel !== selectedPlan) {
      setSelectedPlan(data.subscriptionLevel);
    } else if (!data?.subscriptionLevel && selectedPlan) {
      updateData({ 
        subscriptionLevel: selectedPlan,
        // Set trial end date if selecting free plan
        trialEndDate: selectedPlan === 'free' ? 
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : 
          undefined
      });
    }
  }, [data?.subscriptionLevel]);

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    updateData({ 
      subscriptionLevel: planId,
      // Set trial end date if selecting free plan
      trialEndDate: planId === 'free' ? 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : 
        undefined
    });
    
    // Reset payment validation when switching plans
    if (planId === 'free') {
      setIsPaymentValid(true);
    } else {
      setIsPaymentValid(false);
    }
  };

  // Validate payment information
  const validatePaymentInfo = () => {
    const { cardNumber, cardExpiry, cardCvv, cardholderName } = paymentInfo;
    
    // Perform basic validation
    const isCardNumberValid = cardNumber.replace(/\s/g, '').length === 16;
    const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry);
    const isCvvValid = /^\d{3,4}$/.test(cardCvv);
    const isNameValid = cardholderName.trim().length > 0;
    
    const isValid = isCardNumberValid && isExpiryValid && isCvvValid && isNameValid;
    setIsPaymentValid(isValid);
    
    return isValid;
  };

  // Handle payment info changes
  const handlePaymentInfoChange = (field: string, value: string) => {
    setPaymentInfo(prev => {
      const updated = { ...prev, [field]: value };
      return updated;
    });
  };

  // Simulate payment processing
  const processPayment = async () => {
    if (!isPaidPlan) return true;
    
    if (!validatePaymentInfo()) {
      toast({
        variant: "destructive",
        title: "פרטי תשלום שגויים",
        description: "אנא ודאי שכל פרטי התשלום הוזנו בצורה נכונה"
      });
      return false;
    }
    
    // Simulate payment processing
    try {
      // In a real implementation, we would call a payment API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "התשלום בוצע בהצלחה!",
        description: `נרשמת בהצלחה לתכנית ${selectedPlanDetails?.name}`
      });
      
      return true;
    } catch (error) {
      console.error("שגיאה בביצוע התשלום:", error);
      toast({
        variant: "destructive",
        title: "שגיאה בביצוע התשלום",
        description: "אנא נסי שנית או בחרי אמצעי תשלום אחר"
      });
      return false;
    }
  };

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
      
      <RadioGroup 
        value={selectedPlan} 
        onValueChange={handlePlanChange} 
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {plans.map((plan) => (
          <div key={plan.id} className="relative">
            <RadioGroupItem
              value={plan.id}
              id={plan.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={plan.id}
              className={`flex flex-col h-full p-4 border rounded-lg cursor-pointer ${
                selectedPlan === plan.id
                  ? "border-primary bg-primary/5"
                  : "border-muted bg-background"
              } ${
                plan.recommended ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.recommended && (
                <span className="absolute -top-2 right-1/2 transform translate-x-1/2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                  מומלץ
                </span>
              )}
              {plan.isFree && (
                <span className="absolute -top-2 right-1/2 transform translate-x-1/2 px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
                  ללא תשלום
                </span>
              )}
              <div className="mb-4 mt-2">
                <div className="text-lg font-semibold">{plan.name}</div>
                <div className="text-2xl font-bold mt-1">
                  {plan.price === 0 ? 'חינם' : `${formatCurrency(plan.price / 100)}`}
                  {plan.price > 0 && <span className="text-sm text-muted-foreground font-normal">/חודש</span>}
                  {plan.trialDays && <span className="text-sm text-muted-foreground font-normal"> ל-{plan.trialDays} יום</span>}
                </div>
              </div>
              <ul className="space-y-2 text-sm flex-grow pr-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-4 w-4 ml-2 mt-0.5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {showPaymentInfo && (
        <div className="mt-8 transition-all">
          <Card className="border-primary/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">פרטי תשלום</CardTitle>
                  <CardDescription>אנא הזיני את פרטי התשלום שלך</CardDescription>
                </div>
                <CreditCard className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="cardholderName">שם בעל הכרטיס</Label>
                  <input
                    id="cardholderName"
                    placeholder="ישראלה ישראלי"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                    value={paymentInfo.cardholderName}
                    onChange={(e) => handlePaymentInfoChange('cardholderName', e.target.value)}
                    onBlur={validatePaymentInfo}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">מספר כרטיס</Label>
                  <input
                    id="cardNumber"
                    placeholder="4580 1234 5678 9012"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                    value={paymentInfo.cardNumber}
                    onChange={(e) => handlePaymentInfoChange('cardNumber', e.target.value)}
                    onBlur={validatePaymentInfo}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiry">תוקף (MM/YY)</Label>
                    <input
                      id="expiry"
                      placeholder="12/25"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                      value={paymentInfo.cardExpiry}
                      onChange={(e) => handlePaymentInfoChange('cardExpiry', e.target.value)}
                      onBlur={validatePaymentInfo}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvc">CVV</Label>
                    <input
                      id="cvc"
                      placeholder="123"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                      value={paymentInfo.cardCvv}
                      onChange={(e) => handlePaymentInfoChange('cardCvv', e.target.value)}
                      onBlur={validatePaymentInfo}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">תשלום מאובטח:</span> פרטי התשלום שלך מעובדים באופן מאובטח. איננו שומרים את פרטי הכרטיס שלך.
              </p>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="bg-muted/30 p-4 rounded-lg mt-4">
        <p className="text-sm text-muted-foreground">
          בהמשך, את מסכימה לתנאי השימוש שלנו ומאשרת כי המנוי שלך יופעל מיד. 
          {selectedPlan === 'free' 
            ? " בסיום 30 ימים תתבקשי לבחור תכנית בתשלום להמשך שימוש במערכת." 
            : " תוכלי לבטל בכל עת מהגדרות החשבון שלך."}
        </p>
      </div>

      {/* Export the processPayment function so it can be used in SignupContent */}
      {/* @ts-ignore - Intentionally attaching to component for use in parent */}
      PaymentStep.processPayment = processPayment;
    </div>
  );
};

export default PaymentStep;
