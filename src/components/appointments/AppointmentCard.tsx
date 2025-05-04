
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import AppointmentBadge from "./AppointmentBadge";

export interface Appointment {
  id: string;
  clientName: string;
  serviceName: string;
  time: string;
  duration: number; // in minutes
  staffId: string;
  status: "confirmed" | "done" | "canceled" | "pending";
}

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: (appointmentId: string) => void;
}

const AppointmentCard = ({ appointment, onClick }: AppointmentCardProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: appointment.id,
    data: appointment,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-2 rounded-md bg-white shadow-sm border border-beauty-accent cursor-grab active:cursor-grabbing"
      onClick={() => onClick(appointment.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-sm">{appointment.clientName}</h4>
          <p className="text-xs text-muted-foreground">{appointment.serviceName}</p>
        </div>
        <AppointmentBadge status={appointment.status} className="text-xs" />
      </div>
      <div className="mt-2 text-xs text-muted-foreground">
        {appointment.time} • {appointment.duration} דקות
      </div>
    </div>
  );
};

export default AppointmentCard;
