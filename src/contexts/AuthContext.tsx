
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      signOut, 
      sendOTP, 
      verifyOTP 
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
