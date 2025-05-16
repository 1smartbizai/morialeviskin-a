
import { useState, useEffect } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { toast } from "@/components/ui/use-toast";
import { PaymentInfoState } from "./types";
import { plans } from "./planData";

/**
 * Custom hook to handle payment step logic
 */
export const usePaymentStep = (data: any, updateData: (data: any) => void) => {
  const { signupData } = useSignup();
  const [firstName] = useState<string>(signupData.firstName || '');
  const [selectedPlan, setSelectedPlan] = useState<string>(data?.subscriptionLevel || "pro");
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
  }, [data?.subscriptionLevel, selectedPlan, updateData]);

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
    updateData({ 
      subscriptionLevel: planId,
      // Set trial end date if selecting free plan
      trialEndDate: planId === 'free' ? 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : 
        undefined
    });
  };

  // Handle payment info changes
  const handlePaymentInfoChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value,
      errors: {
        ...prev.errors,
        [field]: undefined // Clear error when field changes
      }
    }));
  };

  // Validate payment information with clear Hebrew error messages
  const validatePaymentInfo = () => {
    const { cardNumber, cardExpiry, cardCvv, cardholderName } = paymentInfo;
    const errors: PaymentInfoState['errors'] = {};
    
    // Skip validation for free plan
    if (selectedPlan === 'free') {
      return true;
    }
    
    // Perform validation with Hebrew messages
    if (!cardholderName.trim()) {
      errors.cardholderName = "אנא הזיני את שם בעל/ת הכרטיס";
    }
    
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber) {
      errors.cardNumber = "אנא הזיני את מספר הכרטיס";
    } else if (cleanCardNumber.length !== 16 || !/^\d+$/.test(cleanCardNumber)) {
      errors.cardNumber = "מספר כרטיס לא תקין, יש להזין 16 ספרות";
    }
    
    if (!cardExpiry) {
      errors.cardExpiry = "אנא הזיני את תוקף הכרטיס";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      errors.cardExpiry = "פורמט לא תקין, יש להזין MM/YY";
    } else {
      // Check if card is expired
      const [month, year] = cardExpiry.split('/');
      const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const today = new Date();
      if (expiryDate < today) {
        errors.cardExpiry = "הכרטיס פג תוקף";
      }
    }
    
    if (!cardCvv) {
      errors.cardCvv = "אנא הזיני את קוד האבטחה";
    } else if (!/^\d{3,4}$/.test(cardCvv)) {
      errors.cardCvv = "קוד אבטחה לא תקין (3-4 ספרות)";
    }
    
    // Update state with errors
    setPaymentInfo(prev => ({
      ...prev,
      errors
    }));
    
    return Object.keys(errors).length === 0;
  };

  // Process payment logic
  const processPayment = async () => {
    if (selectedPlan === 'free') return true;
    
    if (!validatePaymentInfo()) {
      toast({
        variant: "destructive",
        title: "פרטי תשלום שגויים",
        description: "אנא ודאי שכל פרטי התשלום הוזנו בצורה נכונה"
      });
      return false;
    }
    
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

  return {
    firstName,
    selectedPlan,
    selectedPlanDetails,
    showPaymentInfo,
    paymentInfo,
    isPaidPlan,
    handlePlanChange,
    handlePaymentInfoChange,
    validatePaymentInfo,
    processPayment
  };
};
