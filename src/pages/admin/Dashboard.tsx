
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Calendar, ChartBar } from "lucide-react";
import DailyOverview from "@/components/dashboard/DailyOverview";
import AIInsights from "@/components/dashboard/AIInsights";
import RiskyClients from "@/components/dashboard/RiskyClients";
import NewBusinessDashboard from "@/components/dashboard/NewBusinessDashboard";
import OnboardingTour from "@/components/onboarding/OnboardingTour";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBusinessOnboarding } from "@/hooks/useBusinessOnboarding";

// Mock data for the dashboard
const appointmentsToday = [
  { id: 1, time: "10:00", client: "אמה שדה", service: "צביעת שיער", duration: "90 דקות" },
  { id: 2, time: "12:30", client: "רחל גלפנד", service: "מניקור", duration: "45 דקות" },
  { id: 3, time: "14:00", client: "מוניקה לוי", service: "טיפול פנים", duration: "60 דקות" },
];

const riskyClients = [
  { 
    id: "1", 
    name: "גלי אברהם", 
    debt: 450, 
    lastVisit: "2023-12-15", 
    status: "high" as const, 
    reason: "חוב לא משולם ₪450" 
  },
  { 
    id: "2", 
    name: "דינה כהן", 
    debt: 0, 
    lastVisit: "2023-10-20", 
    status: "medium" as const, 
    reason: "ביטלה 3 תורים ברציפות" 
  },
  { 
    id: "3", 
    name: "שירה לוי", 
    debt: 120, 
    lastVisit: "2024-01-05", 
    status: "low" as const, 
    reason: "חוב קטן לא משולם" 
  },
];

const AdminDashboard = () => {
  const [todayDate, setTodayDate] = useState("");
  const [showTour, setShowTour] = useState(false);
  const { isNewBusiness, hasCompletedTour, businessData, hasAnyData, isLoading } = useBusinessOnboarding();
  
  useEffect(() => {
    // Get current date in Hebrew format
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    setTodayDate(date.toLocaleDateString('he-IL', options));
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-beauty-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  // Show new business onboarding if this is a new business
  if (isNewBusiness && businessData) {
    return (
      <AdminLayout>
        {showTour && (
          <OnboardingTour
            onComplete={() => setShowTour(false)}
            onSkip={() => setShowTour(false)}
            primaryColor={businessData.primary_color}
          />
        )}
        <NewBusinessDashboard
          businessName={businessData.business_name}
          ownerName={businessData.first_name}
          primaryColor={businessData.primary_color}
          accentColor={businessData.accent_color}
          logoUrl={businessData.logo_url}
          onStartTour={() => setShowTour(true)}
        />
      </AdminLayout>
    );
  }

  // Show regular dashboard for established businesses
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-beauty-dark">לוח בקרה</h1>
            <p className="text-muted-foreground">{todayDate}</p>
            {businessData && (
              <p className="text-sm text-muted-foreground">
                {businessData.business_name}
              </p>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button className="bg-beauty-primary hover:bg-opacity-90">
              <Calendar className="ml-2 h-4 w-4" /> תור חדש
            </Button>
          </div>
        </div>

        {/* Daily Overview */}
        <DailyOverview 
          appointmentsCount={appointmentsToday.length} 
          todayIncome={1240} 
          unpaidDebts={570}
        />

        {/* AI Insights */}
        <AIInsights />

        {/* Risky Clients */}
        <RiskyClients clients={riskyClients} />

        {/* Today's Appointments */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>לוח זמנים להיום</CardTitle>
            <CardDescription>יש לך {appointmentsToday.length} פגישות היום</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {appointmentsToday.map((appointment) => (
                <div key={appointment.id} className="flex items-center p-4 rounded-lg bg-beauty-accent">
                  <div className="ml-4 flex-shrink-0 w-14 text-center">
                    <div className="font-medium text-beauty-primary">{appointment.time}</div>
                    <div className="text-xs text-muted-foreground">{appointment.duration}</div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-medium truncate">{appointment.client}</div>
                    <div className="text-sm text-muted-foreground">{appointment.service}</div>
                  </div>
                  <Button variant="outline" size="sm" className="mr-3">לצפייה</Button>
                </div>
              ))}
              {appointmentsToday.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  אין פגישות להיום
                </div>
              )}
              <div className="text-center mt-4">
                <Button variant="link" className="text-beauty-primary">
                  לוח זמנים מלא
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
