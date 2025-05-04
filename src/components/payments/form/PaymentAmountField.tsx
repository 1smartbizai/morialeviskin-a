
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "@/components/payments/types";

interface PaymentAmountFieldProps {
  form: UseFormReturn<PaymentFormValues>;
}

export const PaymentAmountField = ({ form }: PaymentAmountFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel>סכום</FormLabel>
          <FormControl>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">₪</span>
              <Input className="pl-8" {...field} type="number" min="0" step="0.01" />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
