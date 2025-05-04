
import { z } from "zod";

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

// Export the type from the schema
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Client interface
export interface Client {
  id: string;
  name: string;
}
