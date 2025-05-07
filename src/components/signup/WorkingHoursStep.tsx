
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useSignup } from "@/contexts/SignupContext";

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

const daysTranslation: Record<DayKey, string> = {
  sunday: 'ראשון',
  monday: 'שני',
  tuesday: 'שלישי',
  wednesday: 'רביעי',
  thursday: 'חמישי',
  friday: 'שישי',
  saturday: 'שבת',
};

const WorkingHoursStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const [googleConnected, setGoogleConnected] = useState(signupData.googleCalendarConnected);
  
  const handleWorkingHoursChange = (
    day: DayKey, 
    field: 'active' | 'start' | 'end', 
    value: boolean | string
  ) => {
    const updatedHours = {
      ...signupData.workingHours,
      [day]: {
        ...signupData.workingHours[day],
        [field]: value
      }
    };
    
    updateSignupData({ workingHours: updatedHours });
  };
  
  const handleConnectGoogle = () => {
    // Simulate Google Calendar connection
    setGoogleConnected(true);
    updateSignupData({ googleCalendarConnected: true });
    
    // In a real app, this would be an OAuth flow
    alert("תכונה זו תהיה זמינה בהמשך. לחצתם על התחברות ל-Google Calendar.");
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="grid grid-cols-1 gap-6">
        {/* Working Hours */}
        <div>
          <h3 className="text-lg font-medium mb-4">שעות פעילות</h3>
          <div className="space-y-4">
            {(Object.keys(daysTranslation) as DayKey[]).map((day) => (
              <div key={day} className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center space-x-4">
                  <Switch 
                    checked={signupData.workingHours[day]?.active || false}
                    onCheckedChange={(checked) => handleWorkingHoursChange(day, 'active', checked)}
                  />
                  <Label className="mr-2">{daysTranslation[day]}</Label>
                </div>
                
                {signupData.workingHours[day]?.active && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <Input
                        type="time"
                        value={signupData.workingHours[day]?.start || '09:00'}
                        onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                        className="w-24"
                      />
                      <span className="mx-2">עד</span>
                      <Input
                        type="time"
                        value={signupData.workingHours[day]?.end || '17:00'}
                        onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                        className="w-24"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Calendar Integration */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="mr-2">
                  <h4 className="font-medium">Google Calendar</h4>
                  <p className="text-sm text-muted-foreground">סנכרנו את היומן שלך עם Google Calendar</p>
                </div>
              </div>
              
              <Button 
                variant={googleConnected ? "outline" : "default"}
                onClick={handleConnectGoogle}
                disabled={googleConnected}
              >
                {googleConnected ? 'מחובר' : 'חברי יומן'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkingHoursStep;
