
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreatePaymentForm } from "@/components/payments/CreatePaymentForm";

interface NewPaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
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
  const handleSubmit = (data: any) => {
    onSubmit(data);
    onClose();
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
        />
      </DialogContent>
    </Dialog>
  );
};
