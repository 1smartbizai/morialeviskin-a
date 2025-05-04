
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "@/components/payments/types";

interface PaymentNotesFieldProps {
  form: UseFormReturn<PaymentFormValues>;
}

export const PaymentNotesField = ({ form }: PaymentNotesFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel>הערות</FormLabel>
          <FormControl>
            <Input {...field} value={field.value || ""} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
