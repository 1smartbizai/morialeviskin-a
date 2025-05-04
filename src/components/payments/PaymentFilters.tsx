
import { useState } from "react";
import { CalendarIcon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { he } from "date-fns/locale";

interface PaymentFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  treatmentTypes: string[];
}

interface FilterState {
  startDate: Date | undefined;
  endDate: Date | undefined;
  status: string;
  treatmentType: string;
}

export const PaymentFilters = ({ onFilterChange, treatmentTypes }: PaymentFiltersProps) => {
  const [filters, setFilters] = useState<FilterState>({
    startDate: undefined,
    endDate: undefined,
    status: "all",
    treatmentType: "all",
  });

  const handleFilterChange = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      startDate: undefined,
      endDate: undefined,
      status: "all",
      treatmentType: "all",
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <span>תאריך</span>
            {(filters.startDate || filters.endDate) && (
              <Badge variant="secondary" className="ml-2">פעיל</Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            locale={he}
            mode="range"
            defaultMonth={filters.startDate}
            selected={{
              from: filters.startDate,
              to: filters.endDate,
            }}
            onSelect={(range) => {
              handleFilterChange("startDate", range?.from);
              handleFilterChange("endDate", range?.to);
            }}
            className="border-none"
          />
        </PopoverContent>
      </Popover>

      <Select
        value={filters.status}
        onValueChange={(value) => handleFilterChange("status", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="סטטוס תשלום" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">כל הסטטוסים</SelectItem>
          <SelectItem value="completed">שולם</SelectItem>
          <SelectItem value="pending">ממתין לתשלום</SelectItem>
          <SelectItem value="overdue">באיחור</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.treatmentType}
        onValueChange={(value) => handleFilterChange("treatmentType", value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="סוג טיפול" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">כל הטיפולים</SelectItem>
          {treatmentTypes.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button variant="ghost" onClick={handleClearFilters}>
        נקה סינון
      </Button>
    </div>
  );
};

export default PaymentFilters;
