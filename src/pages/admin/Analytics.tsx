
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsCharts";
import { AnalyticsMetrics } from "@/components/analytics/AnalyticsMetrics";
import { AnalyticsExport } from "@/components/analytics/AnalyticsExport";
import { useAnalytics } from "@/hooks/useAnalytics";

const Analytics = () => {
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    new Date()
  ]);
  
  const [treatmentType, setTreatmentType] = useState<string | null>(null);
  const [clientSegment, setClientSegment] = useState<string | null>(null);
  const [incomeRange, setIncomeRange] = useState<[number | null, number | null]>([null, null]);
  
  const { 
    metricsData,
    chartData,
    isLoading,
    error
  } = useAnalytics({
    dateRange,
    treatmentType,
    clientSegment,
    incomeRange
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <AnalyticsHeader />
        
        <AnalyticsFilters
          dateRange={dateRange}
          setDateRange={setDateRange}
          treatmentType={treatmentType}
          setTreatmentType={setTreatmentType}
          clientSegment={clientSegment}
          setClientSegment={setClientSegment}
          incomeRange={incomeRange}
          setIncomeRange={setIncomeRange}
        />
        
        <AnalyticsMetrics data={metricsData} isLoading={isLoading} />
        
        <AnalyticsCharts data={chartData} isLoading={isLoading} />
        
        <AnalyticsExport 
          dateRange={dateRange}
          treatmentType={treatmentType}
          clientSegment={clientSegment}
          incomeRange={incomeRange}
        />
      </div>
    </AdminLayout>
  );
};

export default Analytics;
