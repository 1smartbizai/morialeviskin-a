
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Calendar } from "lucide-react";

const InsightsStats = () => {
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            תורים לשבוע הקרוב
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">16</div>
          <div className="text-xs flex items-center text-green-500 mt-1">
            <TrendingUp className="h-3 w-3 ml-1" />
            +20% משבוע שעבר
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            לקוחות פעילים החודש
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">32</div>
          <div className="text-xs flex items-center text-green-500 mt-1">
            <TrendingUp className="h-3 w-3 ml-1" />
            +8% מהחודש שעבר
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            הכנסה צפויה השבוע
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₪4,200</div>
          <div className="text-xs flex items-center text-green-500 mt-1">
            <TrendingUp className="h-3 w-3 ml-1" />
            +15% משבוע שעבר
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default InsightsStats;
