
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, CreditCard, Download } from "lucide-react";

// Mock payments data
const recentPayments = [
  {
    id: 1,
    clientName: "Sarah Johnson",
    amount: 120,
    date: "June 1, 2025",
    service: "Signature Facial",
    status: "completed"
  },
  {
    id: 2,
    clientName: "Michael Chen",
    amount: 85,
    date: "May 28, 2025",
    service: "Hair Styling",
    status: "completed"
  },
  {
    id: 3,
    clientName: "Emily Rodriguez",
    amount: 45,
    date: "May 25, 2025",
    service: "Manicure",
    status: "completed"
  }
];

const AdminPayments = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-beauty-dark">Payments</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button className="bg-beauty-primary">+ New Payment</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,245.00</div>
              <p className="text-xs text-muted-foreground mt-1">+12.5% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Outstanding Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$420.00</div>
              <p className="text-xs text-muted-foreground mt-1">3 clients with pending payments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transaction Count
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <CreditCard className="h-5 w-5 text-beauty-primary" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-[1fr,auto,auto,auto] p-4 text-sm font-medium text-muted-foreground bg-muted/50">
                <div>Client / Service</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
              </div>
              {recentPayments.map((payment) => (
                <div 
                  key={payment.id}
                  className="grid grid-cols-[1fr,auto,auto,auto] items-center p-4 border-t text-sm"
                >
                  <div>
                    <div className="font-medium text-beauty-dark">{payment.clientName}</div>
                    <div className="text-xs text-muted-foreground">{payment.service}</div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <CalendarDays className="h-3 w-3 mr-1" />
                    {payment.date}
                  </div>
                  <div className="font-medium">${payment.amount}</div>
                  <div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
