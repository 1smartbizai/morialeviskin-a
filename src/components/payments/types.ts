
export interface PaymentFormData {
  clientId: string;
  amount: string;
  service: string;
  date: Date;
  notes?: string;
  generateInvoice: boolean;
}

export interface Client {
  id: string;
  name: string;
}
