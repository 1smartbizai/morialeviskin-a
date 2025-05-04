
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentStatsProps {
  isLoading: boolean;
  stats: {
    totalRevenue: number;
    outstandingPayments: number;
    transactionCount: number;
  };
  overdueClientsCount: number;
}

export const PaymentStats = ({ isLoading, stats, overdueClientsCount }: PaymentStatsProps) => {
  if (isLoading) {
    return (
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
    );
  }

  return (
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
          <p className="text-xs text-muted-foreground mt-1">{overdueClientsCount} לקוחות עם תשלומים ממתינים</p>
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
  );
};
