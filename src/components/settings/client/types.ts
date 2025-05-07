
import { z } from "zod";

// Form schema with validation
export const personalDetailsSchema = z.object({
  first_name: z.string().min(2, "שם פרטי חייב להכיל לפחות 2 תווים"),
  last_name: z.string().min(2, "שם משפחה חייב להכיל לפחות 2 תווים"),
  phone: z.string().regex(/^05\d{8}$/, "מספר טלפון לא תקין (דוגמה: 0501234567)"),
  birthdate: z.string().optional(),
});

export type PersonalDetailsFormValues = z.infer<typeof personalDetailsSchema>;

export interface CommunicationPreferences {
  receive_tips: boolean;
  receive_reminders: boolean;
  receive_promotions: boolean;
}
