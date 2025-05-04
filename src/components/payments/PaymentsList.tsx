
import { useState } from "react";
import { Calendar, CalendarDays, Check, Clock, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Payment type definition
interface Payment {
  id: string | number;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  service: string;
  status: "completed" | "pending" | "overdue";
  invoiceId?: string;
}

interface PaymentsListProps {
  payments: Payment[];
  onIssueInvoice?: (paymentId: string | number) => void;
  onMarkPaid?: (paymentId: string | number) => void;
}

export const PaymentsList = ({ payments, onIssueInvoice, onMarkPaid }: PaymentsListProps) => {
  const { toast } = useToast();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const handleIssueInvoice = (payment: Payment) => {
    if (onIssueInvoice) {
      onIssueInvoice(payment.id);
      toast({
        title: "חשבונית נשלחה",
        description: `חשבונית עבור ${payment.clientName} נשלחה בהצלחה`,
      });
    }
  };

  const handleMarkPaid = (payment: Payment) => {
    if (onMarkPaid) {
      onMarkPaid(payment.id);
      toast({
        title: "תשלום עודכן",
        description: `התשלום של ${payment.clientName} סומן כשולם`,
      });
    }
  };

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">שולם</Badge>;
      case "pending":
        return <Badge variant="warning">ממתין לתשלום</Badge>;
      case "overdue":
        return <Badge variant="destructive">באיחור</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <Receipt className="h-5 w-5 text-beauty-primary" />
          רשימת תשלומים
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>לקוח / טיפול</TableHead>
              <TableHead>תאריך</TableHead>
              <TableHead>סכום</TableHead>
              <TableHead>סטטוס</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <div className="font-medium">{payment.clientName}</div>
                  <div className="text-xs text-muted-foreground">{payment.service}</div>
                </TableCell>
                <TableCell className="flex items-center text-muted-foreground">
                  <CalendarDays className="h-3 w-3 ml-1" />
                  <span>{payment.date}</span>
                </TableCell>
                <TableCell className="font-medium">${payment.amount}</TableCell>
                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {payment.status !== "completed" && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Receipt className="mr-1" />
                              צור חשבונית
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>הנפק חשבונית</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <p>האם להנפיק חשבונית עבור {payment.clientName}?</p>
                              <p className="text-sm text-muted-foreground mt-2">
                                פעולה זו תיצור חשבונית באמצעות Green Invoice ותשלח אותה ללקוח.
                              </p>
                            </div>
                            <DialogFooter>
                              <Button 
                                onClick={() => {
                                  handleIssueInvoice(payment);
                                }}
                              >
                                הנפק חשבונית
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Check className="mr-1" />
                              סמן כשולם
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>סמן כשולם</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <p>האם לסמן תשלום זה כשולם?</p>
                              <p className="text-sm text-muted-foreground mt-2">
                                פעולה זו תעדכן את סטטוס התשלום ללא יצירת חשבונית.
                              </p>
                            </div>
                            <DialogFooter>
                              <Button 
                                onClick={() => {
                                  handleMarkPaid(payment);
                                }}
                              >
                                סמן כשולם
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                    {payment.invoiceId && (
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "הצג חשבונית",
                          description: "פתיחת חשבונית בחלון חדש",
                        });
                      }}>
                        צפה בחשבונית
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
