
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  sendOTP: (phone: string) => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  verifyOTP: (phone: string, token: string) => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  loginWithGoogle: () => Promise<void>;
  navigate: (path: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  navigate: (path: string) => void;
}

export function AuthProvider({ children, navigate }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle new sign-ups with OAuth or returning users
        if (event === 'SIGNED_IN') {
          console.log("User signed in:", session?.user);
          
          // Check if this is a new user or incomplete signup
          checkUserType(session?.user).then(({ userType, signupStep }) => {
            if (userType === 'new') {
              // Redirect new users to the signup flow to complete profile
              toast({
                title: "ברוך הבא!",
                description: "עכשיו נמשיך את תהליך ההרשמה שלך."
              });
              navigate('/signup');
            } else if (userType === 'incomplete_signup' && signupStep) {
              // User has started signup but not completed it - redirect to the proper step
              toast({
                title: "ברוך השב!",
                description: "נמשיך מהנקודה שבה הפסקת בתהליך ההרשמה."
              });
              navigate('/signup');
            } else {
              // Returning users go to admin dashboard
              navigate('/admin');
            }
          });
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);
  
  // Enhanced helper to determine if user is new, has incomplete signup, or is existing
  const checkUserType = async (user: User | null): Promise<{userType: 'new' | 'incomplete_signup' | 'existing', signupStep?: number}> => {
    if (!user) return { userType: 'new' };
    
    try {
      // Check if we have a business_owners record for this user
      const { data, error } = await supabase
        .from('business_owners')
        .select('id, metadata')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      // If no record exists, treat as new user
      if (!data) return { userType: 'new' };
      
      // Check if signup is complete by examining metadata
      const metadata = data.metadata as any;
      const isSignupComplete = metadata?.isSignupComplete === true;
      
      if (!isSignupComplete && metadata?.currentStep !== undefined) {
        // User has started but not completed signup
        return { 
          userType: 'incomplete_signup',
          signupStep: metadata.currentStep
        };
      }
      
      // User exists and has completed signup
      return { userType: 'existing' };
    } catch (error) {
      console.error("Error checking user type:", error);
      return { userType: 'new' }; // Default to treating as new user if check fails
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({ title: "התנתקת בהצלחה", description: "להתראות!" });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({ 
        title: "שגיאה בהתנתקות", 
        description: "נא לנסות שוב",
        variant: "destructive" 
      });
    }
  };

  // Send OTP function with enhanced error handling
  const sendOTP = async (phone: string) => {
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      // Check if user exists
      const { data: existingUsers } = await supabase
        .from('clients')
        .select('id')
        .eq('phone', formattedPhone);
      
      const isNewUser = !existingUsers || existingUsers.length === 0;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });

      if (error) throw error;

      return { success: true, isNewUser };
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      
      // Provide more descriptive error messages based on common failure cases
      let errorMessage = error.message;
      if (error.message?.includes('rate limit')) {
        errorMessage = "נסיונות רבים מדי. נא להמתין לפני נסיון נוסף";
      } else if (error.message?.includes('phone_confirmation')) {
        errorMessage = "בעיה באימות מספר הטלפון. אנא וודא שהמספר תקין";
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Verify OTP function with enhanced feedback
  const verifyOTP = async (phone: string, token: string) => {
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms',
      });

      if (error) throw error;

      // Personalized success notification
      toast({
        title: "אימות מוצלח!",
        description: "מספר הטלפון אומת בהצלחה"
      });

      // Check if this is a new user
      const { data: existingClients } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', data.user?.id);

      const isNewUser = !existingClients || existingClients.length === 0;

      return { success: true, isNewUser };
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = "קוד האימות שגוי או שפג תוקפו";
      if (error.message?.includes('expired')) {
        errorMessage = "קוד האימות פג תוקף. אנא בקש קוד חדש";
      }
      
      return { success: false, error: errorMessage };
    }
  };
  
  // Google login function with improved error handling
  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/admin`
        }
      });
      
      if (error) throw error;
      
      // The redirect is handled by Supabase OAuth flow
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      toast({
        variant: "destructive",
        title: "שגיאה בהתחברות עם Google",
        description: error.message || "אנא נסה שוב מאוחר יותר"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signOut, 
      sendOTP, 
      verifyOTP,
      loginWithGoogle,
      navigate
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
