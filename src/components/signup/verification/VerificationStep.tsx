
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSignup } from "@/contexts/SignupContext";
import { EmailVerification } from "./EmailVerification";
import { PhoneVerification } from "./PhoneVerification";
import { VerificationStatus } from "./VerificationStatus";

const VerificationStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const { user } = useAuth();

  // Check email verification status on component mount
  useEffect(() => {
    if (user?.email_confirmed_at) {
      updateSignupData({ isEmailVerified: true });
    }
  }, [user, updateSignupData]);

  const handleEmailSent = () => {
    updateSignupData({
      verificationStep: {
        ...signupData.verificationStep,
        emailSent: true
      }
    });
  };

  const handlePhoneSent = () => {
    updateSignupData({
      verificationStep: {
        ...signupData.verificationStep,
        phoneSent: true
      }
    });
  };

  const handlePhoneVerified = () => {
    updateSignupData({ isPhoneVerified: true });
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">אימות חשבון</h2>
        <p className="text-sm text-muted-foreground">
          {signupData.firstName}, לפני שנמשיך בתהליך ההרשמה, אנא אמתי את הפרטים שלך.
          <br />
          האימות עוזר לנו להבטיח את אבטחת החשבון שלך.
        </p>
      </div>

      {/* Email Verification */}
      <EmailVerification 
        firstName={signupData.firstName}
        email={signupData.email}
        isEmailVerified={signupData.isEmailVerified}
        emailSent={signupData.verificationStep.emailSent}
        onEmailSent={handleEmailSent}
      />

      {/* Phone Verification */}
      <PhoneVerification
        firstName={signupData.firstName}
        phone={signupData.phone}
        isPhoneVerified={signupData.isPhoneVerified}
        phoneSent={signupData.verificationStep.phoneSent}
        onPhoneSent={handlePhoneSent}
        onPhoneVerified={handlePhoneVerified}
      />

      <VerificationStatus 
        isEmailVerified={signupData.isEmailVerified}
        isPhoneVerified={signupData.isPhoneVerified}
      />
    </div>
  );
};

export default VerificationStep;
