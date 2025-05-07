
import { CalendarDays, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ClientPayment } from "@/hooks/useClientPayments";

interface PaymentItemProps {
  payment: ClientPayment;
  showInvoiceDownload?: boolean;
  showPayButton?: boolean;
  onDownloadInvoice: (paymentId: string) => void;
  onPayDebt?: (paymentId: string) => void;
}

export function PaymentItem({ 
  payment, 
  showInvoiceDownload = true,
  showPayButton = false,
  onDownloadInvoice,
  onPayDebt
}: PaymentItemProps) {
  return (
    <div className={`grid ${showPayButton ? 'grid-cols-[1fr,auto,auto,auto]' : 'grid-cols-[1fr,auto,auto]'} items-center p-4 border-t text-sm`}>
      <div>
        <div className="font-medium">{payment.service}</div>
        {showInvoiceDownload && payment.invoiceId && (
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            <FileText className="h-3 w-3 ml-1" />
            <button 
              className="text-beauty-primary hover:underline" 
              onClick={() => onDownloadInvoice(payment.id)}
            >
              הורד חשבונית
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center text-muted-foreground">
        <CalendarDays className="h-3 w-3 ml-1" />
        {payment.date}
      </div>
      <div className={showPayButton ? "" : "text-right"} dir="ltr">
        <span className="font-medium">₪{payment.amount}</span>
      </div>
      {showPayButton && (
        <div className="flex justify-end">
          <Button 
            size="sm" 
            className="bg-beauty-primary text-white hover:bg-beauty-primary/90"
            onClick={() => onPayDebt && onPayDebt(payment.id)}
          >
            שלם
          </Button>
        </div>
      )}
    </div>
  );
}
