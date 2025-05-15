
export interface PlanOption {
  id: string;
  name: string;
  price: number;
  features: string[];
  isFree?: boolean;
  trialDays?: number;
  recommended?: boolean;
}

export interface PaymentInfoState {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardholderName: string;
}

export interface PaymentStepProps {
  data?: {
    subscriptionLevel?: string;
    [key: string]: any;
  };
  updateData: (data: any) => void;
}
