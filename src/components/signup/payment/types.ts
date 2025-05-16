
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
