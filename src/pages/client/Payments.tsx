
import ClientLayout from "@/components/layouts/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CreditCard, Download, FileText } from "lucide-react";

// Mock data for payments
const recentPayments = [
  {
    id: 1,
    service: "Signature Facial",
    date: "June 1, 2025",
    amount: 120,
    status: "paid"
  },
  {
    id: 2,
    service: "Hair Styling",
    date: "May 15, 2025",
    amount: 85,
    status: "paid"
  },
  {
    id: 3,
    service: "Manicure",
    date: "April 30, 2025",
    amount: 45,
    status: "paid"
  }
];

const ClientPayments = () => {
  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-beauty-dark">Payment History</h1>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <CreditCard className="h-5 w-5 text-beauty-primary" />
                Payment Methods
              </CardTitle>
              <Button variant="outline" className="mt-2 sm:mt-0" size="sm">
                + Add Payment Method
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="bg-muted h-10 w-14 rounded flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-beauty-dark" />
                  </div>
                  <div>
                    <div className="font-medium">•••• 4929</div>
                    <div className="text-xs text-muted-foreground">Expires 05/27</div>
                  </div>
                </div>
                <Badge>Default</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <FileText className="h-5 w-5 text-beauty-primary" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr,auto,auto] p-4 text-sm font-medium text-muted-foreground bg-muted/50">
                    <div>Service</div>
                    <div>Date</div>
                    <div className="text-right">Amount</div>
                  </div>
                  {recentPayments.map((payment) => (
                    <div 
                      key={payment.id}
                      className="grid grid-cols-[1fr,auto,auto] items-center p-4 border-t text-sm"
                    >
                      <div>
                        <div className="font-medium">{payment.service}</div>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {payment.date}
                      </div>
                      <div className="text-right font-medium">${payment.amount}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Export History
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="paid">
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr,auto,auto] p-4 text-sm font-medium text-muted-foreground bg-muted/50">
                    <div>Service</div>
                    <div>Date</div>
                    <div className="text-right">Amount</div>
                  </div>
                  {recentPayments.map((payment) => (
                    <div 
                      key={payment.id}
                      className="grid grid-cols-[1fr,auto,auto] items-center p-4 border-t text-sm"
                    >
                      <div>
                        <div className="font-medium">{payment.service}</div>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {payment.date}
                      </div>
                      <div className="text-right font-medium">${payment.amount}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="pending">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No pending payments</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClientPayments;
