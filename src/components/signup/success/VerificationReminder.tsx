
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VerificationReminderProps {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  onResendVerification: () => void;
}

const VerificationReminder = ({ 
  isEmailVerified, 
  isPhoneVerified, 
  onResendVerification 
}: VerificationReminderProps) => {
  const needsVerification = !isEmailVerified || !isPhoneVerified;
  
  if (!needsVerification) {
    return null;
  }
  
  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50">
      <CardContent className="pt-6">
        <h4 className="font-medium mb-2">כדי לשמור על אבטחתך, אמתי את הפרטים שלך</h4>
        <p className="text-sm text-muted-foreground mb-4">
          {!isEmailVerified && "האימייל שלך טרם אומת. "}
          {!isPhoneVerified && "מספר הטלפון שלך טרם אומת."}
        </p>
        <Button 
          variant="outline" 
          className="border-yellow-400" 
          onClick={onResendVerification}
        >
          שלחי שוב אימות
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerificationReminder;
