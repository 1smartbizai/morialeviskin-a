import { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, TrendingUp, Users, DollarSign } from "lucide-react";
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
import DashboardStats from "@/components/dashboard/DashboardStats";
import AppointmentChart from "@/components/dashboard/AppointmentChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import QuickActions from "@/components/dashboard/QuickActions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useBusinessOnboarding } from "@/hooks/useBusinessOnboarding";
import { useNavigate } from "react-router-dom";
import { FeatureGate } from "@/components/plan-gating";
import { BarChart3, Brain, Sparkles } from "lucide-react";

// Mock data for the dashboard
const appointmentsToday = [
  { id: 1, time: "10:00", client: "אמה שדה", service: "צביעת שיער", duration: "90 דקות", status: "confirmed" },
  { id: 2, time: "12:30", client: "רחל גלפנד", service: "מניקור", duration: "45 דקות", status: "confirmed" },
  { id: 3, time: "14:00", client: "מוניקה לוי", service: "טיפול פנים", duration: "60 דקות", status: "pending" },
  { id: 4, time: "16:30", client: "שירה כהן", service: "עיצוב גבות", duration: "30 דקות", status: "confirmed" },
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
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-beauty-primary border-t-transparent"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 opacity-20 animate-pulse"></div>
          </div>
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
      <div className="space-y-8 animate-fade-in">
        {/* כותרת דשבורד עם אנימציות */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-purple-600 via-pink-600 to-blue-600 text-white p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-l from-purple-600/90 via-pink-600/90 to-blue-600/90"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24 animate-float"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold animate-fade-in">
                  ברוכה השבה, {businessData?.first_name || 'יקרה'}! ✨
                </h1>
                <p className="text-lg text-white/90 animate-fade-in" style={{ animationDelay: '200ms' }}>
                  {todayDate}
                </p>
                {businessData && (
                  <p className="text-sm text-white/80 font-medium animate-fade-in" style={{ animationDelay: '400ms' }}>
                    {businessData.business_name} • מערכת ניהול מתקדמת
                  </p>
                )}
              </div>
              
              <div className="flex gap-3 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <Button 
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white hover:scale-105 transition-all duration-300 shadow-lg"
                  onClick={() => navigate('/admin/appointments')}
                >
                  <Plus className="ml-2 h-5 w-5" />
                  תור חדש
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="bg-transparent hover:bg-white/10 border-white/30 text-white hover:scale-105 transition-all duration-300"
                  onClick={() => navigate('/admin/calendar')}
                >
                  <Calendar className="ml-2 h-5 w-5" />
                  לוח שנה
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* סטטיסטיקות עיקריות */}
        <DashboardStats 
          appointmentsToday={appointmentsToday.length}
          monthlyRevenue={45230}
          newClients={12}
          satisfactionRate={4.8}
        />

        {/* מוטיבציה יומית */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <DailyMotivation />
        </div>

        {/* פעולות מהירות */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <QuickActions />
        </div>

        {/* Grid ראשי של הדשבורד */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* עמודה שמאלית - תוכן ראשי */}
          <div className="xl:col-span-8 space-y-8">
            {/* סקירה יומית */}
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <DailyOverview 
                appointmentsCount={appointmentsToday.length} 
                todayIncome={1240} 
                unpaidDebts={570}
              />
            </div>

            {/* תרשימים ואנליטיקה */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <AppointmentChart />
              <FeatureGate 
                feature="advanced_analytics"
                fallback={
                  <Card className="h-full flex items-center justify-center">
                    <div className="text-center p-6">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">דוחות הכנסות מתקדמים</h3>
                      <p className="text-sm text-muted-foreground">זמין בתכנית Pro ומעלה</p>
                    </div>
                  </Card>
                }
                showUpgradePrompt={true}
              >
                <RevenueChart />
              </FeatureGate>
            </div>

            {/* יעדים חודשיים */}
            <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
              <MonthlyGoals />
            </div>

            {/* תובנות AI */}
            <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
              <FeatureGate 
                feature="ai_insights"
                fallback={
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        תובנות AI
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-medium mb-2">תובנות חכמות מבוססות AI</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        קבלי המלצות מותאמות אישית לשיפור העסק שלך
                      </p>
                    </CardContent>
                  </Card>
                }
                showUpgradePrompt={true}
              >
                <AIInsights />
              </FeatureGate>
            </div>

            {/* לקוחות בסיכון */}
            <div className="animate-fade-in" style={{ animationDelay: '700ms' }}>
              <RiskyClients clients={riskyClients} />
            </div>

            {/* התורים של היום */}
            <Card className="animate-fade-in hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50" style={{ animationDelay: '800ms' }}>
              <CardHeader className="bg-gradient-to-l from-blue-50 to-purple-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">התורים שלי היום</h3>
                    <p className="text-sm text-gray-600">יש לך {appointmentsToday.length} פגישות מתוכננות</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {appointmentsToday.map((appointment, index) => (
                    <div 
                      key={appointment.id} 
                      className="group flex items-center p-4 rounded-xl bg-gradient-to-l from-gray-50 to-white hover:from-blue-50 hover:to-purple-50 border border-gray-100 hover:border-purple-200 transition-all duration-300 animate-scale-in cursor-pointer hover:shadow-md hover:scale-[1.02]"
                      style={{ animationDelay: `${900 + index * 100}ms` }}
                      onClick={() => navigate('/admin/appointments')}
                    >
                      <div className="ml-4 flex-shrink-0 w-16 text-center">
                        <div className="font-bold text-lg bg-gradient-to-br from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {appointment.time}
                        </div>
                        <div className="text-xs text-gray-500">{appointment.duration}</div>
                      </div>
                      
                      <div className="flex-grow min-w-0 mr-4">
                        <div className="font-semibold text-gray-800 truncate text-lg">{appointment.client}</div>
                        <div className="text-sm text-gray-600">{appointment.service}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appointment.status === 'confirmed' ? 'מאושר' : 'ממתין'}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="hover:bg-purple-50 hover:text-purple-700 border-purple-200 group-hover:scale-105 transition-all duration-300"
                        >
                          פרטים
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {appointmentsToday.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <div className="mb-4">
                        <Calendar className="h-16 w-16 mx-auto text-gray-300" />
                      </div>
                      <p className="font-medium text-lg mb-2">אין תורים היום</p>
                      <p className="text-sm">זה הזמן המושלם לתכנן את יום המחר ✨</p>
                    </div>
                  )}
                  
                  <div className="text-center mt-6 pt-4 border-t">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="hover:bg-gradient-to-l hover:from-purple-50 hover:to-pink-50 border-purple-200 hover:border-purple-300 hover:scale-105 transition-all duration-300"
                      onClick={() => navigate('/admin/calendar')}
                    >
                      <Calendar className="ml-2 h-4 w-4" />
                      לוח הזמנים המלא שלי
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* עמודה ימנית - ווידג'טים צדדיים */}
          <div className="xl:col-span-4 space-y-6">
            {/* התראות חכמות */}
            <div className="animate-fade-in" style={{ animationDelay: '900ms' }}>
              <SmartNotifications />
            </div>

            {/* מחשבון רווחיות */}
            <div className="animate-fade-in" style={{ animationDelay: '1000ms' }}>
              <FeatureGate 
                feature="custom_reports"
                fallback={
                  <Card>
                    <CardHeader>
                      <CardTitle>מחשבון רווחיות</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-6">
                      <DollarSign className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        זמין בתכנית Gold ומעלה
                      </p>
                    </CardContent>
                  </Card>
                }
                showUpgradePrompt={true}
              >
                <ProfitabilityCalculator />
              </FeatureGate>
            </div>

            {/* סטטוס מערכת */}
            <div className="animate-fade-in" style={{ animationDelay: '1100ms' }}>
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
