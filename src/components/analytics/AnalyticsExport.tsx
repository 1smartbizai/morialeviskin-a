
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, FileText, FileDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface AnalyticsExportProps {
  dateRange: [Date | undefined, Date | undefined];
  treatmentType: string | null;
  clientSegment: string | null;
  incomeRange: [number | null, number | null];
}

export const AnalyticsExport = ({
  dateRange,
  treatmentType,
  clientSegment,
  incomeRange
}: AnalyticsExportProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "excel" | null>(null);
  const [includeMonthlySummary, setIncludeMonthlySummary] = useState(false);

  const handleExport = async (type: "pdf" | "excel") => {
    setExportType(type);
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(
        type === "pdf" 
          ? "הדוח PDF הורד בהצלחה" 
          : "הדוח אקסל הורד בהצלחה"
      );
      
      // In a real application, we would trigger a download here
    } catch (error) {
      toast.error("שגיאה בייצוא הדוח");
      console.error(error);
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">ייצוא דוחות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col space-y-2 flex-1">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="monthly-summary"
                checked={includeMonthlySummary}
                onChange={(e) => setIncludeMonthlySummary(e.target.checked)}
                className="ml-2 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="monthly-summary" className="text-sm">
                כלול סיכום חודשי
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              ייצא את הנתונים המסוננים כדוח מפורט עם גרפים ומטריקות
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="space-x-2 space-x-reverse" 
                  disabled={isExporting}
                >
                  <FileText className="h-4 w-4" />
                  <span>ייצא PDF</span>
                  {isExporting && exportType === "pdf" && (
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-primary animate-spin" />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ייצוא PDF</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p>האם אתה בטוח שאתה רוצה לייצא את הנתונים המסוננים כקובץ PDF?</p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>הדוח יכלול:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center">
                        <CheckIcon className="ml-1 w-4 h-4 text-green-500" />
                        <span>מטריקות עיקריות</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="ml-1 w-4 h-4 text-green-500" />
                        <span>גרפים וניתוחים</span>
                      </li>
                      {includeMonthlySummary && (
                        <li className="flex items-center">
                          <CheckIcon className="ml-1 w-4 h-4 text-green-500" />
                          <span>סיכום חודשי</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">ביטול</Button>
                  <Button onClick={() => handleExport("pdf")}>ייצא PDF</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="space-x-2 space-x-reverse" 
                  disabled={isExporting}
                >
                  <FileDown className="h-4 w-4" />
                  <span>ייצא Excel</span>
                  {isExporting && exportType === "excel" && (
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-primary animate-spin" />
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ייצוא Excel</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <p>האם אתה בטוח שאתה רוצה לייצא את הנתונים המסוננים כקובץ Excel?</p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>הדוח יכלול:</p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center">
                        <CheckIcon className="ml-1 w-4 h-4 text-green-500" />
                        <span>נתונים גולמיים</span>
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="ml-1 w-4 h-4 text-green-500" />
                        <span>טבלאות מסכמות</span>
                      </li>
                      {includeMonthlySummary && (
                        <li className="flex items-center">
                          <CheckIcon className="ml-1 w-4 h-4 text-green-500" />
                          <span>סיכום חודשי</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">ביטול</Button>
                  <Button onClick={() => handleExport("excel")}>ייצא Excel</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
