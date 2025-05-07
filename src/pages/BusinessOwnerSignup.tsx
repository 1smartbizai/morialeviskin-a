
import { SignupProvider } from "@/contexts/SignupContext";
import SignupContent from "@/components/signup/SignupContent";

// Wrap the component with the SignupProvider
const BusinessOwnerSignup = () => (
  <SignupProvider>
    <SignupContent />
  </SignupProvider>
);

export default BusinessOwnerSignup;
