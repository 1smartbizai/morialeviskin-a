
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Appointment } from "@/components/appointments/AppointmentCard";
import CalendarView from "@/components/appointments/CalendarView";
import AppointmentDetails from "@/components/appointments/AppointmentDetails";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";

// Mock appointment data
const mockAppointments: Appointment[] = [
  {
    id: "appt-1",
    clientName: "לימור אבני",
    serviceName: "טיפול פנים",
    time: "10:00",
    duration: 60,
    staffId: "staff-1",
    status: "confirmed",
  },
  {
    id: "appt-2",
    clientName: "עדי גולן",
    serviceName: "פדיקור",
    time: "12:00",
    duration: 45,
    staffId: "staff-1",
    status: "done",
  },
  {
    id: "appt-3",
    clientName: "רותם לוי",
    serviceName: "צביעת שיער",
    time: "14:00",
    duration: 90,
    staffId: "staff-2",
    status: "pending",
  },
  {
    id: "appt-4",
    clientName: "אמיר כהן",
    serviceName: "תספורת",
    time: "16:00",
    duration: 30,
    staffId: "staff-2",
    status: "canceled",
  },
];

const AdminCalendarView = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const { 
    isConnected: isGoogleConnected,
    connectGoogleCalendar,
    isSyncing
  } = useGoogleCalendar();

  const handleCreateAppointment = () => {
    toast({
      title: "הוספת פגישה חדשה",
      description: "ממשק הוספת פגישה יפתח בקרוב",
    });
  };

  const handleEditAppointment = (appointmentId: string) => {
    const appointment = mockAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      setSelectedAppointment(appointment);
      setIsDetailsOpen(true);
    }
  };

  const handleStatusChange = (appointmentId: string, newStatus: Appointment["status"]) => {
    // Update appointment status in the database
    toast({
      title: "עדכון סטטוס",
      description: `סטטוס הפגישה עודכן ל${newStatus}`,
    });
    
    // In a real implementation, we'd update the appointment in the database
    // and then refresh the calendar view
  };

  const handleConnectGoogle = async () => {
    const connected = await connectGoogleCalendar();
    if (connected) {
      toast({
        title: "חיבור ליומן גוגל",
        description: "החשבון חובר בהצלחה, הפגישות מסתנכרנות",
      });
    } else {
      toast({
        title: "שגיאת חיבור",
        description: "לא ניתן היה לחבר את יומן גוגל, נסה שנית",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col h-full space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-beauty-primary" />
            <h1 className="text-2xl font-bold text-beauty-dark">לוח זמנים</h1>
          </div>
          
          {!isGoogleConnected ? (
            <Button 
              onClick={handleConnectGoogle}
              disabled={isSyncing}
              variant="outline"
              className="text-sm"
            >
              {isSyncing ? "מחבר..." : "חבר ליומן גוגל"}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-sm text-green-600"
              disabled
            >
              מחובר ליומן גוגל
            </Button>
          )}
        </div>
        
        {/* Calendar Component */}
        <div className="flex-1 min-h-[500px]">
          <CalendarView
            onCreateAppointment={handleCreateAppointment}
            onEditAppointment={handleEditAppointment}
          />
        </div>
        
        {/* Appointment Details Modal */}
        <AppointmentDetails
          appointment={selectedAppointment}
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          onStatusChange={handleStatusChange}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminCalendarView;
