
import { useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Appointment } from "./AppointmentCard";
import { Staff } from "./StaffFilter";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import { useCalendarState } from "@/hooks/useCalendarState";

// Mock staff data
const mockStaff: Staff[] = [
  { id: "staff-1", name: "שרון לוי" },
  { id: "staff-2", name: "דנה כהן" },
];

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

interface CalendarViewProps {
  onCreateAppointment: () => void;
  onEditAppointment: (appointmentId: string) => void;
}

const CalendarView = ({ onCreateAppointment, onEditAppointment }: CalendarViewProps) => {
  const [isGoogleSynced, setIsGoogleSynced] = useState<boolean>(false);
  
  const {
    weekStart,
    weekDaysFormatted,
    timeSlots,
    selectedStaffId,
    navigateWeek,
    setSelectedStaffId,
    getAppointmentsForTimeSlot
  } = useCalendarState(mockAppointments);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Process appointment reschedule logic here
    console.log(`Moving appointment ${active.id} to new time/date`);
    
    // In a real implementation, we would update the appointment details
    // and make an API call to save the changes
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Calendar Controls */}
      <CalendarHeader
        weekStart={weekStart}
        selectedStaffId={selectedStaffId}
        staff={mockStaff}
        onNavigateWeek={navigateWeek}
        onStaffChange={setSelectedStaffId}
      />

      {/* Calendar Grid */}
      <CalendarGrid
        weekDaysFormatted={weekDaysFormatted}
        timeSlots={timeSlots}
        onDragEnd={handleDragEnd}
        getAppointmentsForTimeSlot={getAppointmentsForTimeSlot}
        onAppointmentClick={onEditAppointment}
      />
      
      {/* Sync Status */}
      <div className="mt-2 text-xs text-muted-foreground">
        {isGoogleSynced ? 
          "מסונכרן עם יומן גוגל" : 
          "לחץ לסנכרן עם יומן גוגל"
        }
      </div>
      
      {/* Floating Action Button */}
      <Button
        onClick={onCreateAppointment}
        className="fixed left-6 bottom-6 right-auto w-12 h-12 rounded-full shadow-lg bg-beauty-primary hover:bg-beauty-primary/90"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default CalendarView;
