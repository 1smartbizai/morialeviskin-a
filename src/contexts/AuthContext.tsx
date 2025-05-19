
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  sendOTP: (phone: string) => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  verifyOTP: (phone: string, token: string) => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

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
          
          // Check if this is a new user (you could check additional tables)
          checkUserType(session?.user).then(userType => {
            if (userType === 'new') {
              // Redirect new users to the signup flow to complete profile
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
  }, [navigate]);
  
  // Helper to determine if user is new or existing
  const checkUserType = async (user: User | null): Promise<'new' | 'existing'> => {
    if (!user) return 'new';
    
    try {
      // Check if we already have a business_owners record for this user
      const { data, error } = await supabase
        .from('business_owners')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      // If no record exists, treat as new user
      return data ? 'existing' : 'new';
    } catch (error) {
      console.error("Error checking user type:", error);
      return 'new'; // Default to treating as new user if check fails
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

  // Send OTP function
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
      return { success: false, error: error.message };
    }
  };

  // Verify OTP function
  const verifyOTP = async (phone: string, token: string) => {
    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token,
        type: 'sms',
      });

      if (error) throw error;

      // Check if this is a new user
      const { data: existingClients } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', data.user?.id);

      const isNewUser = !existingClients || existingClients.length === 0;

      return { success: true, isNewUser };
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Google login function
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
      loginWithGoogle
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
