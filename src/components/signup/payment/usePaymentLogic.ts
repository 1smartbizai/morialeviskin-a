
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { PaymentInfoState } from "./types";

export const usePaymentLogic = (initialPlan: string, updateData: (data: any) => void) => {
  const [selectedPlan, setSelectedPlan] = useState<string>(initialPlan || "pro");
  const [showPaymentInfo, setShowPaymentInfo] = useState<boolean>(false);
  const [isPaymentValid, setIsPaymentValid] = useState<boolean>(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoState>({
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardholderName: "",
  });

  // Update selected plan in parent component when changed
  useEffect(() => {
    updateData({ 
      subscriptionLevel: selectedPlan,
      // Set trial end date if selecting free plan
      trialEndDate: selectedPlan === 'free' ? 
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : 
        undefined
    });
  }, [selectedPlan, updateData]);

  // Determine if payment info should be shown
  useEffect(() => {
    const isPaidPlan = selectedPlan !== 'free';
    setShowPaymentInfo(isPaidPlan);
    
    // For free plans, we don't need validation of payment
    if (!isPaidPlan) {
      setIsPaymentValid(true);
    } else {
      // Re-validate if switching to paid plan
      validatePaymentInfo();
    }
  }, [selectedPlan]);

  const handlePlanChange = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePaymentInfoChange = (field: string, value: string) => {
    setPaymentInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate payment information
  const validatePaymentInfo = () => {
    const { cardNumber, cardExpiry, cardCvv, cardholderName } = paymentInfo;
    
    // Skip validation for free plan
    if (selectedPlan === 'free') {
      return true;
    }
    
    // Perform basic validation
    const isCardNumberValid = cardNumber.replace(/\s/g, '').length === 16;
    const isExpiryValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry);
    const isCvvValid = /^\d{3,4}$/.test(cardCvv);
    const isNameValid = cardholderName.trim().length > 0;
    
    const isValid = isCardNumberValid && isExpiryValid && isCvvValid && isNameValid;
    setIsPaymentValid(isValid);
    
    return isValid;
  };

  // Simulate payment processing
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
    
    // Simulate payment processing
    try {
      // In a real implementation, we would call a payment API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "התשלום בוצע בהצלחה!",
        description: `נרשמת בהצלחה לתכנית ${selectedPlan}`
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
    selectedPlan,
    showPaymentInfo,
    isPaymentValid, 
    paymentInfo,
    handlePlanChange,
    handlePaymentInfoChange,
    validatePaymentInfo,
    processPayment
  };
};
