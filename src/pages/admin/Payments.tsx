
import { useState, useEffect } from "react";
import { Download, CreditCard, FileText, Filter } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { PaymentsList } from "@/components/payments/PaymentsList";
import { DebtTracker } from "@/components/payments/DebtTracker";
import PaymentFilters from "@/components/payments/PaymentFilters";

// Mock treatment types
const treatmentTypes = ["טיפול פנים", "פדיקור", "מניקור", "עיצוב גבות", "טיפול עיניים"];

// Mock payments data
const mockPayments = [
  {
    id: "1",
    clientId: "c1",
    clientName: "שרה כהן",
    amount: 450,
    date: "1 ביוני, 2025",
    service: "טיפול פנים",
    status: "completed" as const,
    invoiceId: "inv-123",
  },
  {
    id: "2",
    clientId: "c2",
    clientName: "מיכאל לוי",
    amount: 180,
    date: "28 במאי, 2025",
    service: "פדיקור",
    status: "pending" as const,
  },
  {
    id: "3",
    clientId: "c3",
    clientName: "אמילי כץ",
    amount: 320,
    date: "25 במאי, 2025",
    service: "מניקור",
    status: "overdue" as const,
  },
  {
    id: "4",
    clientId: "c4",
    clientName: "דוד פרץ",
    amount: 550,
    date: "22 במאי, 2025",
    service: "טיפול פנים מלא",
    status: "completed" as const,
    invoiceId: "inv-124",
  },
  {
    id: "5",
    clientId: "c5",
    clientName: "רותי אברהם",
    amount: 250,
    date: "20 במאי, 2025",
    service: "עיצוב גבות",
    status: "pending" as const,
  },
];

// Mock overdue clients
const mockOverdueClients = [
  {
    id: "c3",
    name: "אמילי כץ",
    balance: 320,
    daysOverdue: 15,
    lastContact: "לפני 5 ימים",
  },
  {
    id: "c6",
    name: "גלית אזולאי",
    balance: 620,
    daysOverdue: 30,
    lastContact: "לפני שבוע",
  },
  {
    id: "c7",
    name: "אבי משה",
    balance: 180,
    daysOverdue: 7,
  },
];

const AdminPayments = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [filteredPayments, setFilteredPayments] = useState(mockPayments);
  const [overdueClients, setOverdueClients] = useState(mockOverdueClients);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    outstandingPayments: 0,
    transactionCount: 0,
  });

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Calculate stats
      const completed = mockPayments.filter(p => p.status === "completed");
      const pending = mockPayments.filter(p => p.status === "pending" || p.status === "overdue");
      
      setStats({
        totalRevenue: completed.reduce((sum, p) => sum + p.amount, 0),
        outstandingPayments: pending.reduce((sum, p) => sum + p.amount, 0),
        transactionCount: mockPayments.length,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = (filters: any) => {
    let filtered = [...mockPayments];
    
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
    const updatedPayments = filteredPayments.map(payment => {
      if (payment.id === paymentId) {
        return {
          ...payment,
          status: "completed" as const,
          invoiceId: `inv-${Math.floor(Math.random() * 1000)}`,
        };
      }
      return payment;
    });
    
    setFilteredPayments(updatedPayments);
  };

  const handleMarkPaid = (paymentId: string | number) => {
    // Update the payment status and ensure it has an invoiceId when marked as completed
    const updatedPayments = filteredPayments.map(payment => {
      if (payment.id === paymentId) {
        return {
          ...payment,
          status: "completed" as const,
          // Generate a placeholder invoiceId for manually completed payments
          invoiceId: `manual-${Math.floor(Math.random() * 1000)}`,
        };
      }
      return payment;
    });
    
    setFilteredPayments(updatedPayments);
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
  };

  const handleExportData = () => {
    toast({
      title: "יוצא דו״ח תשלומים",
      description: "הדו״ח יישלח לתיבת המייל שלך בהקדם",
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-beauty-dark">תשלומים וחשבוניות</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportData}>
              <Download className="h-4 w-4" />
              ייצוא
            </Button>
            <Button className="bg-beauty-primary">+ תשלום חדש</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-3 w-48 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-3 w-48 mt-2" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-3 w-48 mt-2" />
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    הכנסות כוללות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₪{stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">+12.5% מהחודש הקודם</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    תשלומים פתוחים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₪{stats.outstandingPayments.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1">{overdueClients.length} לקוחות עם תשלומים ממתינים</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    סה״כ עסקאות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.transactionCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">החודש הנוכחי</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        
        {isLoading ? (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ) : (
          <>
            <PaymentFilters 
              onFilterChange={handleFilterChange} 
              treatmentTypes={treatmentTypes} 
            />
            
            <PaymentsList 
              payments={filteredPayments}
              onIssueInvoice={handleIssueInvoice}
              onMarkPaid={handleMarkPaid}
            />
            
            <DebtTracker 
              clients={overdueClients}
              onSendReminder={handleSendReminder}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
