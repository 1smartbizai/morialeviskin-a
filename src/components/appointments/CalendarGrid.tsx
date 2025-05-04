
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { Appointment } from "./AppointmentCard";
import TimeSlot from "./TimeSlot";
import { cn } from "@/lib/utils";
import { isToday } from "@/utils/calendarUtils";

const weekDays = ["יום א׳", "יום ב׳", "יום ג׳", "יום ד׳", "יום ה׳", "יום ו׳", "שבת"];

interface CalendarGridProps {
  weekDaysFormatted: Date[];
  timeSlots: string[];
  onDragEnd: (event: DragEndEvent) => void;
  getAppointmentsForTimeSlot: (day: Date, time: string) => Appointment[];
  onAppointmentClick: (appointmentId: string) => void;
}

const CalendarGrid = ({
  weekDaysFormatted,
  timeSlots,
  onDragEnd,
  getAppointmentsForTimeSlot,
  onAppointmentClick
}: CalendarGridProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 10px of movement before drag starts
      },
    })
  );

  return (
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
              <div>{isToday(day) ? "היום" : day.getDate()}</div>
            </div>
          ))}
        </div>
        
        {/* Time grid */}
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
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
                  <TimeSlot
                    key={`${time}-${dayIndex}`}
                    day={day}
                    time={time}
                    appointments={dayAppointments}
                    isCurrentDay={isToday(day)}
                    onAppointmentClick={onAppointmentClick}
                  />
                );
              })}
            </div>
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default CalendarGrid;
