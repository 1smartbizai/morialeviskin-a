
import { TreatmentFilter } from "@/hooks/useTreatmentHistory";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface TreatmentHistoryFiltersProps {
  filters: TreatmentFilter;
  updateFilters: (filters: Partial<TreatmentFilter>) => void;
  availableTreatments: { id: string; name: string }[];
}

export const TreatmentHistoryFilters = ({
  filters,
  updateFilters,
  availableTreatments
}: TreatmentHistoryFiltersProps) => {
  // Check if any filter is active
  const hasActiveFilters = !!(filters.treatmentId || filters.fromDate || filters.toDate);
  
  // Reset all filters
  const resetFilters = () => {
    updateFilters({
      treatmentId: null,
      fromDate: null,
      toDate: null
    });
  };
  
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-beauty-dark">סינון וחיפוש</h2>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="h-auto py-1 px-2 text-beauty-primary"
          >
            <X className="h-4 w-4 me-1" />
            איפוס סינון
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" dir="rtl">
        {/* Treatment filter */}
        <div>
          <Select
            value={filters.treatmentId || ""}
            onValueChange={(value) => updateFilters({ treatmentId: value || null })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="כל הטיפולים" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">כל הטיפולים</SelectItem>
              {availableTreatments.map((treatment) => (
                <SelectItem key={treatment.id} value={treatment.id}>
                  {treatment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* From Date filter */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-right"
              >
                <CalendarIcon className="ms-0 me-2 h-4 w-4" />
                {filters.fromDate ? (
                  format(filters.fromDate, "dd/MM/yyyy", { locale: he })
                ) : (
                  "החל מתאריך"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.fromDate || undefined}
                onSelect={(date) => updateFilters({ fromDate: date })}
                initialFocus
                locale={he}
              />
              {filters.fromDate && (
                <div className="p-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => updateFilters({ fromDate: null })}
                  >
                    <X className="me-2 h-4 w-4" />
                    נקה בחירה
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
        
        {/* To Date filter */}
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-right"
              >
                <CalendarIcon className="ms-0 me-2 h-4 w-4" />
                {filters.toDate ? (
                  format(filters.toDate, "dd/MM/yyyy", { locale: he })
                ) : (
                  "עד תאריך"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.toDate || undefined}
                onSelect={(date) => updateFilters({ toDate: date })}
                initialFocus
                locale={he}
                disabled={(date) => 
                  filters.fromDate ? date < filters.fromDate : false
                }
              />
              {filters.toDate && (
                <div className="p-3 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => updateFilters({ toDate: null })}
                  >
                    <X className="me-2 h-4 w-4" />
                    נקה בחירה
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Active filters badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2">
          {filters.treatmentId && (
            <Badge variant="secondary" className="px-2 py-1">
              {availableTreatments.find(t => t.id === filters.treatmentId)?.name}
              <X 
                className="ms-2 h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ treatmentId: null })}
              />
            </Badge>
          )}
          {filters.fromDate && (
            <Badge variant="secondary" className="px-2 py-1">
              החל מ: {format(filters.fromDate, "dd/MM/yyyy", { locale: he })}
              <X 
                className="ms-2 h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ fromDate: null })}
              />
            </Badge>
          )}
          {filters.toDate && (
            <Badge variant="secondary" className="px-2 py-1">
              עד: {format(filters.toDate, "dd/MM/yyyy", { locale: he })}
              <X 
                className="ms-2 h-3 w-3 cursor-pointer" 
                onClick={() => updateFilters({ toDate: null })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
