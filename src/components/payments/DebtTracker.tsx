
import { useState } from "react";
import { AlarmClock, Mail, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface DebtClient {
  id: string;
  name: string;
  balance: number;
  daysOverdue: number;
  lastContact?: string;
}

interface DebtTrackerProps {
  clients: DebtClient[];
  onSendReminder: (clientId: string) => void;
}

export const DebtTracker = ({ clients, onSendReminder }: DebtTrackerProps) => {
  const { toast } = useToast();
  const [sending, setSending] = useState<Record<string, boolean>>({});

  const handleSendReminder = async (clientId: string) => {
    setSending((prev) => ({ ...prev, [clientId]: true }));
    try {
      await onSendReminder(clientId);
      toast({
        title: "תזכורת נשלחה בהצלחה",
        description: "הלקוח קיבל הודעה על התשלום",
      });
    } catch (error) {
      toast({
        title: "שגיאה בשליחת תזכורת",
        description: "אירעה שגיאה בשליחת התזכורת",
        variant: "destructive",
      });
    } finally {
      setSending((prev) => ({ ...prev, [clientId]: false }));
    }
  };

  const getOverdueBadge = (days: number) => {
    if (days <= 7) return <Badge variant="warning">{days} ימים</Badge>;
    if (days <= 30) return <Badge variant="warning">{days} ימים</Badge>;
    return <Badge variant="destructive">{days} ימים</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <TrendingUp className="h-5 w-5 text-beauty-primary" />
          מעקב חובות
        </CardTitle>
      </CardHeader>
      <CardContent>
        {clients.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">אין חובות פתוחים כרגע</div>
        ) : (
          <div className="space-y-4">
            {clients.map((client) => (
              <div key={client.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{client.name}</h3>
                  <div className="flex items-center mt-1 gap-2">
                    <span className="text-sm text-muted-foreground">באיחור:</span>
                    {getOverdueBadge(client.daysOverdue)}
                  </div>
                  {client.lastContact && (
                    <div className="text-xs text-muted-foreground mt-1">
                      תזכורת אחרונה: {client.lastContact}
                    </div>
                  )}
                </div>
                <div className="mt-3 sm:mt-0 flex flex-col items-start sm:items-end">
                  <div className="font-semibold text-lg text-beauty-primary">
                    ₪{client.balance.toFixed(2)}
                  </div>
                  <Button 
                    size="sm" 
                    className="mt-2"
                    disabled={sending[client.id]}
                    onClick={() => handleSendReminder(client.id)}
                  >
                    {sending[client.id] ? (
                      <AlarmClock className="mr-1 animate-spin" />
                    ) : (
                      <Mail className="mr-1" />
                    )}
                    שלח תזכורת
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
