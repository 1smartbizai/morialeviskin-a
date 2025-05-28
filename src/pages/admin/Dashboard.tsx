
import { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import DailyOverview from "@/components/dashboard/DailyOverview";
import AIInsights from "@/components/dashboard/AIInsights";
import RiskyClients from "@/components/dashboard/RiskyClients";
import NewBusinessDashboard from "@/components/dashboard/NewBusinessDashboard";
import OnboardingTour from "@/components/onboarding/OnboardingTour";
import MonthlyGoals from "@/components/dashboard/MonthlyGoals";
import SmartNotifications from "@/components/dashboard/SmartNotifications";
import QuickHelp from "@/components/dashboard/QuickHelp";
import SystemStatus from "@/components/dashboard/SystemStatus";
import ProfitabilityCalculator from "@/components/dashboard/ProfitabilityCalculator";
import DailyMotivation from "@/components/dashboard/DailyMotivation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBusinessOnboarding } from "@/hooks/useBusinessOnboarding";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  
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
      <div className="space-y-6" dir="rtl">
        {/* כותרת דשבורד */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-beauty-dark mb-1">הלוח הראשי שלי</h1>
            <p className="text-muted-foreground">{todayDate}</p>
            {businessData && (
              <p className="text-sm text-beauty-primary font-medium">
                {businessData.business_name}
              </p>
            )}
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              className="bg-beauty-primary hover:bg-opacity-90 animate-scale-in"
              onClick={() => navigate('/admin/appointments')}
            >
              <Plus className="ml-2 h-4 w-4" /> תור חדש
            </Button>
          </div>
        </div>

        {/* מוטיבציה יומית */}
        <DailyMotivation />

        {/* Grid ראשי של הדשבורד */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* עמודה שמאלית - תוכן ראשי */}
          <div className="lg:col-span-8 space-y-6">
            {/* סקירה יומית */}
            <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <DailyOverview 
                appointmentsCount={appointmentsToday.length} 
                todayIncome={1240} 
                unpaidDebts={570}
              />
            </div>

            {/* יעדים חודשיים */}
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <MonthlyGoals />
            </div>

            {/* תובנות AI */}
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <AIInsights />
            </div>

            {/* לקוחות בסיכון */}
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <RiskyClients clients={riskyClients} />
            </div>

            {/* התורים של היום */}
            <Card className="animate-fade-in hover:shadow-md transition-all duration-300" style={{ animationDelay: '500ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-beauty-primary" />
                  התורים שלי היום
                </CardTitle>
                <CardDescription>יש לך {appointmentsToday.length} פגישות היום</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointmentsToday.map((appointment, index) => (
                    <div 
                      key={appointment.id} 
                      className="flex items-center p-4 rounded-lg bg-beauty-accent hover:bg-beauty-accent/80 transition-all duration-200 animate-scale-in cursor-pointer"
                      style={{ animationDelay: `${600 + index * 100}ms` }}
                      onClick={() => navigate('/admin/appointments')}
                    >
                      <div className="ml-4 flex-shrink-0 w-14 text-center">
                        <div className="font-medium text-beauty-primary">{appointment.time}</div>
                        <div className="text-xs text-muted-foreground">{appointment.duration}</div>
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="font-medium truncate">{appointment.client}</div>
                        <div className="text-sm text-muted-foreground">{appointment.service}</div>
                      </div>
                      <Button variant="outline" size="sm" className="mr-3 hover-scale">לצפייה</Button>
                    </div>
                  ))}
                  {appointmentsToday.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p className="font-medium">אין תורים היום</p>
                      <p className="text-sm">זה הזמן המושלם לתכנן את יום המחר</p>
                    </div>
                  )}
                  <div className="text-center mt-4">
                    <Button 
                      variant="link" 
                      className="text-beauty-primary hover-scale"
                      onClick={() => navigate('/admin/calendar')}
                    >
                      לוח הזמנים המלא שלי
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* עמודה ימנית - ווידג'טים צדדיים */}
          <div className="lg:col-span-4 space-y-6">
            {/* התראות חכמות */}
            <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
              <SmartNotifications />
            </div>

            {/* מחשבון רווחיות */}
            <div className="animate-fade-in" style={{ animationDelay: '700ms' }}>
              <ProfitabilityCalculator />
            </div>

            {/* סטטוס מערכת */}
            <div className="animate-fade-in" style={{ animationDelay: '800ms' }}>
              <SystemStatus />
            </div>
          </div>
        </div>

        {/* כפתור עזרה צף */}
        <QuickHelp />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
