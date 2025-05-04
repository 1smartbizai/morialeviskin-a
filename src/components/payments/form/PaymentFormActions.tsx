
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface PaymentFormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const PaymentFormActions = ({ 
  onCancel, 
  isSubmitting = false 
}: PaymentFormActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="outline" onClick={onCancel} type="button" disabled={isSubmitting}>
        ביטול
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            מעבד...
          </>
        ) : (
          "שמור תשלום"
        )}
      </Button>
    </div>
  );
};
