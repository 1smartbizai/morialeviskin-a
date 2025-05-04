
import React from "react";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormData } from "@/components/payments/types";

interface PaymentInvoiceCheckboxProps {
  form: UseFormReturn<PaymentFormData>;
}

export const PaymentInvoiceCheckbox = ({ form }: PaymentInvoiceCheckboxProps) => {
  return (
    <FormField
      control={form.control}
      name="generateInvoice"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 pl-2">
          <FormControl>
            <input
              type="checkbox"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              className="h-4 w-4"
            />
          </FormControl>
          <div className="space-y-1 leading-none mr-2">
            <FormLabel>צור חשבונית באופן אוטומטי</FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};
