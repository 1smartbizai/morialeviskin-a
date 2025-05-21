
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export interface VerificationStatusProps {
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
}

export const VerificationStatus = ({ isEmailVerified, isPhoneVerified }: VerificationStatusProps) => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="text-sm">
        {isEmailVerified ? 
          <span className="text-green-700">כתובת הדוא״ל אומתה בהצלחה! </span> : 
          <span className="text-red-700">נדרש אימות של כתובת הדוא״ל כדי להמשיך. </span>}
        {isPhoneVerified ? 
          <span className="text-green-700">מספר הטלפון אומת בהצלחה! </span> : 
          <span className="text-amber-700">אימות מספר הטלפון אינו חובה בשלב זה. </span>}
      </AlertDescription>
    </Alert>
  );
};
