
import { SignupProvider } from "@/contexts/SignupContext";
import SignupContent from "@/components/signup/SignupContent";
import SignupLayout from "@/components/signup/SignupLayout";

const BusinessOwnerSignup = () => (
  <SignupProvider>
    <SignupLayout>
      <SignupContent />
    </SignupLayout>
  </SignupProvider>
);

export default BusinessOwnerSignup;
