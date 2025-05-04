
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, Calendar } from "lucide-react";

interface WorkingHoursStepProps {
  data: any;
  updateData: (data: any) => void;
}

interface DayConfig {
  active: boolean;
  start: string;
  end: string;
}

const weekdays = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const WorkingHoursStep = ({ data, updateData }: WorkingHoursStepProps) => {
  const [workingHours, setWorkingHours] = useState<{
    [key: string]: DayConfig;
  }>(data.workingHours);
  
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState<boolean>(
    data.googleCalendarConnected || false
  );

  const updateDay = (day: string, field: keyof DayConfig, value: any) => {
    const updatedHours = {
      ...workingHours,
      [day]: {
        ...workingHours[day],
        [field]: value,
      },
    };
    
    setWorkingHours(updatedHours);
    updateData({ workingHours: updatedHours });
  };

  const handleConnectGoogle = () => {
    // In a real application, this would initiate the OAuth flow with Google
    // For now, we'll just simulate a successful connection
    setGoogleCalendarConnected(true);
    updateData({ googleCalendarConnected: true });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>Set Your Working Hours</CardTitle>
          </div>
          <CardDescription>
            Define when clients can book appointments with you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weekdays.map((day) => (
              <div
                key={day.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={workingHours[day.id].active}
                    onCheckedChange={(checked) =>
                      updateDay(day.id, "active", checked)
                    }
                    id={`${day.id}-active`}
                  />
                  <Label
                    htmlFor={`${day.id}-active`}
                    className={`font-medium ${
                      !workingHours[day.id].active && "text-muted-foreground"
                    }`}
                  >
                    {day.label}
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Input
                    type="time"
                    value={workingHours[day.id].start}
                    onChange={(e) =>
                      updateDay(day.id, "start", e.target.value)
                    }
                    disabled={!workingHours[day.id].active}
                    className="w-32"
                  />
                  <span className="text-muted-foreground">to</span>
                  <Input
                    type="time"
                    value={workingHours[day.id].end}
                    onChange={(e) => updateDay(day.id, "end", e.target.value)}
                    disabled={!workingHours[day.id].active}
                    className="w-32"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>Google Calendar Integration</CardTitle>
          </div>
          <CardDescription>
            Sync your appointments with Google Calendar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {googleCalendarConnected ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-700">
                  Connected to Google Calendar
                </h4>
                <p className="text-sm text-green-600">
                  Your appointments will be automatically synced
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setGoogleCalendarConnected(false);
                  updateData({ googleCalendarConnected: false });
                }}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Connect your Google Calendar to automatically:
                </p>
                <ul className="text-sm list-disc list-inside space-y-1">
                  <li>Sync your appointments between systems</li>
                  <li>Avoid double-bookings</li>
                  <li>Get calendar notifications for new bookings</li>
                </ul>
              </div>
              <Button onClick={handleConnectGoogle} className="whitespace-nowrap">
                Connect Google Calendar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkingHoursStep;
