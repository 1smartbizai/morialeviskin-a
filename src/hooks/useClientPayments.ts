
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface ClientPayment {
  id: string;
  service: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending';
  invoiceId?: string;
}

export const useClientPayments = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [totalDebt, setTotalDebt] = useState(0);

  // Fetch client payments from Supabase
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        
        // Get current client ID from auth
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error("User not authenticated");
          return;
        }
        
        // Fetch client payments
        // In a real implementation, we would fetch from a payments table
        // For now, using mock data
        setTimeout(() => {
          const mockPayments: ClientPayment[] = [
            {
              id: "1",
              service: "טיפול פנים מקיף",
              date: "1 במאי, 2025",
              amount: 450,
              status: 'paid',
              invoiceId: "inv-1234"
            },
            {
              id: "2",
              service: "עיסוי פנים",
              date: "15 באפריל, 2025",
              amount: 300,
              status: 'paid',
              invoiceId: "inv-1235"
            },
            {
              id: "3",
              service: "טיפול גבות",
              date: "1 באפריל, 2025",
              amount: 150,
              status: 'pending'
            },
            {
              id: "4",
              service: "טיפול לחות אינטנסיבי",
              date: "15 במרץ, 2025",
              amount: 280,
              status: 'pending'
            }
          ];
          
          setPayments(mockPayments);
          
          // Calculate total debt
          const debt = mockPayments
            .filter(p => p.status === 'pending')
            .reduce((sum, p) => sum + p.amount, 0);
            
          setTotalDebt(debt);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setIsLoading(false);
        toast.error("שגיאה בטעינת נתוני תשלומים");
      }
    };
    
    fetchPayments();
  }, []);
  
  // Get pending payments
  const pendingPayments = payments.filter(p => p.status === 'pending');

  // Download invoice function
  const downloadInvoice = async (paymentId: string) => {
    try {
      // In a real implementation, we would call the Green Invoice API
      // For demo purposes, just showing a toast
      console.log(`Downloading invoice for payment ${paymentId}`);
      
      toast.success("החשבונית מורדת...", {
        description: "החשבונית תיפתח בחלון חדש"
      });
      
      // Simulate opening a new window with the invoice
      setTimeout(() => {
        // In a real implementation, this would be the URL to the PDF
        // window.open("https://example.com/invoice.pdf", "_blank");
      }, 1500);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      toast.error("שגיאה בהורדת החשבונית");
    }
  };
  
  // Pay debt function
  const payDebt = async (paymentId?: string) => {
    try {
      toast.success("מעבר לעמוד התשלום", {
        description: "אתה מועבר לדף התשלום המאובטח"
      });
      
      // In a real implementation, we would redirect to a payment page or open a payment modal
      console.log(`Processing payment ${paymentId || 'for all debts'}`);
      
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("שגיאה בביצוע התשלום");
    }
  };

  return {
    isLoading,
    payments,
    pendingPayments,
    totalDebt,
    downloadInvoice,
    payDebt
  };
};
