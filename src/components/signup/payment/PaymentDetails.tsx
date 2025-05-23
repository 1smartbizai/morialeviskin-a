
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";
import { PaymentDetailsProps } from "./types";

const PaymentDetails = ({ 
  paymentInfo, 
  onPaymentInfoChange, 
  onValidate 
}: PaymentDetailsProps) => {
  return (
    <div className="mt-8 transition-all">
      <Card className="border-primary/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">פרטי תשלום</CardTitle>
              <CardDescription>אנא הזיני את פרטי התשלום שלך</CardDescription>
            </div>
            <CreditCard className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="cardholderName">שם בעל הכרטיס</Label>
              <input
                id="cardholderName"
                placeholder="ישראלה ישראלי"
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground ${
                  paymentInfo.errors?.cardholderName ? 'border-destructive' : 'border-input'
                }`}
                value={paymentInfo.cardholderName}
                onChange={(e) => onPaymentInfoChange('cardholderName', e.target.value)}
                onBlur={onValidate}
              />
              {paymentInfo.errors?.cardholderName && (
                <span className="text-xs text-destructive">{paymentInfo.errors.cardholderName}</span>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">מספר כרטיס</Label>
              <input
                id="cardNumber"
                placeholder="4580 1234 5678 9012"
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground ${
                  paymentInfo.errors?.cardNumber ? 'border-destructive' : 'border-input'
                }`}
                value={paymentInfo.cardNumber}
                onChange={(e) => onPaymentInfoChange('cardNumber', e.target.value)}
                onBlur={onValidate}
              />
              {paymentInfo.errors?.cardNumber && (
                <span className="text-xs text-destructive">{paymentInfo.errors.cardNumber}</span>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="expiry">תוקף (MM/YY)</Label>
                <input
                  id="expiry"
                  placeholder="12/25"
                  className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground ${
                    paymentInfo.errors?.cardExpiry ? 'border-destructive' : 'border-input'
                  }`}
                  value={paymentInfo.cardExpiry}
                  onChange={(e) => onPaymentInfoChange('cardExpiry', e.target.value)}
                  onBlur={onValidate}
                />
                {paymentInfo.errors?.cardExpiry && (
                  <span className="text-xs text-destructive">{paymentInfo.errors.cardExpiry}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvc">CVV</Label>
                <input
                  id="cvc"
                  placeholder="123"
                  className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground ${
                    paymentInfo.errors?.cardCvv ? 'border-destructive' : 'border-input'
                  }`}
                  value={paymentInfo.cardCvv}
                  onChange={(e) => onPaymentInfoChange('cardCvv', e.target.value)}
                  onBlur={onValidate}
                />
                {paymentInfo.errors?.cardCvv && (
                  <span className="text-xs text-destructive">{paymentInfo.errors.cardCvv}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">תשלום מאובטח:</span> פרטי התשלום שלך מעובדים באופן מאובטח. איננו שומרים את פרטי הכרטיס שלך.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentDetails;
