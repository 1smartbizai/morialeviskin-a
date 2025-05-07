
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarDays, ChevronLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import type { Appointment } from "@/types/appointments";

interface NextAppointmentProps {
  appointment: Appointment | null;
}

const NextAppointment = ({ appointment }: NextAppointmentProps) => {
  const navigate = useNavigate();

  if (!appointment) {
    return (
      <div className="text-center py-6">
        <p className="mb-4 text-muted-foreground">לא קבעת תור עדיין</p>
        <Button 
          className="bg-beauty-primary hover:bg-beauty-primary/90"
          onClick={() => navigate("/client/appointments")}
        >
          קביעת תור
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <Calendar className="ml-2 h-5 w-5 text-beauty-primary" />
          התור הבא שלך
        </h3>
        <div className="bg-beauty-accent/20 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-bold text-lg">{appointment.treatment_name}</h4>
            <Badge>{appointment.status === "confirmed" ? "מאושר" : appointment.status}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarDays className="ml-1 h-4 w-4" />
              {format(new Date(appointment.appointment_date), "dd בMMMM", { locale: he })}
            </div>
            <div className="flex items-center">
              <Clock className="ml-1 h-4 w-4" />
              {format(new Date(appointment.appointment_date), "HH:mm")}
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
  );
};

export default NextAppointment;
