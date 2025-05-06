
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Filter, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface AnalyticsFiltersProps {
  dateRange: [Date | undefined, Date | undefined];
  setDateRange: React.Dispatch<React.SetStateAction<[Date | undefined, Date | undefined]>>;
  treatmentType: string | null;
  setTreatmentType: React.Dispatch<React.SetStateAction<string | null>>;
  clientSegment: string | null;
  setClientSegment: React.Dispatch<React.SetStateAction<string | null>>;
  incomeRange: [number | null, number | null];
  setIncomeRange: React.Dispatch<React.SetStateAction<[number | null, number | null]>>;
}

export const AnalyticsFilters = ({
  dateRange,
  setDateRange,
  treatmentType,
  setTreatmentType,
  clientSegment,
  setClientSegment,
  incomeRange,
  setIncomeRange
}: AnalyticsFiltersProps) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  
  const formatDateRange = () => {
    if (dateRange[0] && dateRange[1]) {
      return `${format(dateRange[0], "dd.MM.yyyy", { locale: he })} - ${format(dateRange[1], "dd.MM.yyyy", { locale: he })}`;
    }
    return "בחר טווח תאריכים";
  };
  
  const formatIncomeRange = () => {
    if (incomeRange[0] !== null && incomeRange[1] !== null) {
      return `₪${incomeRange[0]} - ₪${incomeRange[1]}`;
    }
    return "כל טווחי ההכנסה";
  };
  
  const handleResetFilters = () => {
    setDateRange([
      new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      new Date()
    ]);
    setTreatmentType(null);
    setClientSegment(null);
    setIncomeRange([null, null]);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "min-w-[200px] justify-start text-right",
                    dateRange[0] && dateRange[1] ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange[0]}
                  selected={{
                    from: dateRange[0],
                    to: dateRange[1]
                  }}
                  onSelect={(range) => {
                    setDateRange([range?.from, range?.to]);
                  }}
                  numberOfMonths={2}
                  locale={he}
                />
              </PopoverContent>
            </Popover>

            <Button 
              variant={isFiltersExpanded ? "default" : "outline"}
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="sm:ml-auto"
            >
              <Filter className="ml-2 h-4 w-4" />
              {isFiltersExpanded ? "הסתר סינון מתקדם" : "סינון מתקדם"}
            </Button>
          </div>
        </div>

        {isFiltersExpanded && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="treatment-type">סוג טיפול</Label>
              <Select
                value={treatmentType || ""}
                onValueChange={(value) => setTreatmentType(value || null)}
              >
                <SelectTrigger id="treatment-type" className="mt-1">
                  <SelectValue placeholder="כל סוגי הטיפולים" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>טיפולים</SelectLabel>
                    <SelectItem value="">כל הטיפולים</SelectItem>
                    <SelectItem value="facial">טיפולי פנים</SelectItem>
                    <SelectItem value="hair">טיפולי שיער</SelectItem>
                    <SelectItem value="nails">טיפולי ציפורניים</SelectItem>
                    <SelectItem value="massage">עיסויים</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="client-segment">סגמנט לקוחות</Label>
              <Select
                value={clientSegment || ""}
                onValueChange={(value) => setClientSegment(value || null)}
              >
                <SelectTrigger id="client-segment" className="mt-1">
                  <SelectValue placeholder="כל סגמנטי הלקוחות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="">כל הלקוחות</SelectItem>
                    <SelectItem value="new">לקוחות חדשים</SelectItem>
                    <SelectItem value="returning">לקוחות חוזרים</SelectItem>
                    <SelectItem value="vip">לקוחות VIP</SelectItem>
                    <SelectItem value="inactive">לא פעילים</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="income-range">טווח הכנסה</Label>
              <div className="mt-6 px-2">
                <Slider
                  defaultValue={[0, 100]}
                  min={0}
                  max={5000}
                  step={100}
                  onValueChange={(value) => setIncomeRange([value[0], value[1]])}
                  className="mt-2"
                />
                <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                  <div>₪0</div>
                  <div>₪5,000+</div>
                </div>
                <div className="text-center mt-2 text-sm">{formatIncomeRange()}</div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleResetFilters}
              className="mt-2 md:col-span-3"
            >
              אפס סינונים
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
