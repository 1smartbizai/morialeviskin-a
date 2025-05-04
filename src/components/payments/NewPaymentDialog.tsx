
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreatePaymentForm } from "@/components/payments/CreatePaymentForm";
import { useToast } from "@/hooks/use-toast";
import { paymentFormSchema, PaymentFormValues } from "./types";

interface NewPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentFormValues) => void;
  clients: { id: string; name: string }[];
  services: string[];
}

export const NewPaymentDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  clients,
  services
}: NewPaymentDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (data: PaymentFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Validate the data using our schema
      const validatedData = paymentFormSchema.parse(data);
      
      // Process the form submission
      onSubmit(validatedData);
      
      // Show success toast
      toast({
        title: "תשלום נוצר בהצלחה",
        description: "התשלום נוסף למערכת",
      });
      
      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Form validation error:", error);
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה ביצירת התשלום",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>הוספת תשלום חדש</DialogTitle>
        </DialogHeader>
        <CreatePaymentForm
          clients={clients}
          services={services}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
