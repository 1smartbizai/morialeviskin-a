
export interface PlanOption {
  id: string;
  name: string;
  price: number;
  features: string[];
  recommended?: boolean;
  isFree?: boolean;
  trialDays?: number;
}

export interface PaymentInfoState {
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardholderName: string;
}

export interface PaymentStepProps {
  data: any;
  updateData: (data: any) => void;
}
