
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PaymentBannerProps {
  pendingPayment: number;
}

const PaymentBanner = ({ pendingPayment }: PaymentBannerProps) => {
  const navigate = useNavigate();

  if (pendingPayment <= 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-blue-900 mb-1">תשלום ממתין</h3>
            <div className="text-2xl font-bold text-blue-700">₪{pendingPayment}</div>
            <p className="text-sm text-blue-800 mt-1">עבור הטיפול האחרון</p>
          </div>
          <CreditCard className="h-10 w-10 text-blue-500" />
        </div>
        <Button 
          variant="outline"
          className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-200/50 hover:text-blue-900"
          onClick={() => navigate("/client/payments")}
        >
          לתשלום
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentBanner;
