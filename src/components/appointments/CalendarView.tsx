
import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { Calendar, Plus } from "lucide-react";
import { format, addDays, startOfWeek, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AppointmentCard, { Appointment } from "./AppointmentCard";
import StaffFilter, { Staff } from "./StaffFilter";
import { formatDate, getWeekDays, isToday, getTimeslots } from "@/utils/calendarUtils";

const weekDays = ["יום א׳", "יום ב׳", "יום ג׳", "יום ד׳", "יום ה׳", "יום ו׳", "שבת"];

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
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(mockAppointments);
  const [isGoogleSynced, setIsGoogleSynced] = useState<boolean>(false);
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDaysFormatted = getWeekDays(currentDate);
  const timeSlots = getTimeslots();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 10px of movement before drag starts
      },
    })
  );

  useEffect(() => {
    // Filter appointments by staff if staff is selected
    if (selectedStaffId && selectedStaffId !== 'all') {
      setFilteredAppointments(
        mockAppointments.filter((appt) => appt.staffId === selectedStaffId)
      );
    } else {
      setFilteredAppointments(mockAppointments);
    }
  }, [selectedStaffId]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Process appointment reschedule logic here
    console.log(`Moving appointment ${active.id} to new time/date`);
    
    // In a real implementation, we would update the appointment details
    // and make an API call to save the changes
  };

  const navigateWeek = (direction: 'next' | 'prev') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };
  
  const handleAppointmentClick = (appointmentId: string) => {
    onEditAppointment(appointmentId);
  };

  const getAppointmentsForTimeSlot = (day: Date, time: string) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return filteredAppointments.filter(appt => {
      // In a real app, this would compare the full datetime
      return appt.time === time;
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Calendar Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('prev')}
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {formatDate(weekStart, "MMM d")} - {formatDate(addDays(weekStart, 6), "MMM d, yyyy")}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigateWeek('next')}
          >
            <Calendar className="h-4 w-4" />
          </Button>
        </div>
        
        <StaffFilter 
          staff={mockStaff}
          selectedStaffId={selectedStaffId}
          onStaffChange={(staffId) => setSelectedStaffId(staffId)}
        />
      </div>

      {/* Calendar Grid */}
      <div className="grow overflow-auto border rounded-md bg-white">
        <div className="min-w-[900px]"> {/* Ensure minimum width for small screens */}
          {/* Days header */}
          <div className="grid grid-cols-8 bg-beauty-accent border-b">
            <div className="p-2 text-sm font-medium border-l"></div>
            {weekDaysFormatted.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 text-sm font-medium text-center border-l",
                  isToday(day) && "bg-beauty-primary bg-opacity-20"
                )}
              >
                <div>{weekDays[index]}</div>
                <div>{formatDate(day, "d MMM")}</div>
              </div>
            ))}
          </div>
          
          {/* Time grid */}
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-8 border-b">
                {/* Time column */}
                <div className="p-2 text-sm text-muted-foreground border-l">
                  {time}
                </div>
                
                {/* Day columns */}
                {weekDaysFormatted.map((day, dayIndex) => {
                  const dayAppointments = getAppointmentsForTimeSlot(day, time);
                  return (
                    <div
                      key={`${time}-${dayIndex}`}
                      className={cn(
                        "p-1 border-l min-h-[80px]",
                        isToday(day) && "bg-beauty-primary bg-opacity-5"
                      )}
                    >
                      {dayAppointments.map((appointment) => (
                        <AppointmentCard
                          key={appointment.id}
                          appointment={appointment}
                          onClick={handleAppointmentClick}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </DndContext>
        </div>
      </div>
      
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
