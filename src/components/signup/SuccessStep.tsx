
import { CheckCircle } from "lucide-react";
import SuccessConfetti from "./success/SuccessConfetti";
import BusinessInfoCard from "./success/BusinessInfoCard";
import ShareBusinessActions from "./success/ShareBusinessActions";
import VerificationReminder from "./success/VerificationReminder";
import DashboardCTA from "./success/DashboardCTA";

interface SuccessStepProps {
  businessName: string;
  businessDomain?: string;
  businessId?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  onResendVerification?: () => void;
}

const SuccessStep = ({ 
  businessName, 
  businessDomain = "bellevo.app/" + businessName.toLowerCase().replace(/\s+/g, '-'),
  businessId = "BIZ-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  isEmailVerified = false,
  isPhoneVerified = false,
  onResendVerification = () => {}
}: SuccessStepProps) => {

  return (
    <div className="text-center py-6" dir="rtl">
      <SuccessConfetti />
      
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-2">
        ברוכה הבאה ל־Bellevo!
      </h3>
      
      <p className="text-lg mb-6">
        <span className="font-medium text-primary">{businessName}</span> מוכן לקבל לקוחות
      </p>

      <BusinessInfoCard 
        businessDomain={businessDomain} 
        businessId={businessId} 
      />
      
      <ShareBusinessActions businessDomain={businessDomain} />
      
      <VerificationReminder 
        isEmailVerified={isEmailVerified}
        isPhoneVerified={isPhoneVerified}
        onResendVerification={onResendVerification}
      />
      
      <DashboardCTA />
    </div>
  );
};

export default SuccessStep;
