
import AdminLayout from "@/components/layouts/AdminLayout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import InsightsFeed from "@/components/insights/InsightsFeed";
import InsightsHeader from "@/components/insights/InsightsHeader";
import InsightsStats from "@/components/insights/InsightsStats";
import { useAIInsights } from "@/hooks/useAIInsights";

const AIInsightsPage = () => {
  const { insights, isLoading, error, refreshInsights } = useAIInsights();

  return (
    <AdminLayout>
      <div className="space-y-6 rtl">
        <InsightsHeader 
          onRefresh={refreshInsights} 
          isLoading={isLoading} 
        />
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>שגיאה</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InsightsStats />
        </div>
        
        <InsightsFeed 
          insights={insights} 
          isLoading={isLoading} 
        />
      </div>
    </AdminLayout>
  );
};

export default AIInsightsPage;
