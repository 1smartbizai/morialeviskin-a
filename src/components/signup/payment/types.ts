
export interface PaymentStepProps {
  data: Partial<any>;
  updateData: (data: any) => void;
}

export interface PaymentInfoState {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardholderName: string;
  errors?: {
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    cardholderName?: string;
  };
}

export interface PlanOption {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
  isFree?: boolean;
  trialDays?: number;
  priceLabel?: string;
}

export interface PaymentDetailsProps {
  paymentInfo: PaymentInfoState;
  onPaymentInfoChange: (field: string, value: string) => void;
  onValidate: () => boolean;
}

export interface LegalDisclaimerProps {
  isPaidPlan: boolean;
}

export interface PlanOptionsProps {
  selectedPlan: string;
  onPlanChange: (planId: string) => void;
  plans?: PlanOption[];
}
