
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { he } from "date-fns/locale";

export const formatDate = (date: Date, formatStr: string) => {
  return format(date, formatStr, { locale: he });
};

export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 0 });
  return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
};

export const isToday = (date: Date) => {
  return isSameDay(date, new Date());
};

export const getTimeslots = () => {
  return Array.from({ length: 13 }).map((_, i) => {
    const hour = i + 8; // Start at 8 AM
    return `${hour}:00`;
  });
};
