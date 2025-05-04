
import { Insight } from "@/types/insights";
import InsightCard from "@/components/insights/InsightCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb } from "lucide-react";

interface InsightsFeedProps {
  insights: Insight[];
  isLoading: boolean;
}

const InsightsFeed = ({ insights, isLoading }: InsightsFeedProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">תובנות והמלצות</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-16 w-full" />
              <div className="flex justify-end mt-3">
                <Skeleton className="h-9 w-32" />
              </div>
            </div>
          ))
        ) : (
          insights.length > 0 ? (
            insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Lightbulb className="mx-auto h-12 w-12 mb-3 text-gray-400" />
              <p className="text-lg font-medium">אין תובנות להצגה כרגע</p>
              <p className="text-sm">נסה שוב מאוחר יותר או לחץ על כפתור הרענון</p>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default InsightsFeed;
