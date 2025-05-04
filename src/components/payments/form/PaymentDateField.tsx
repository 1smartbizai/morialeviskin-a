
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { he } from "date-fns/locale";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { PaymentFormValues } from "@/components/payments/types";

interface PaymentDateFieldProps {
  form: UseFormReturn<PaymentFormValues>;
}

export const PaymentDateField = ({ form }: PaymentDateFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>תאריך</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className="text-right font-normal flex justify-between"
                >
                  {field.value ? format(field.value, 'PPP', { locale: he }) : <span>בחר תאריך</span>}
                  <CalendarIcon className="h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                locale={he}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
