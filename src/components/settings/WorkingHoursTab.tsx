
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DaySchedule {
  isOpen: boolean;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

interface WorkingHours {
  sunday: DaySchedule;
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
}

interface WorkingHoursTabProps {
  businessOwner: any;
}

const DEFAULT_SCHEDULE: DaySchedule = {
  isOpen: true,
  startTime: "09:00",
  endTime: "18:00"
};

const WorkingHoursTab = ({ businessOwner }: WorkingHoursTabProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const [workingHours, setWorkingHours] = useState<WorkingHours>(() => {
    if (businessOwner?.working_hours) {
      return businessOwner.working_hours;
    }
    
    return {
      sunday: { ...DEFAULT_SCHEDULE },
      monday: { ...DEFAULT_SCHEDULE },
      tuesday: { ...DEFAULT_SCHEDULE },
      wednesday: { ...DEFAULT_SCHEDULE },
      thursday: { ...DEFAULT_SCHEDULE },
      friday: { ...DEFAULT_SCHEDULE, isOpen: false },
      saturday: { ...DEFAULT_SCHEDULE, isOpen: false },
    };
  });
  
  const [holidays, setHolidays] = useState<{ date: string; description: string }[]>(
    businessOwner?.holidays || []
  );

  const handleHoursChange = (day: keyof WorkingHours, field: keyof DaySchedule, value: any) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handleAddHoliday = () => {
    setHolidays([...holidays, { date: "", description: "" }]);
  };

  const handleHolidayChange = (index: number, field: string, value: string) => {
    const updatedHolidays = [...holidays];
    updatedHolidays[index] = {
      ...updatedHolidays[index],
      [field]: value
    };
    setHolidays(updatedHolidays);
  };

  const handleRemoveHoliday = (index: number) => {
    setHolidays(holidays.filter((_, i) => i !== index));
  };

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("business_owners")
        .update({
          working_hours: workingHours,
          holidays: holidays
        })
        .eq("id", businessOwner.id);

      if (error) throw error;
      toast.success("שעות עבודה וחופשות עודכנו בהצלחה");
    } catch (error) {
      console.error("Error saving working hours:", error);
      toast.error("שגיאה בשמירת שעות העבודה והחופשות");
    } finally {
      setIsLoading(false);
    }
  };

  const dayNames = {
    sunday: "ראשון",
    monday: "שני",
    tuesday: "שלישי",
    wednesday: "רביעי",
    thursday: "חמישי",
    friday: "שישי",
    saturday: "שבת"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>שעות פעילות</CardTitle>
          <CardDescription>הגדר את שעות הפעילות של העסק</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(Object.keys(workingHours) as Array<keyof WorkingHours>).map((day) => (
              <div key={day} className="grid grid-cols-10 items-center gap-4">
                <div className="col-span-2">
                  <Label htmlFor={`${day}-switch`}>{dayNames[day]}</Label>
                </div>
                <div className="col-span-1">
                  <Switch
                    id={`${day}-switch`}
                    checked={workingHours[day].isOpen}
                    onCheckedChange={(checked) => handleHoursChange(day, "isOpen", checked)}
                  />
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${day}-start`} className="min-w-12">מ:</Label>
                    <Input
                      type="time"
                      id={`${day}-start`}
                      value={workingHours[day].startTime}
                      onChange={(e) => handleHoursChange(day, "startTime", e.target.value)}
                      disabled={!workingHours[day].isOpen}
                    />
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`${day}-end`} className="min-w-12">עד:</Label>
                    <Input
                      type="time"
                      id={`${day}-end`}
                      value={workingHours[day].endTime}
                      onChange={(e) => handleHoursChange(day, "endTime", e.target.value)}
                      disabled={!workingHours[day].isOpen}
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  {workingHours[day].breakStart && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleHoursChange(day, "breakStart", undefined);
                        handleHoursChange(day, "breakEnd", undefined);
                      }}
                    >
                      הסר הפסקה
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <div>
              <CardTitle>ימי חופשה</CardTitle>
              <CardDescription>הגדר ימי חופשה שבהם העסק סגור</CardDescription>
            </div>
            <Button onClick={handleAddHoliday} variant="outline">הוסף חופשה</Button>
          </div>
        </CardHeader>
        <CardContent>
          {holidays.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              לא הוגדרו ימי חופשה
            </div>
          ) : (
            <div className="space-y-4">
              {holidays.map((holiday, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-10 gap-4 items-end border-b pb-4">
                  <div className="md:col-span-3">
                    <Label>תאריך</Label>
                    <Input
                      type="date"
                      value={holiday.date}
                      onChange={(e) => handleHolidayChange(index, "date", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-5">
                    <Label>תיאור</Label>
                    <Input
                      placeholder="תיאור החופשה"
                      value={holiday.description}
                      onChange={(e) => handleHolidayChange(index, "description", e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleRemoveHoliday(index)}
                    >
                      הסר
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={saveChanges} disabled={isLoading}>
            {isLoading ? "שומר..." : "שמור שינויים"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WorkingHoursTab;
