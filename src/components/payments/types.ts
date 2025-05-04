
import { z } from "zod";

// Form data type
export interface PaymentFormValues {
  clientId: string;
  amount: string;
  service: string;
  date: Date;
  notes?: string;
  generateInvoice: boolean;
}

// Client interface
export interface Client {
  id: string;
  name: string;
}

// Zod validation schema for payment form
export const paymentFormSchema = z.object({
  clientId: z.string({
    required_error: "נא לבחור לקוח",
  }).min(1, {
    message: "נא לבחור לקוח",
  }),
  amount: z.string({
    required_error: "נא להזין סכום",
  }).min(1, {
    message: "נא להזין סכום",
  }),
  service: z.string({
    required_error: "נא לבחור טיפול",
  }).min(1, {
    message: "נא לבחור טיפול",
  }),
  date: z.date({
    required_error: "נא לבחור תאריך",
  }),
  notes: z.string().optional(),
  generateInvoice: z.boolean().default(false),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
