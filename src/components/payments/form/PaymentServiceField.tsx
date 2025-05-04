
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "@/components/payments/types";

interface PaymentServiceFieldProps {
  form: UseFormReturn<PaymentFormValues>;
  services: string[];
}

export const PaymentServiceField = ({ form, services }: PaymentServiceFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="service"
      render={({ field }) => (
        <FormItem>
          <FormLabel>סוג טיפול</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="בחר טיפול" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {services.map(service => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
