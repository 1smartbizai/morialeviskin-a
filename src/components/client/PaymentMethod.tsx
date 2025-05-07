
import { CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PaymentMethodProps {
  lastFour: string;
  expiryDate: string;
  isDefault?: boolean;
}

export function PaymentMethod({ lastFour, expiryDate, isDefault = false }: PaymentMethodProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-md">
      <div className="flex items-center gap-3">
        <div className="bg-muted h-10 w-14 rounded flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-beauty-dark" />
        </div>
        <div>
          <div className="font-medium">•••• {lastFour}</div>
          <div className="text-xs text-muted-foreground">פג תוקף {expiryDate}</div>
        </div>
      </div>
      {isDefault && <Badge>ברירת מחדל</Badge>}
    </div>
  );
}
