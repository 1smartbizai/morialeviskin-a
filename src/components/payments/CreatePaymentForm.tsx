
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { PaymentFormValues, paymentFormSchema } from "./types";
import { PaymentClientField } from "./form/PaymentClientField";
import { PaymentAmountField } from "./form/PaymentAmountField";
import { PaymentServiceField } from "./form/PaymentServiceField";
import { PaymentDateField } from "./form/PaymentDateField";
import { PaymentNotesField } from "./form/PaymentNotesField";
import { PaymentInvoiceCheckbox } from "./form/PaymentInvoiceCheckbox";
import { PaymentFormActions } from "./form/PaymentFormActions";

interface CreatePaymentFormProps {
  clients: { id: string; name: string }[];
  services: string[];
  onSubmit: (data: PaymentFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const CreatePaymentForm = ({
  clients,
  services,
  onSubmit,
  onCancel,
  isSubmitting = false
}: CreatePaymentFormProps) => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      clientId: "",
      amount: "",
      service: "",
      date: new Date(),
      notes: "",
      generateInvoice: false
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PaymentClientField form={form} clients={clients} />
        <PaymentAmountField form={form} />
        <PaymentServiceField form={form} services={services} />
        <PaymentDateField form={form} />
        <PaymentNotesField form={form} />
        <PaymentInvoiceCheckbox form={form} />
        <PaymentFormActions onCancel={onCancel} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
};
