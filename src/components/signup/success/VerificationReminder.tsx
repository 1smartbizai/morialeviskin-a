
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

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
    <Card className="mb-6 border-yellow-200 bg-yellow-50" dir="rtl">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <h4 className="font-medium">כדי לשמור על אבטחת החשבון שלך, אמתי את הפרטים שלך</h4>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          {!isEmailVerified && "כתובת הדוא״ל שלך טרם אומתה. "}
          {!isPhoneVerified && "מספר הטלפון שלך טרם אומת."}
        </p>
        <Button 
          variant="outline" 
          className="border-yellow-400" 
          onClick={onResendVerification}
        >
          שלחי שוב קוד אימות
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerificationReminder;
