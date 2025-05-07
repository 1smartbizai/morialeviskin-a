
import { useState, useEffect } from "react";
import ClientLayout from "@/components/layouts/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { CalendarDays, CreditCard, Download, FileText, AlertTriangle } from "lucide-react";
import { useClientPayments } from "@/hooks/useClientPayments";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ClientPayments = () => {
  const { 
    payments, 
    pendingPayments,
    isLoading, 
    totalDebt, 
    downloadInvoice,
    payDebt
  } = useClientPayments();

  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-beauty-dark">היסטוריית תשלומים</h1>
        </div>
        
        {/* Debt Alert */}
        {totalDebt > 0 && (
          <Alert className="bg-beauty-accent/20 border-beauty-accent">
            <AlertTriangle className="h-5 w-5 text-beauty-accent" />
            <AlertTitle className="text-beauty-dark">יש לך חוב פתוח</AlertTitle>
            <AlertDescription className="flex justify-between items-center">
              <span>סכום לתשלום: ₪{totalDebt}</span>
              <Button onClick={payDebt} className="bg-beauty-primary text-white hover:bg-beauty-primary/90">
                שלם עכשיו
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <CardTitle className="flex items-center gap-2 text-lg font-medium">
                <CreditCard className="h-5 w-5 text-beauty-primary" />
                אמצעי תשלום
              </CardTitle>
              <Button variant="outline" className="mt-2 sm:mt-0" size="sm">
                + הוסף אמצעי תשלום
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
                    <div className="text-xs text-muted-foreground">פג תוקף 05/27</div>
                  </div>
                </div>
                <Badge>ברירת מחדל</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <FileText className="h-5 w-5 text-beauty-primary" />
              תשלומים אחרונים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">הכל</TabsTrigger>
                <TabsTrigger value="paid">שולמו</TabsTrigger>
                <TabsTrigger value="pending">ממתינים</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-[1fr,auto,auto] p-4 text-sm font-medium text-muted-foreground bg-muted/50">
                      <div>טיפול</div>
                      <div>תאריך</div>
                      <div className="text-right">סכום</div>
                    </div>
                    
                    {payments.length > 0 ? (
                      payments.map((payment) => (
                        <div 
                          key={payment.id}
                          className="grid grid-cols-[1fr,auto,auto] items-center p-4 border-t text-sm"
                        >
                          <div>
                            <div className="font-medium">{payment.service}</div>
                            {payment.invoiceId && (
                              <div className="text-xs text-muted-foreground flex items-center mt-1">
                                <FileText className="h-3 w-3 ml-1" />
                                <button 
                                  className="text-beauty-primary hover:underline" 
                                  onClick={() => downloadInvoice(payment.id)}
                                >
                                  הורד חשבונית
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <CalendarDays className="h-3 w-3 ml-1" />
                            {payment.date}
                          </div>
                          <div className="text-right font-medium">₪{payment.amount}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        אין תשלומים להצגה
                      </div>
                    )}
                  </div>
                )}
                
                {payments.length > 0 && (
                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      ייצא היסטוריה
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="paid">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(2).fill(0).map((_, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-[1fr,auto,auto] p-4 text-sm font-medium text-muted-foreground bg-muted/50">
                      <div>טיפול</div>
                      <div>תאריך</div>
                      <div className="text-right">סכום</div>
                    </div>
                    
                    {payments.filter(p => p.status === 'paid').length > 0 ? (
                      payments
                        .filter(p => p.status === 'paid')
                        .map((payment) => (
                          <div 
                            key={payment.id}
                            className="grid grid-cols-[1fr,auto,auto] items-center p-4 border-t text-sm"
                          >
                            <div>
                              <div className="font-medium">{payment.service}</div>
                              {payment.invoiceId && (
                                <div className="text-xs text-muted-foreground flex items-center mt-1">
                                  <FileText className="h-3 w-3 ml-1" />
                                  <button 
                                    className="text-beauty-primary hover:underline" 
                                    onClick={() => downloadInvoice(payment.id)}
                                  >
                                    הורד חשבונית
                                  </button>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <CalendarDays className="h-3 w-3 ml-1" />
                              {payment.date}
                            </div>
                            <div className="text-right font-medium">₪{payment.amount}</div>
                          </div>
                        ))
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        אין תשלומים ששולמו להצגה
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pending">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(1).fill(0).map((_, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ))}
                  </div>
                ) : pendingPayments.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="grid grid-cols-[1fr,auto,auto,auto] p-4 text-sm font-medium text-muted-foreground bg-muted/50">
                      <div>טיפול</div>
                      <div>תאריך</div>
                      <div>סכום</div>
                      <div></div>
                    </div>
                    
                    {pendingPayments.map((payment) => (
                      <div 
                        key={payment.id}
                        className="grid grid-cols-[1fr,auto,auto,auto] items-center p-4 border-t text-sm"
                      >
                        <div>
                          <div className="font-medium">{payment.service}</div>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <CalendarDays className="h-3 w-3 ml-1" />
                          {payment.date}
                        </div>
                        <div className="font-medium">₪{payment.amount}</div>
                        <div className="flex justify-end">
                          <Button 
                            size="sm" 
                            className="bg-beauty-primary text-white hover:bg-beauty-primary/90"
                            onClick={() => payDebt(payment.id)}
                          >
                            שלם
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-muted-foreground">אין תשלומים ממתינים</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default ClientPayments;
