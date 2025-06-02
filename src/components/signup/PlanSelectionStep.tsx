import { useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { 
  Crown, 
  Star, 
  Zap, 
  Shield, 
  Check, 
  CreditCard, 
  Calendar,
  Users,
  MessageSquare,
  BarChart3,
  Palette,
  Smartphone,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { PLAN_INFO, type PlanType } from "@/utils/planPermissions";

const PlanSelectionStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(signupData.subscriptionLevel as PlanType || 'pro');
  const [showComparison, setShowComparison] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const plans = [
    {
      id: 'starter' as PlanType,
      name: 'Starter',
      price: 0,
      currency: '₪',
      period: 'חינם לתמיד',
      badge: '🌱 להתחלה',
      color: 'bg-green-500',
      description: 'מושלם למי שמתחילה',
      features: [
        'עד 50 לקוחות',
        'ניהול תורים בסיסי',
        'תזכורות SMS',
        'דוחות בסיסיים',
        'תמיכה במייל'
      ],
      limitations: [
        'ללא אינטגרציות',
        'ללא מיתוג מותאם',
        'תמיכה מוגבלת'
      ]
    },
    {
      id: 'pro' as PlanType,
      name: 'Pro',
      price: 149,
      currency: '₪',
      period: 'לחודש',
      badge: '⭐ הכי פופולרי',
      color: 'bg-blue-500',
      description: 'האידיאלי לעסקים מתפתחים',
      features: [
        'לקוחות ללא הגבלה',
        'תוכנית נאמנות',
        'סנכרון יומן Google',
        'הודעות SMS מתקדמות',
        'אנליטיקה מתקדמת',
        'תמיכה טלפונית'
      ],
      popular: true
    },
    {
      id: 'gold' as PlanType,
      name: 'Gold',
      price: 249,
      currency: '₪',
      period: 'לחודש',
      badge: '👑 מומלץ',
      color: 'bg-yellow-500',
      description: 'לעסקים שרוצים לבלוט',
      features: [
        'כל התכונות של Pro',
        'מיתוג מותאם אישית',
        'אוטומציות מתקדמות',
        'דוחות מותאמים',
        'תובנות AI',
        'אינטגרציות רשתות חברתיות',
        'תמיכה VIP'
      ]
    },
    {
      id: 'premium' as PlanType,
      name: 'Premium',
      price: 399,
      currency: '₪',
      period: 'לחודש',
      badge: '💎 פרמיום',
      color: 'bg-purple-500',
      description: 'הפתרון המלא לעסקים גדולים',
      features: [
        'כל התכונות של Gold',
        'צוות מרובה',
        'WhatsApp Business',
        'גישה ל-API',
        'מנהל חשבון ייעודי',
        'הדרכות מותאמות',
        'גיבויים מתקדמים'
      ]
    }
  ];

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan);
  const isFreeplan = selectedPlan === 'starter';

  const handlePlanSelect = (planId: PlanType) => {
    setSelectedPlan(planId);
    updateSignupData({ subscriptionLevel: planId });
    
    // Reset payment details if switching to free plan
    if (planId === 'starter') {
      setPaymentDetails({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        holderName: ''
      });
    }
  };

  const handleTermsChange = (checked: boolean | 'indeterminate') => {
    setTermsAccepted(checked === true);
  };

  const handleMarketingChange = (checked: boolean | 'indeterminate') => {
    setMarketingConsent(checked === true);
  };

  const validatePaymentForm = () => {
    if (isFreeplan) return true;
    
    const { cardNumber, expiryDate, cvv, holderName } = paymentDetails;
    
    if (!cardNumber.trim()) {
      toast({
        variant: "destructive",
        title: "מספר כרטיס נדרש",
        description: "אנא הזיני מספר כרטיס אשראי תקין"
      });
      return false;
    }
    
    if (!expiryDate.trim() || !cvv.trim() || !holderName.trim()) {
      toast({
        variant: "destructive",
        title: "פרטי תשלום חסרים",
        description: "אנא השלימי את כל פרטי התשלום"
      });
      return false;
    }
    
    return true;
  };

  const canProceed = () => {
    if (!termsAccepted) return false;
    if (!isFreeplan && !validatePaymentForm()) return false;
    return true;
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Crown className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-primary">
          בחרי את התכנית המתאימה לך, {signupData.firstName}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          כל התכניות כוללות 14 ימי ניסיון חינם. ניתן לשנות או לבטל בכל עת
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg relative ${
              selectedPlan === plan.id 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:ring-1 hover:ring-primary/20'
            } ${plan.popular ? 'scale-105 z-10' : ''}`}
            onClick={() => handlePlanSelect(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white px-4 py-1">
                  הכי פופולרי
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-4">
              <div className="text-center space-y-2">
                <span className="text-2xl">{plan.badge.split(' ')[0]}</span>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    {plan.currency}{plan.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {plan.period}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                
                {plan.limitations && (
                  <div className="pt-2 border-t">
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <Button
                  variant={selectedPlan === plan.id ? "default" : "outline"}
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan.id);
                  }}
                >
                  {selectedPlan === plan.id ? 'נבחר' : 'בחירה'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Button */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setShowComparison(!showComparison)}
          className="gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          {showComparison ? 'הסתר השוואה' : 'השוואת תכניות'}
        </Button>
      </div>

      {/* Comparison Table */}
      {showComparison && (
        <Card>
          <CardHeader>
            <CardTitle>השוואת תכניות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right p-3">תכונה</th>
                    {plans.map(plan => (
                      <th key={plan.id} className="text-center p-3">{plan.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">מספר לקוחות</td>
                    <td className="text-center p-3">50</td>
                    <td className="text-center p-3">ללא הגבלה</td>
                    <td className="text-center p-3">ללא הגבלה</td>
                    <td className="text-center p-3">ללא הגבלה</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">אינטגרציות</td>
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
                  <tr className="border-b">
                    <td className="p-3 font-medium">צוות מרובה</td>
                    <td className="text-center p-3">❌</td>
                    <td className="text-center p-3">❌</td>
                    <td className="text-center p-3">❌</td>
                    <td className="text-center p-3">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Section */}
      {!isFreeplan && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              פרטי תשלום
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">מספר כרטיס אשראי *</Label>
                <Input
                  id="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails(prev => ({
                    ...prev,
                    cardNumber: e.target.value
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="holderName">שם בעל הכרטיס *</Label>
                <Input
                  id="holderName"
                  placeholder="שם מלא"
                  value={paymentDetails.holderName}
                  onChange={(e) => setPaymentDetails(prev => ({
                    ...prev,
                    holderName: e.target.value
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiryDate">תוקף *</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails(prev => ({
                    ...prev,
                    expiryDate: e.target.value
                  }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails(prev => ({
                    ...prev,
                    cvv: e.target.value
                  }))}
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800">
                <Shield className="h-5 w-5" />
                <span className="font-medium">תשלום מאובטח</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                פרטי התשלום שלך מוגנים בהצפנה ברמה הגבוהה ביותר
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <Card className="bg-gradient-to-l from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                סיכום התכנית שנבחרה: {selectedPlanData?.name}
              </h3>
              <p className="text-muted-foreground">
                {selectedPlanData?.description}
              </p>
              {isFreeplan && (
                <p className="text-green-600 font-medium mt-2">
                  🎉 תכנית חינמית - ללא עלות!
                </p>
              )}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold">
                {selectedPlanData?.currency}{selectedPlanData?.price}
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedPlanData?.period}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked: boolean | "indeterminate") => {
                if (checked !== "indeterminate") {
                  setTermsAccepted(checked);
                }
              }}
            />
            <div className="text-sm">
              <Label htmlFor="terms" className="cursor-pointer">
                אני מסכימה ל
                <Button variant="link" className="p-0 h-auto underline">
                  תנאי השימוש
                </Button>
                {" "}ול
                <Button variant="link" className="p-0 h-auto underline">
                  מדיניות הפרטיות
                </Button>
                {" "}של Bellevo *
              </Label>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Checkbox
              id="marketing"
              checked={marketingConsent}
              onCheckedChange={(checked: boolean | "indeterminate") => {
                if (checked !== "indeterminate") {
                  setMarketingConsent(checked);
                }
              }}
            />
            <Label htmlFor="marketing" className="text-sm cursor-pointer">
              אני מסכימה לקבל עדכונים שיווקיים ותוכן מועיל ממערכת Bellevo
            </Label>
          </div>

          {!termsAccepted && (
            <div className="text-red-600 text-sm">
              * חובה לאשר את תנאי השימוש כדי להמשיך
            </div>
          )}
        </CardContent>
      </Card>

      {/* Free Plan Message */}
      {isFreeplan && (
        <Card className="bg-gradient-to-l from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-6 text-center">
            <div className="space-y-3">
              <div className="text-4xl">🎉</div>
              <h3 className="text-xl font-semibold text-green-800">
                מעולה! בחרת בתכנית החינמית
              </h3>
              <p className="text-green-700">
                תוכלי להתחיל מיד ללא עלות. בכל עת ניתן לשדרג לתכנית מתקדמת יותר
              </p>
              <p className="text-sm text-green-600">
                💡 המלצה: נסי את המערכת וכשתרצי יותר תכונות, פשוט שדרגי לתכנית Pro
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanSelectionStep;
