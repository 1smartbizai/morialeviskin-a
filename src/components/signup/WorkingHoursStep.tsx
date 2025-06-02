
import { useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Sun, 
  Moon,
  Sparkles,
  AlertTriangle
} from "lucide-react";

const WorkingHoursStep = () => {
  const { signupData, updateSignupData } = useSignup();
  
  // Hebrew day names starting with Sunday
  const daysInHebrew = {
    sunday: { name: "ראשון", icon: "☀️" },
    monday: { name: "שני", icon: "💼" },
    tuesday: { name: "שלישי", icon: "💪" },
    wednesday: { name: "רביעי", icon: "⚡" },
    thursday: { name: "חמישי", icon: "🎯" },
    friday: { name: "שישי", icon: "🌟" },
    saturday: { name: "שבת", icon: "🌙" }
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateTime = (day: string, timeType: 'start' | 'end', value: string) => {
    const newErrors = { ...errors };
    const errorKey = `${day}_${timeType}`;
    
    if (!value) {
      newErrors[errorKey] = `שעת ${timeType === 'start' ? 'פתיחה' : 'סגירה'} נדרשת`;
    } else {
      // Check if end time is after start time for the same day
      const currentDay = signupData.workingHours[day];
      if (timeType === 'end' && currentDay.start) {
        const startTime = new Date(`2000-01-01T${currentDay.start}`);
        const endTime = new Date(`2000-01-01T${value}`);
        
        if (endTime <= startTime) {
          newErrors[errorKey] = 'שעת הסגירה חייבת להיות אחרי שעת הפתיחה';
        } else {
          delete newErrors[errorKey];
        }
      } else if (timeType === 'start' && currentDay.end) {
        const startTime = new Date(`2000-01-01T${value}`);
        const endTime = new Date(`2000-01-01T${currentDay.end}`);
        
        if (endTime <= startTime) {
          newErrors[`${day}_end`] = 'שעת הסגירה חייבת להיות אחרי שעת הפתיחה';
        } else {
          delete newErrors[`${day}_end`];
        }
      } else {
        delete newErrors[errorKey];
      }
    }
    
    setErrors(newErrors);
  };

  const updateWorkingHours = (day: string, field: 'active' | 'start' | 'end', value: boolean | string) => {
    const currentHours = signupData.workingHours || {};
    const updatedHours = {
      ...currentHours,
      [day]: {
        ...currentHours[day],
        [field]: value
      }
    };
    
    updateSignupData({ workingHours: updatedHours });
    
    // Validate time if it's a time field
    if (field === 'start' || field === 'end') {
      validateTime(day, field, value as string);
    }
    
    // Clear errors if day is deactivated
    if (field === 'active' && !value) {
      const newErrors = { ...errors };
      delete newErrors[`${day}_start`];
      delete newErrors[`${day}_end`];
      setErrors(newErrors);
    }
  };

  // Quick setup presets
  const applyPreset = (preset: string) => {
    let newHours = {};
    
    switch (preset) {
      case 'standard':
        newHours = {
          sunday: { active: true, start: "09:00", end: "17:00" },
          monday: { active: true, start: "09:00", end: "17:00" },
          tuesday: { active: true, start: "09:00", end: "17:00" },
          wednesday: { active: true, start: "09:00", end: "17:00" },
          thursday: { active: true, start: "09:00", end: "17:00" },
          friday: { active: true, start: "09:00", end: "15:00" },
          saturday: { active: false, start: "10:00", end: "14:00" }
        };
        break;
      case 'evening':
        newHours = {
          sunday: { active: true, start: "16:00", end: "22:00" },
          monday: { active: true, start: "16:00", end: "22:00" },
          tuesday: { active: true, start: "16:00", end: "22:00" },
          wednesday: { active: true, start: "16:00", end: "22:00" },
          thursday: { active: true, start: "16:00", end: "22:00" },
          friday: { active: false, start: "16:00", end: "20:00" },
          saturday: { active: false, start: "18:00", end: "22:00" }
        };
        break;
      case 'weekend':
        newHours = {
          sunday: { active: false, start: "09:00", end: "17:00" },
          monday: { active: false, start: "09:00", end: "17:00" },
          tuesday: { active: false, start: "09:00", end: "17:00" },
          wednesday: { active: false, start: "09:00", end: "17:00" },
          thursday: { active: true, start: "09:00", end: "17:00" },
          friday: { active: true, start: "09:00", end: "17:00" },
          saturday: { active: true, start: "10:00", end: "16:00" }
        };
        break;
    }
    
    updateSignupData({ workingHours: newHours });
    setErrors({});
    
    toast({
      title: "שעות העבודה עודכנו",
      description: `${signupData.firstName}, הגדרת ${preset === 'standard' ? 'שעות רגילות' : preset === 'evening' ? 'שעות ערב' : 'סוף השבוע'} בהצלחה`,
    });
  };

  const getActiveDaysCount = () => {
    return Object.values(signupData.workingHours || {}).filter(day => day.active).length;
  };

  const hasAnyErrors = () => {
    return Object.keys(errors).length > 0;
  };

  const hasIncompleteActiveDays = () => {
    const activeDays = Object.entries(signupData.workingHours || {}).filter(([_, day]) => day.active);
    return activeDays.some(([_, day]) => !day.start || !day.end);
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <Card className="bg-gradient-to-l from-blue-50 to-indigo-50 border-blue-300">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
              <Clock className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-700 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 animate-pulse" />
            בואי נגדיר את שעות הפעילות שלך, {signupData.firstName}!
          </CardTitle>
          <p className="text-blue-600 mt-2">
            שעות הפעילות יעזרו ללקוחות לדעת מתי את זמינה ויאפשרו תיאום פגישות בזמנים הנכונים
          </p>
        </CardHeader>
      </Card>

      {/* Quick Setup Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-500" />
            הגדרה מהירה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              onClick={() => applyPreset('standard')}
              className="p-4 h-auto flex flex-col items-center gap-2 hover:border-blue-500"
            >
              <Sun className="h-6 w-6 text-yellow-500" />
              <div>
                <div className="font-semibold">שעות רגילות</div>
                <div className="text-xs text-muted-foreground">א'-ה' 9:00-17:00, ו' 9:00-15:00</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => applyPreset('evening')}
              className="p-4 h-auto flex flex-col items-center gap-2 hover:border-purple-500"
            >
              <Moon className="h-6 w-6 text-purple-500" />
              <div>
                <div className="font-semibold">שעות ערב</div>
                <div className="text-xs text-muted-foreground">א'-ה' 16:00-22:00</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => applyPreset('weekend')}
              className="p-4 h-auto flex flex-col items-center gap-2 hover:border-green-500"
            >
              <Calendar className="h-6 w-6 text-green-500" />
              <div>
                <div className="font-semibold">סוף השבוע</div>
                <div className="text-xs text-muted-foreground">ה'-ש' בלבד</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Days Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              הגדרת שעות לפי יום
            </div>
            <Badge variant={getActiveDaysCount() > 0 ? "default" : "secondary"}>
              {getActiveDaysCount()} ימים פעילים
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(daysInHebrew).map(([dayKey, dayInfo]) => {
              const dayData = signupData.workingHours?.[dayKey] || { active: false, start: "09:00", end: "17:00" };
              
              return (
                <Card key={dayKey} className={`transition-all duration-200 ${dayData.active ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{dayInfo.icon}</span>
                        <div>
                          <Label className="text-lg font-semibold">יום {dayInfo.name}</Label>
                          <p className="text-sm text-muted-foreground">
                            {dayData.active 
                              ? `פעיל: ${dayData.start || '--:--'} - ${dayData.end || '--:--'}`
                              : 'לא פעיל'
                            }
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={dayData.active}
                        onCheckedChange={(checked) => updateWorkingHours(dayKey, 'active', checked)}
                      />
                    </div>
                    
                    {dayData.active && (
                      <div className="grid grid-cols-2 gap-4 animate-fade-in">
                        <div className="space-y-2">
                          <Label htmlFor={`${dayKey}-start`} className="text-sm font-medium">
                            שעת פתיחה
                          </Label>
                          <Input
                            id={`${dayKey}-start`}
                            type="time"
                            value={dayData.start || ''}
                            onChange={(e) => updateWorkingHours(dayKey, 'start', e.target.value)}
                            className={errors[`${dayKey}_start`] ? 'border-red-500' : ''}
                          />
                          {errors[`${dayKey}_start`] && (
                            <p className="text-red-500 text-xs">{errors[`${dayKey}_start`]}</p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`${dayKey}-end`} className="text-sm font-medium">
                            שעת סגירה
                          </Label>
                          <Input
                            id={`${dayKey}-end`}
                            type="time"
                            value={dayData.end || ''}
                            onChange={(e) => updateWorkingHours(dayKey, 'end', e.target.value)}
                            className={errors[`${dayKey}_end`] ? 'border-red-500' : ''}
                          />
                          {errors[`${dayKey}_end`] && (
                            <p className="text-red-500 text-xs">{errors[`${dayKey}_end`]}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Status and Validation */}
      <Card className={`${hasAnyErrors() || hasIncompleteActiveDays() ? 'bg-yellow-50 border-yellow-300' : 'bg-green-50 border-green-300'}`}>
        <CardContent className="p-6">
          {hasAnyErrors() || hasIncompleteActiveDays() ? (
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  יש לתקן את השגיאות הבאות:
                </h3>
                <ul className="text-yellow-700 space-y-1">
                  {hasIncompleteActiveDays() && (
                    <li>• אנא השלימי שעות פתיחה וסגירה לכל הימים הפעילים</li>
                  )}
                  {hasAnyErrors() && (
                    <li>• יש שגיאות בשעות שהוגדרו - אנא בדקי שכל השעות תקינות</li>
                  )}
                  {getActiveDaysCount() === 0 && (
                    <li>• חובה להגדיר לפחות יום פעילות אחד</li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  מעולה! שעות הפעילות הוגדרו בהצלחה 🎉
                </h3>
                <p className="text-green-700">
                  {signupData.firstName}, הגדרת {getActiveDaysCount()} ימי פעילות.
                  <br />
                  הלקוחות שלך יוכלו לקבוע פגישות רק בזמנים שהגדרת כפעילים.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-blue-800 mb-3">💡 טיפים חשובים:</h3>
          <ul className="space-y-2 text-blue-700 text-sm">
            <li>• ניתן לשנות את שעות הפעילות בכל עת מהגדרות העסק</li>
            <li>• המערכת תאפשר לקוחות לקבוע פגישות רק בזמנים שהגדרת</li>
            <li>• מומלץ להגדיר זמן נוסף בין פגישות לנקיון וארגון</li>
            <li>• אפשר להגדיר זמני פעילות שונים לימים שונים לפי הצורך</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkingHoursStep;
