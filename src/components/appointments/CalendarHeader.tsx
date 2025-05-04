
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format, addDays } from "date-fns";
import StaffFilter, { Staff } from "./StaffFilter";
import { formatDate } from "@/utils/calendarUtils";

interface CalendarHeaderProps {
  weekStart: Date;
  selectedStaffId: string | null;
  staff: Staff[];
  onNavigateWeek: (direction: 'next' | 'prev') => void;
  onStaffChange: (staffId: string) => void;
}

const CalendarHeader = ({
  weekStart,
  selectedStaffId,
  staff,
  onNavigateWeek,
  onStaffChange
}: CalendarHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigateWeek('prev')}
        >
          <Calendar className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {formatDate(weekStart, "MMM d")} - {formatDate(addDays(weekStart, 6), "MMM d, yyyy")}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onNavigateWeek('next')}
        >
          <Calendar className="h-4 w-4" />
        </Button>
      </div>
      
      <StaffFilter 
        staff={staff}
        selectedStaffId={selectedStaffId}
        onStaffChange={onStaffChange}
      />
    </div>
  );
};

export default CalendarHeader;
