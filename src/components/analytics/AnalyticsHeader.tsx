
import { CalendarIcon } from "lucide-react";

export const AnalyticsHeader = () => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-beauty-dark">דוחות וניתוח נתונים</h1>
          <p className="text-muted-foreground mt-1">נהל ונתח את הביצועים העסקיים שלך</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="h-4 w-4" />
          <span>מעודכן לעכשיו</span>
        </div>
      </div>
    </div>
  );
};
