
import React from "react";
import { Button } from "@/components/ui/button";

interface PaymentFormActionsProps {
  onCancel: () => void;
}

export const PaymentFormActions = ({ onCancel }: PaymentFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel} type="button">
        ביטול
      </Button>
      <Button type="submit">
        שמור תשלום
      </Button>
    </div>
  );
};
