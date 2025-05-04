
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  getMockPayments, 
  getMockOverdueClients,
  calculatePaymentStats,
  Payment,
  DebtClient
} from "@/services/paymentService";

export const usePayments = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [overdueClients, setOverdueClients] = useState<DebtClient[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    outstandingPayments: 0,
    transactionCount: 0,
  });

  // Load initial data
  useEffect(() => {
    const timer = setTimeout(() => {
      const mockPayments = getMockPayments();
      const mockOverdueClients = getMockOverdueClients();
      
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      setOverdueClients(mockOverdueClients);
      setStats(calculatePaymentStats(mockPayments));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = [...payments];
    
    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= filters.startDate;
      });
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate <= filters.endDate;
      });
    }
    
    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter(payment => payment.status === filters.status);
    }
    
    // Filter by treatment type
    if (filters.treatmentType !== "all") {
      filtered = filtered.filter(payment => payment.service === filters.treatmentType);
    }
    
    setFilteredPayments(filtered);
  };

  const handleIssueInvoice = (paymentId: string | number) => {
    // In a real implementation, this would call the Green Invoice API
    console.log(`Issue invoice for payment ${paymentId}`);
    
    // Update the payment status
    updatePaymentStatus(paymentId, "completed", `inv-${Math.floor(Math.random() * 1000)}`);
    
    toast({
      title: "חשבונית נשלחה",
      description: "החשבונית נשלחה ללקוח בהצלחה",
    });
  };

  const handleMarkPaid = (paymentId: string | number) => {
    // Update the payment status and ensure it has an invoiceId when marked as completed
    updatePaymentStatus(paymentId, "completed", `manual-${Math.floor(Math.random() * 1000)}`);
    
    toast({
      title: "תשלום עודכן",
      description: "התשלום סומן כשולם בהצלחה",
    });
  };

  const handleSendReminder = async (clientId: string) => {
    // In a real implementation, this would send an email or SMS reminder
    console.log(`Sending reminder to client ${clientId}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Update the lastContact field for the client
    const updatedClients = overdueClients.map(client => {
      if (client.id === clientId) {
        return {
          ...client,
          lastContact: "עכשיו",
        };
      }
      return client;
    });
    
    setOverdueClients(updatedClients);
    
    toast({
      title: "תזכורת נשלחה",
      description: "תזכורת נשלחה ללקוח בהצלחה",
    });
  };

  const handleExportData = () => {
    toast({
      title: "יוצא דו״ח תשלומים",
      description: "הדו״ח יישלח לתיבת המייל שלך בהקדם",
    });
  };

  const updatePaymentStatus = (
    paymentId: string | number, 
    status: "completed" | "pending" | "overdue",
    invoiceId?: string
  ) => {
    // Update the payments array
    const updatedPayments = payments.map(payment => {
      if (payment.id === paymentId) {
        return {
          ...payment,
          status,
          ...(invoiceId ? { invoiceId } : {}),
        };
      }
      return payment;
    });
    
    setPayments(updatedPayments);
    
    // Update filtered payments as well
    const updatedFilteredPayments = filteredPayments.map(payment => {
      if (payment.id === paymentId) {
        return {
          ...payment,
          status,
          ...(invoiceId ? { invoiceId } : {}),
        };
      }
      return payment;
    });
    
    setFilteredPayments(updatedFilteredPayments);
    
    // Update stats
    setStats(calculatePaymentStats(updatedPayments));
  };

  const addNewPayment = (paymentData: any) => {
    const newPayment: Payment = {
      id: `${payments.length + 1}`,
      clientId: paymentData.clientId,
      clientName: paymentData.clientName || "לקוח חדש", // Fallback
      amount: parseFloat(paymentData.amount),
      date: new Date().toLocaleDateString('he-IL'),
      service: paymentData.service,
      status: paymentData.generateInvoice ? "completed" : "pending",
      ...(paymentData.generateInvoice ? { invoiceId: `inv-auto-${Math.floor(Math.random() * 1000)}` } : {})
    };
    
    const updatedPayments = [...payments, newPayment];
    setPayments(updatedPayments);
    setFilteredPayments(updatedPayments);
    setStats(calculatePaymentStats(updatedPayments));
    
    toast({
      title: "תשלום נוסף",
      description: "התשלום נוסף בהצלחה",
    });
  };

  return {
    isLoading,
    filteredPayments,
    overdueClients,
    stats,
    handleFilterChange,
    handleIssueInvoice,
    handleMarkPaid,
    handleSendReminder,
    handleExportData,
    addNewPayment
  };
};
