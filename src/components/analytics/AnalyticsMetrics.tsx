
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersVertical, TrendingUp } from "lucide-react";

interface MetricsData {
  averageIncomePerClient: number;
  totalAppointments: number;
  clientLifetimeValue: number;
  clientRetentionRate: number;
  monthlyGrowth: number;
}

interface AnalyticsMetricsProps {
  data?: MetricsData;
  isLoading: boolean;
}

export const AnalyticsMetrics = ({ data, isLoading }: AnalyticsMetricsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-3 w-16 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            הכנסה ממוצעת ללקוח
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₪{data?.averageIncomePerClient.toFixed(2) || "0"}</div>
          <div className="text-xs flex items-center text-green-500 mt-1">
            <TrendingUp className="h-3 w-3 ml-1" />
            +8.2% מהתקופה הקודמת
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            סה״כ תורים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.totalAppointments || "0"}</div>
          <div className="text-xs flex items-center text-green-500 mt-1">
            <TrendingUp className="h-3 w-3 ml-1" />
            +12.5% מהתקופה הקודמת
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            ערך לקוח לאורך זמן
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₪{data?.clientLifetimeValue.toFixed(2) || "0"}</div>
          <div className="text-xs flex items-center text-green-500 mt-1">
            <TrendingUp className="h-3 w-3 ml-1" />
            +5.3% מהתקופה הקודמת
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            שימור לקוחות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data?.clientRetentionRate || "0"}%</div>
          <div className="text-xs flex items-center text-green-500 mt-1">
            <TrendingUp className="h-3 w-3 ml-1" />
            +2.1% מהתקופה הקודמת
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
