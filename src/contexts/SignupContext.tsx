
import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the structure for working hours
interface WorkingHoursData {
  [key: string]: {
    active: boolean;
    start: string;
    end: string;
  };
}

// Define the signup data interface
export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  businessName: string;
  logo?: File;
  logoUrl?: string;
  usesDefaultLogo: boolean;
  defaultLogoId?: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  headingTextColor: string;
  bodyTextColor: string;
  actionTextColor: string;
  buttonBgColor1: string;
  buttonBgColor2: string;
  buttonTextColor1: string;
  buttonTextColor2: string;
  brandTone: string;
  subscriptionLevel: string;
  workingHours: WorkingHoursData;
  googleCalendarConnected: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  businessDomain?: string;
  businessId?: string;
  // New fields
  trialEndDate?: string;
  emailIntegration?: boolean;
  socialMediaIntegration?: boolean;
  whatsappIntegration?: boolean;
  // Validation states
  isPersonalInfoValid: boolean;
}

interface SignupContextType {
  signupData: SignupData;
  updateSignupData: (data: Partial<SignupData>) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  session: any;
  setSession: (session: any) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const defaultWorkingHours = {
  monday: { active: true, start: "09:00", end: "17:00" },
  tuesday: { active: true, start: "09:00", end: "17:00" },
  wednesday: { active: true, start: "09:00", end: "17:00" },
  thursday: { active: true, start: "09:00", end: "17:00" },
  friday: { active: true, start: "09:00", end: "17:00" },
  saturday: { active: false, start: "10:00", end: "14:00" },
  sunday: { active: false, start: "10:00", end: "14:00" },
};

const defaultSignupData: SignupData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  businessName: "",
  usesDefaultLogo: true,
  defaultLogoId: "default1",
  primaryColor: "#6A0DAD", // Default purple
  accentColor: "#5AA9E6", // Default blue
  backgroundColor: "#FFFFFF",
  headingTextColor: "#1A1F2C",
  bodyTextColor: "#333333",
  actionTextColor: "#FFFFFF",
  buttonBgColor1: "#6A0DAD",
  buttonBgColor2: "#8B5CF6",
  buttonTextColor1: "#FFFFFF",
  buttonTextColor2: "#FFFFFF",
  brandTone: "professional",
  subscriptionLevel: "pro", // Changed default from "starter" to "pro"
  workingHours: defaultWorkingHours,
  googleCalendarConnected: false,
  emailIntegration: false,
  socialMediaIntegration: false,
  whatsappIntegration: false,
  isEmailVerified: false,
  isPhoneVerified: false,
  isPersonalInfoValid: false,
  trialEndDate: undefined,
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const SignupProvider = ({ children }: { children: ReactNode }) => {
  const [signupData, setSignupData] = useState<SignupData>(defaultSignupData);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData(prev => ({ ...prev, ...data }));
  };

  return (
    <SignupContext.Provider 
      value={{ 
        signupData, 
        updateSignupData, 
        isLoading, 
        setIsLoading, 
        session, 
        setSession,
        currentStep,
        setCurrentStep
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = (): SignupContextType => {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
};
