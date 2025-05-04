
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, UserX } from "lucide-react";

interface DailyOverviewProps {
  appointmentsCount: number;
  todayIncome: number;
  unpaidDebts: number;
}

const DailyOverview = ({ appointmentsCount, todayIncome, unpaidDebts }: DailyOverviewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">היום פגישות</CardTitle>
            <Calendar className="h-5 w-5 text-beauty-primary" />
          </div>
          <div className="text-2xl font-bold">{appointmentsCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {appointmentsCount > 0 
              ? "לחץ לצפייה בלוח זמנים" 
              : "אין פגישות היום"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">הכנסות היום</CardTitle>
            <CreditCard className="h-5 w-5 text-beauty-primary" />
          </div>
          <div className="text-2xl font-bold">₪{todayIncome.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {todayIncome > 0 
              ? "הכנסות מאושרות" 
              : "אין הכנסות עדיין"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חובות לא משולמים</CardTitle>
            <UserX className="h-5 w-5 text-destructive" />
          </div>
          <div className="text-2xl font-bold">₪{unpaidDebts.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {unpaidDebts > 0 
              ? "לחץ לפרטים נוספים" 
              : "אין חובות פתוחים"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyOverview;
