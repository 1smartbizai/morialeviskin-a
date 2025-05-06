
import { ClientInsightsModule } from "@/components/client-insights/ClientInsightsModule";
import AdminLayout from "@/components/layouts/AdminLayout";

const ClientInsights = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-beauty-dark">תובנות לקוח</h1>
          <p className="text-muted-foreground">מעקב וניהול אינטראקציות עם לקוחות וזיהוי לקוחות בסיכון</p>
        </div>
        
        <ClientInsightsModule />
      </div>
    </AdminLayout>
  );
};

export default ClientInsights;
