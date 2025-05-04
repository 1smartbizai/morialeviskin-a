
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { PaymentFormData } from "./types";
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
  onSubmit: (data: PaymentFormData) => void;
  onCancel: () => void;
}

export const CreatePaymentForm = ({
  clients,
  services,
  onSubmit,
  onCancel
}: CreatePaymentFormProps) => {
  const form = useForm<PaymentFormData>({
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
        <PaymentFormActions onCancel={onCancel} />
      </form>
    </Form>
  );
};
