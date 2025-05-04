
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import PhoneStep from "@/components/client-auth/PhoneStep";
import OtpStep from "@/components/client-auth/OtpStep";
import PersonalInfoStep from "@/components/client-auth/PersonalInfoStep";
import ConsentStep from "@/components/client-auth/ConsentStep";
import WelcomeStep from "@/components/client-auth/WelcomeStep";

// Define the user data interface to help with type consistency
interface UserData {
  first_name: string;
  last_name: string;
  birthdate: string;
  skin_goals: string;
  photo_url?: string;
}

// Define steps for the authentication flow
type AuthStep = 'phone' | 'otp' | 'personal-info' | 'consent' | 'welcome';

const ClientAuth = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    first_name: '',
    last_name: '',
    birthdate: '',
    skin_goals: '',
  });
  
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if already logged in and has completed profile
  const checkUserProfile = async () => {
    if (!user) return;
    
    const { data: client } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (client) {
      // If client has completed registration
      if (client.terms_accepted) {
        navigate('/client');
      } else if (client.first_name) {
        // If client has started but not finished registration
        setCurrentStep('consent');
        setUserData({
          first_name: client.first_name,
          last_name: client.last_name,
          birthdate: client.birthdate || '',
          skin_goals: client.skin_goals || '',
          photo_url: client.photo_url,
        });
        setIsNewUser(true);
      }
    } else {
      setIsNewUser(true);
    }
  };
  
  // Check user profile on component mount
  useEffect(() => {
    if (!loading) {
      checkUserProfile();
    }
  }, [loading, user]); // Added user dependency

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex justify-center mb-6">
            <h1 className="text-2xl font-semibold text-center">
              {currentStep === 'phone' && "התחברות"}
              {currentStep === 'otp' && "אימות קוד"}
              {currentStep === 'personal-info' && "פרטים אישיים"}
              {currentStep === 'consent' && "הסכמה לתנאי שימוש"}
              {currentStep === 'welcome' && "ברוכים הבאים!"}
            </h1>
          </div>
          
          {currentStep === 'phone' && (
            <PhoneStep 
              onSubmit={(phoneNumber) => {
                setPhone(phoneNumber);
                setCurrentStep('otp');
              }} 
            />
          )}
          
          {currentStep === 'otp' && (
            <OtpStep 
              phone={phone}
              onVerified={(newUser) => {
                if (newUser) {
                  setIsNewUser(true);
                  setCurrentStep('personal-info');
                } else {
                  navigate('/client');
                }
              }}
              onBack={() => setCurrentStep('phone')}
            />
          )}
          
          {currentStep === 'personal-info' && (
            <PersonalInfoStep
              onSubmit={(data) => {
                setUserData({
                  first_name: data.first_name || '',
                  last_name: data.last_name || '',
                  birthdate: data.birthdate || '',
                  skin_goals: data.skin_goals || '',
                  photo_url: data.photo_url,
                });
                setCurrentStep('consent');
              }}
              initialData={userData}
            />
          )}
          
          {currentStep === 'consent' && (
            <ConsentStep
              userData={userData}
              onSubmit={() => setCurrentStep('welcome')}
            />
          )}
          
          {currentStep === 'welcome' && (
            <WelcomeStep
              onContinue={() => navigate('/client')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAuth;
