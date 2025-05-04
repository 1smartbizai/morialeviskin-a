
import { cn } from "@/lib/utils";
import AppointmentCard, { Appointment } from "./AppointmentCard";
import { isToday } from "@/utils/calendarUtils";

interface TimeSlotProps {
  day: Date;
  time: string;
  appointments: Appointment[];
  isCurrentDay: boolean;
  onAppointmentClick: (appointmentId: string) => void;
}

const TimeSlot = ({ day, time, appointments, isCurrentDay, onAppointmentClick }: TimeSlotProps) => {
  return (
    <div
      className={cn(
        "p-1 border-l min-h-[80px]",
        isCurrentDay && "bg-beauty-primary bg-opacity-5"
      )}
    >
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onClick={onAppointmentClick}
        />
      ))}
    </div>
  );
};

export default TimeSlot;
