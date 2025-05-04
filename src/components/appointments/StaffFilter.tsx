
import { Check } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface Staff {
  id: string;
  name: string;
}

interface StaffFilterProps {
  staff: Staff[];
  selectedStaffId: string | null;
  onStaffChange: (staffId: string) => void;
}

const StaffFilter = ({ staff, selectedStaffId, onStaffChange }: StaffFilterProps) => {
  return (
    <div className="w-full max-w-xs">
      <Select 
        value={selectedStaffId || "all"}
        onValueChange={onStaffChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="בחר איש צוות" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">כל אנשי הצוות</SelectItem>
          {staff.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StaffFilter;
