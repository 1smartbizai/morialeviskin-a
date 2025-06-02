
import { useState, useEffect } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Star, Crown, Gem, Info, CreditCard, ArrowRight, Sparkles } from "lucide-react";
import { plans } from "./payment/planData";
import PaymentDetails from "./payment/PaymentDetails";
import { PaymentInfoState } from "./payment/types";

interface PlanSelectionStepProps {
  data: any;
  updateData: (data: any) => void;
}

const PlanSelectionStep = ({ data, updateData }: PlanSelectionStepProps) => {
  const { signupData } = useSignup();
  const [selectedPlan, setSelectedPlan] = useState<string>("pro"); // Pro as recommended default
  const [showPaymentInfo, setShowPaymentInfo] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoState>({
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardholderName: "",
    errors: {}
  });
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [marketingConsent, setMarketingConsent] = useState<boolean>(false);
  const [showComparison, setShowComparison] = useState<boolean>(false);

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

  // Validate payment information with HYP integration requirements
  const validatePaymentInfo = () => {
    if (selectedPlan === 'starter') {
      return true; // No payment needed for free plan
    }

    const { cardNumber, cardExpiry, cardCvv, cardholderName } = paymentInfo;
    const errors: PaymentInfoState['errors'] = {};
    
    if (!cardholderName.trim()) {
      errors.cardholderName = "אנא הזיני את שם בעל/ת הכרטיס כפי שמופיע על הכרטיס";
    }
    
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber) {
      errors.cardNumber = "אנא הזיני את מספר הכרטיס";
    } else if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
      errors.cardNumber = "מספר כרטיס לא תקין - יש להזין 16 ספרות בדיוק";
    }
    
    if (!cardExpiry) {
      errors.cardExpiry = "אנא הזיני את תוקף הכרטיס";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      errors.cardExpiry = "פורמט תוקף לא תקין - יש להזין MM/YY";
    } else {
      // Check if card is expired
      const [month, year] = cardExpiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const today = new Date();
      if (expiryDate < today) {
        errors.cardExpiry = "הכרטיס פג תוקף - אנא השתמשי בכרטיס תקף";
      }
    }
    
    if (!cardCvv) {
      errors.cardCvv = "אנא הזיני את קוד האבטחה";
    } else if (!/^\d{3,4}$/.test(cardCvv)) {
      errors.cardCvv = "קוד אבטחה לא תקין - יש להזין 3-4 ספרות";
    }
    
    setPaymentInfo(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter': return <Star className="h-8 w-8" />;
      case 'pro': return <CheckCircle2 className="h-8 w-8" />;
      case 'gold': return <Crown className="h-8 w-8" />;
      case 'premium': return <Gem className="h-8 w-8" />;
      default: return <Star className="h-8 w-8" />;
    }
  };

  const canProceed = () => {
    if (selectedPlan === 'starter') {
      return true; // Free plan doesn't need payment or consent
    }
    return validatePaymentInfo() && termsAccepted && marketingConsent;
  };

  const handleFinish = async () => {
    if (!canProceed()) {
      if (isPaidPlan && !termsAccepted) {
        toast({
          title: "נדרש אישור תנאי השימוש",
          description: `${signupData.firstName}, עליך לאשר את תנאי השימוש כדי להמשיך`,
          variant: "destructive"
        });
        return;
      }
      if (isPaidPlan && !marketingConsent) {
        toast({
          title: "נדרש אישור קבלת דיוור",
          description: `${signupData.firstName}, עליך לאשר קבלת דיוור שיווקי כדי להמשיך`,
          variant: "destructive"
        });
        return;
      }
      if (isPaidPlan && !validatePaymentInfo()) {
        toast({
          title: "פרטי התשלום שגויים",
          description: `${signupData.firstName}, אנא ודאי שכל פרטי התשלום הוזנו בצורה נכונה`,
          variant: "destructive"
        });
        return;
      }
    }

    // Process payment through HYP if needed
    if (isPaidPlan) {
      try {
        // Here would be the HYP payment integration
        // Using the API key: f1c85d16fc1acd369a93f0489f4615d93371632d97a9b0a197de6d4dc0da51bf
        console.log("Processing payment through HYP with API key");
        
        toast({
          title: `ברוכה הבאה, ${signupData.firstName}!`,
          description: `התשלום בוצע בהצלחה. נרשמת לתכנית ${selectedPlanDetails?.name}`,
        });
      } catch (error) {
        toast({
          title: "שגיאה בביצוע התשלום",
          description: `${signupData.firstName}, אנא נסי שוב או בחרי אמצעי תשלום אחר`,
          variant: "destructive"
        });
        return;
      }
    } else {
      toast({
        title: `ברוכה הבאה, ${signupData.firstName}!`,
        description: "נרשמת בהצלחה לתכנית הניסיון החינמית של 14 יום",
      });
    }

    // Continue to next step (verification)
    // This will be handled by the parent component
  };

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
          {signupData.firstName ? `${signupData.firstName}, ` : ''}בחרי את התכנית המושלמת עבורך
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          כל תכנית מותאמת לקצב הצמיחה שלך ומספקת את הכלים המתקדמים לניהול מותג יעיל
        </p>
        
        {/* Plan Comparison Toggle */}
        <Button 
          variant="outline" 
          onClick={() => setShowComparison(!showComparison)}
          className="mt-4 hover-scale"
        >
          {showComparison ? 'הסתר השוואה' : 'השווה תכניות'}
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={plan.id} 
            className={`relative cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
              selectedPlan === plan.id 
                ? 'ring-4 ring-primary shadow-2xl scale-105 bg-gradient-to-b from-primary/5 to-primary/10' 
                : 'hover:ring-2 hover:ring-primary/50'
            } ${plan.recommended ? 'border-primary border-2' : ''}`}
            onClick={() => handlePlanChange(plan.id)}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-6 py-2 text-sm font-bold animate-pulse">
                  🌟 המומלצת ביותר
                </Badge>
              </div>
            )}
            
            {plan.isFree && (
              <div className="absolute -top-4 right-4 z-10">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 text-sm font-bold">
                  חינם!
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4 pt-8">
              <div className={`mx-auto mb-4 p-4 rounded-full transition-all duration-300 ${
                selectedPlan === plan.id 
                  ? 'bg-gradient-to-br from-primary to-purple-600 text-white scale-110' 
                  : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 hover:scale-105'
              }`}>
                {getPlanIcon(plan.id)}
              </div>
              <CardTitle className="text-2xl font-bold text-primary">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">
                  {plan.isFree ? (
                    <span className="text-green-600">חינם</span>
                  ) : (
                    <>₪{plan.price}<span className="text-lg font-normal text-muted-foreground">/חודש</span></>
                  )}
                </div>
                {plan.isFree && (
                  <p className="text-sm text-orange-600 font-medium bg-orange-50 px-3 py-1 rounded-full">
                    ⏰ 14 ימי ניסיון בלבד
                  </p>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-sm text-center text-muted-foreground mb-6 leading-relaxed">
                {plan.description}
              </p>
              
              <ul className="space-y-3 text-sm">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="group-hover:text-primary transition-colors">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {selectedPlan === plan.id && (
                <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-lg border border-primary/20 animate-fade-in">
                  <div className="flex items-center gap-2 text-primary font-bold text-sm">
                    <CheckCircle2 className="h-5 w-5" />
                    התכנית שבחרת
                    <ArrowRight className="h-4 w-4 animate-bounce" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      {showComparison && (
        <div className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">השוואת תכניות מפורטת</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right p-3">תכונה</th>
                      {plans.map(plan => (
                        <th key={plan.id} className="text-center p-3 font-bold">{plan.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">מחיר חודשי</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center p-3">
                          {plan.isFree ? 'חינם' : `₪${plan.price}`}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">מספר לקוחות</td>
                      <td className="text-center p-3">עד 50</td>
                      <td className="text-center p-3">ללא הגבלה</td>
                      <td className="text-center p-3">ללא הגבלה</td>
                      <td className="text-center p-3">ללא הגבלה</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">הודעות SMS</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3">✅</td>
                      <td className="text-center p-3">✅</td>
                      <td className="text-center p-3">✅</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">מיתוג מותאם</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3">❌</td>
                      <td className="text-center p-3">✅</td>
                      <td className="text-center p-3">✅</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Free Plan Information */}
      {selectedPlan === 'starter' && (
        <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 animate-fade-in">
          <Info className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800">
            <div className="space-y-2">
              <div className="font-bold text-lg">🎉 תכנית הניסיון החינמית</div>
              <p>קיבלת גישה ל-14 ימי ניסיון חינם עם כל התכונות הבסיסיות!</p>
              <p className="text-sm">
                בכל עת תוכלי לשדרג לתכנית בתשלום ולהמשיך ליהנות מהפלטפורמה ללא הגבלות.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 border-green-500 text-green-700 hover:bg-green-100"
              >
                למה כדאי לשדרג מאוחר יותר?
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Payment Details for Paid Plans */}
      {showPaymentInfo && isPaidPlan && (
        <div className="animate-fade-in space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-semibold">פרטי תשלום מאובטח</h3>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              מוגן על ידי HYP
            </Badge>
          </div>
          
          <PaymentDetails 
            paymentInfo={paymentInfo}
            onPaymentInfoChange={handlePaymentInfoChange}
            onValidate={validatePaymentInfo}
          />

          {/* Terms and Marketing Consent */}
          <Card className="bg-gray-50">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={setTermsAccepted}
                  className="mt-1"
                />
                <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                  <span className="font-semibold">אני מאשרת את תנאי השימוש ומדיניות הפרטיות</span>
                  <br />
                  <span className="text-muted-foreground">
                    קראתי והסכמתי לתנאי השימוש של Bellevo ומדיניות הפרטיות
                  </span>
                </label>
              </div>
              
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="marketing"
                  checked={marketingConsent}
                  onCheckedChange={setMarketingConsent}
                  className="mt-1"
                />
                <label htmlFor="marketing" className="text-sm leading-relaxed cursor-pointer">
                  <span className="font-semibold">אני מאשרת קבלת דיוור שיווקי</span>
                  <br />
                  <span className="text-muted-foreground">
                    אני מעוניינת לקבל עדכונים, טיפים וייעוץ מקצועי לפיתוח העסק שלי
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Plan Summary */}
      {selectedPlanDetails && (
        <Card className="bg-gradient-to-l from-purple-50 to-pink-50 border-primary/30 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-primary">
                  התכנית שנבחרה: {selectedPlanDetails.name}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {selectedPlanDetails.isFree ? 
                    '🎉 חינם ל-14 ימי ניסיון' : 
                    `💎 ₪${selectedPlanDetails.price} לחודש`
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedPlanDetails.description}
                </p>
              </div>
              <div className="text-primary">
                {getPlanIcon(selectedPlan)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 hover-scale"
        >
          חזרה לפרטים האישיים
        </Button>

        <Button 
          onClick={handleFinish}
          disabled={!canProceed()}
          className="px-8 py-3 text-lg font-semibold hover-scale bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          size="lg"
        >
          {isPaidPlan ? 'השלם תשלום והמשך' : 'התחל עם התכנית החינמית'}
          <ArrowRight className="h-5 w-5 mr-2" />
        </Button>
      </div>
    </div>
  );
};

export default PlanSelectionStep;
