
import { Card, CardContent } from "@/components/ui/card";
import { useSignup } from "@/contexts/SignupContext";

interface BusinessSummaryCardProps {
  businessName: string;
  businessDomain?: string;
}

const BusinessSummaryCard = ({ businessName, businessDomain }: BusinessSummaryCardProps) => {
  const { signupData } = useSignup();

  return (
    <Card className="bg-gradient-to-l from-purple-50 to-pink-50 border-primary/20 w-full max-w-md">
      <CardContent className="p-6">
        <h3 className="font-semibold text-primary mb-4">סיכום העסק שלך:</h3>
        <div className="space-y-2 text-sm text-muted-foreground text-right">
          <p><span className="font-medium">שם העסק:</span> {businessName}</p>
          <p><span className="font-medium">דוא״ל:</span> {signupData.email}</p>
          <p><span className="font-medium">טלפון:</span> {signupData.phone}</p>
          <p><span className="font-medium">תכנית:</span> {signupData.subscriptionLevel}</p>
          {businessDomain && (
            <p><span className="font-medium">דומיין:</span> {businessDomain}.bellevo.app</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessSummaryCard;
