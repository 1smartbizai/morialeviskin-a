
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Mail, Phone } from "lucide-react";

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
          {!isEmailVerified && (
            <span className="flex items-center gap-1 mb-1">
              <Mail className="h-4 w-4" /> כתובת הדוא״ל שלך טרם אומתה.
            </span>
          )}
          {!isPhoneVerified && (
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" /> מספר הטלפון שלך טרם אומת.
            </span>
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          {!isEmailVerified && (
            <Button 
              variant="outline" 
              className="border-yellow-400" 
              onClick={onResendVerification}
            >
              שלחי שוב קוד אימות אימייל
            </Button>
          )}
          {!isPhoneVerified && (
            <Button 
              variant="outline" 
              className="border-yellow-400" 
              onClick={onResendVerification}
            >
              שלחי שוב קוד אימות טלפון
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationReminder;
