
import { CheckCircle2 } from "lucide-react";
import { useSignup } from "@/contexts/SignupContext";

interface WelcomeHeaderProps {
  businessName: string;
  businessDomain?: string;
}

const WelcomeHeader = ({ businessName, businessDomain }: WelcomeHeaderProps) => {
  const { signupData } = useSignup();

  return (
    <>
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="rounded-full bg-green-100 p-8">
          <CheckCircle2 className="h-20 w-20 text-green-600" />
        </div>
      </div>
      
      {/* Welcome Message */}
      <div className="space-y-4 max-w-2xl">
        <h1 className="text-4xl font-bold text-primary">
          ברוכה הבאה ל-Bellevo, {signupData.firstName}! 🎉
        </h1>
        
        <p className="text-xl text-muted-foreground">
          העסק שלך <span className="font-semibold text-primary">{businessName}</span> מוכן ופועל!
        </p>
        
        {businessDomain && (
          <p className="text-muted-foreground">
            הלקוחות שלך יכולים לגשת אליך ב: 
            <span className="font-mono bg-muted px-2 py-1 rounded mx-2">
              {businessDomain}.bellevo.app
            </span>
          </p>
        )}
      </div>
    </>
  );
};

export default WelcomeHeader;
