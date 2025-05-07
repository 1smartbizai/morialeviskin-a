
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientLayout from "@/components/layouts/ClientLayout";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  CalendarDays,
  Clock,
  CreditCard,
  Award,
  ChevronLeft,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import type { Appointment } from "@/types/appointments";

interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  points?: number;
  pending_payment?: number;
}

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [tip, setTip] = useState<string>("");
  
  // Tips pool - will be shown randomly
  const tips = [
    "טיפ: תזכירי לשתות לפחות 8 כוסות מים ביום לעור רענן וזוהר",
    "זכרי למרוח קרם הגנה גם בימי חורף",
    "מומלץ לגוון בשיגרת הטיפוח שלך מדי עונה",
    "טיפול קבוע אחת לחודש יכול לשפר משמעותית את מרקם העור",
  ];
  
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/client/auth");
          return;
        }
        
        // Get client data
        const { data: clientData } = await supabase
          .from("clients")
          .select(`
            id, 
            first_name, 
            last_name
          `)
          .eq("id", user.id)
          .single();
          
        // Get loyalty data
        const { data: loyaltyData } = await supabase
          .from("client_loyalty")
          .select("total_points")
          .eq("client_id", user.id)
          .single();
        
        // Since the appointments table doesn't exist yet in our schema,
        // we'll mock the next appointment data for now
        // In a real implementation, you would fetch from the appointments table
        const mockAppointment = {
          id: "mock-appointment-1",
          client_id: user.id,
          treatment_name: "טיפול פנים מלא",
          appointment_date: new Date().toISOString(),
          status: "confirmed",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (clientData) {
          setClientData({
            ...clientData,
            points: loyaltyData?.total_points || 0,
            pending_payment: 0 // This would come from real payments data
          });
        }
        
        // Set mock appointment data
        setNextAppointment(mockAppointment);
        
        // Set random tip
        setTip(tips[Math.floor(Math.random() * tips.length)]);
        
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [navigate]);
  
  if (isLoading) {
    return (
      <ClientLayout>
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-beauty-primary mx-auto"></div>
            <p className="mt-4 text-beauty-dark">טוען...</p>
          </div>
        </div>
      </ClientLayout>
    );
  }
  
  return (
    <ClientLayout
      businessName="הפינוק שלך"
      clientName={clientData?.first_name}
    >
      <div className="space-y-6 pb-10" dir="rtl">
        {/* Greeting & Next Appointment */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-l from-beauty-primary/70 to-beauty-primary text-white p-6">
            <h1 className="text-2xl font-bold mb-1">
              שלום {clientData?.first_name}
            </h1>
            <p className="text-white/90">ברוכה הבאה חזרה לאזור האישי שלך</p>
          </div>
          
          <CardContent className="p-4 md:p-6">
            {nextAppointment ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Calendar className="ml-2 h-5 w-5 text-beauty-primary" />
                    התור הבא שלך
                  </h3>
                  <div className="bg-beauty-accent/20 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-lg">{nextAppointment.treatment_name}</h4>
                      <Badge>{nextAppointment.status === "confirmed" ? "מאושר" : nextAppointment.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <CalendarDays className="ml-1 h-4 w-4" />
                        {format(new Date(nextAppointment.appointment_date), "dd בMMMM", { locale: he })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="ml-1 h-4 w-4" />
                        {format(new Date(nextAppointment.appointment_date), "HH:mm")}
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button variant="outline" className="text-beauty-primary" onClick={() => navigate("/client/appointments")}>
                        <ChevronLeft className="ml-1 h-4 w-4" />
                        צפייה בכל התורים
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="mb-4 text-muted-foreground">לא קבעת תור עדיין</p>
                <Button 
                  className="bg-beauty-primary hover:bg-beauty-primary/90"
                  onClick={() => navigate("/client/appointments")}
                >
                  קביעת תור
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Rewards & Payments Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientData?.points !== undefined && clientData.points > 0 && (
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-amber-900 mb-1">נקודות נאמנות</h3>
                    <div className="text-2xl font-bold text-amber-700">{clientData.points} נקודות</div>
                    <p className="text-sm text-amber-800 mt-1">עוד 50 נקודות להטבה הבאה</p>
                  </div>
                  <Award className="h-10 w-10 text-amber-500" />
                </div>
                <Button 
                  variant="outline"
                  className="mt-4 border-amber-300 text-amber-700 hover:bg-amber-200/50 hover:text-amber-900"
                  onClick={() => navigate("/client/rewards")}
                >
                  למימוש נקודות
                </Button>
              </CardContent>
            </Card>
          )}
          
          {clientData?.pending_payment !== undefined && clientData.pending_payment > 0 && (
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-blue-900 mb-1">תשלום ממתין</h3>
                    <div className="text-2xl font-bold text-blue-700">₪{clientData.pending_payment}</div>
                    <p className="text-sm text-blue-800 mt-1">עבור הטיפול האחרון</p>
                  </div>
                  <CreditCard className="h-10 w-10 text-blue-500" />
                </div>
                <Button 
                  variant="outline"
                  className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-200/50 hover:text-blue-900"
                  onClick={() => navigate("/client/payments")}
                >
                  לתשלום
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Tip/Promo Card */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-start">
              <Sparkles className="h-6 w-6 text-purple-500 ml-3 mt-1 shrink-0" />
              <div>
                <h3 className="font-medium text-purple-900 mb-2">טיפ אישי עבורך</h3>
                <p className="text-purple-800">{tip}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-beauty-dark">פעולות מהירות</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center text-beauty-dark hover:bg-beauty-accent/20"
              onClick={() => navigate("/client/appointments")}
            >
              <Calendar className="h-7 w-7 mb-2 text-beauty-primary" />
              <span>קביעת תור</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center text-beauty-dark hover:bg-beauty-accent/20"
              onClick={() => navigate("/client/treatments")}
            >
              <BookOpen className="h-7 w-7 mb-2 text-beauty-primary" />
              <span>טיפולים</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-6 flex flex-col items-center text-beauty-dark hover:bg-beauty-accent/20"
              onClick={() => navigate("/client/rewards")}
            >
              <Award className="h-7 w-7 mb-2 text-beauty-primary" />
              <span>הטבות</span>
            </Button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
