
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AnalyticsFilters {
  dateRange: [Date | undefined, Date | undefined];
  treatmentType: string | null;
  clientSegment: string | null;
  incomeRange: [number | null, number | null];
}

export function useAnalytics(filters: AnalyticsFilters) {
  const [metricsData, setMetricsData] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        // Since we don't have an actual table to query yet, we'll just simulate the loading
        // In a real implementation, you'd query Supabase here using the filters
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data for demonstration
        setMetricsData({
          averageIncomePerClient: 854.32,
          totalAppointments: 142,
          clientLifetimeValue: 3250.75,
          clientRetentionRate: 78
        });

        setChartData({
          revenueOverTime: [
            { name: "ינואר", revenue: 1200 },
            { name: "פברואר", revenue: 1800 },
            { name: "מרץ", revenue: 2200 },
            { name: "אפריל", revenue: 2600 },
            { name: "מאי", revenue: 3200 },
            { name: "יוני", revenue: 3800 },
          ],
          clientsBySegment: [
            { name: "חדשים", value: 45 },
            { name: "חוזרים", value: 32 },
            { name: "VIP", value: 28 },
            { name: "לא פעילים", value: 19 },
          ],
          treatmentPopularity: [
            { name: "טיפולי פנים", count: 45 },
            { name: "טיפולי שיער", count: 32 },
            { name: "טיפולי ציפורניים", count: 28 },
            { name: "עיסויים", count: 19 },
          ],
        });
      } catch (err: any) {
        console.error("Failed to fetch analytics data:", err);
        setError(err);
        toast.error("התרחשה שגיאה בטעינת הנתונים");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [
    filters.dateRange, 
    filters.treatmentType, 
    filters.clientSegment, 
    filters.incomeRange
  ]);

  return {
    metricsData,
    chartData,
    isLoading,
    error
  };
}
