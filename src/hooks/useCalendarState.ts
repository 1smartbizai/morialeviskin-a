
import { useState, useEffect } from "react";
import { format, addDays, startOfWeek } from "date-fns";
import { Appointment } from "@/components/appointments/AppointmentCard";
import { getWeekDays, getTimeslots } from "@/utils/calendarUtils";

export const useCalendarState = (initialAppointments: Appointment[]) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(initialAppointments);
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDaysFormatted = getWeekDays(currentDate);
  const timeSlots = getTimeslots();

  useEffect(() => {
    // Filter appointments by staff if staff is selected
    if (selectedStaffId && selectedStaffId !== 'all') {
      setFilteredAppointments(
        initialAppointments.filter((appt) => appt.staffId === selectedStaffId)
      );
    } else {
      setFilteredAppointments(initialAppointments);
    }
  }, [selectedStaffId, initialAppointments]);

  const navigateWeek = (direction: 'next' | 'prev') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };
  
  const getAppointmentsForTimeSlot = (day: Date, time: string) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return filteredAppointments.filter(appt => {
      // In a real app, this would compare the full datetime
      return appt.time === time;
    });
  };

  return {
    currentDate,
    weekStart,
    weekDaysFormatted,
    timeSlots,
    selectedStaffId,
    filteredAppointments,
    setSelectedStaffId,
    navigateWeek,
    getAppointmentsForTimeSlot
  };
};
