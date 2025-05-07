
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Download, Trash2, Clock, Database } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SecurityTab = () => {
  const [isBackupEnabled, setIsBackupEnabled] = useState<boolean>(true);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");
  
  const handleToggleBackup = async (enabled: boolean) => {
    setIsBackupEnabled(enabled);
    
    if (enabled) {
      toast.success("גיבוי אוטומטי יומי הופעל בהצלחה");
    } else {
      toast.warning("גיבוי אוטומטי יומי בוטל");
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("הנתונים יוצאו בהצלחה");
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("שגיאה בייצוא הנתונים");
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAllData = async () => {
    try {
      // Simulate delete process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("הנתונים נמחקו בהתאם לדרישות GDPR");
      setIsDeleteDialogOpen(false);
      setDeleteConfirmText("");
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("שגיאה במחיקת הנתונים");
    }
  };

  return (
    <div className="space-y-6">
      <Alert variant="destructive">
        <Shield className="h-4 w-4" />
        <AlertTitle>הגדרות אבטחה ופרטיות</AlertTitle>
        <AlertDescription>
          שינויים בהגדרות אלו עשויים להשפיע על אבטחת המידע והפרטיות של הלקוחות שלך.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Database className="h-5 w-5 ml-2" />
            <span>גיבויים ושחזור</span>
          </CardTitle>
          <CardDescription>
            הגדר מדיניות גיבוי אוטומטי לנתונים שלך
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>גיבוי אוטומטי יומי</Label>
              <p className="text-sm text-muted-foreground">גיבוי מלא של כל הנתונים שלך מדי יום</p>
            </div>
            <Switch
              checked={isBackupEnabled}
              onCheckedChange={handleToggleBackup}
            />
          </div>
          
          <div className="border-t pt-4 mt-4">
            <p className="text-sm text-muted-foreground mb-2">גיבויים אחרונים:</p>
            <div className="space-y-2">
              {isBackupEnabled ? (
                <>
                  <div className="flex justify-between items-center text-sm py-1 border-b">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 ml-2 text-gray-500" />
                      <span>יום שלישי, 06/05/2025 05:00</span>
                    </div>
                    <Button size="sm" variant="outline">שחזר</Button>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1 border-b">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 ml-2 text-gray-500" />
                      <span>יום שני, 05/05/2025 05:00</span>
                    </div>
                    <Button size="sm" variant="outline">שחזר</Button>
                  </div>
                  <div className="flex justify-between items-center text-sm py-1 border-b">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 ml-2 text-gray-500" />
                      <span>יום ראשון, 04/05/2025 05:00</span>
                    </div>
                    <Button size="sm" variant="outline">שחזר</Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  גיבוי אוטומטי אינו מופעל
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <Button onClick={() => toast.success("גיבוי מיידי הושלם בהצלחה")}>
              גיבוי מיידי
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 space-x-reverse">
            <Shield className="h-5 w-5 ml-2" />
            <span>GDPR והתאמה לתקנות</span>
          </CardTitle>
          <CardDescription>
            ניהול זכויות מידע והתאמת היישום לתקנות GDPR
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h4 className="font-medium mb-1">ייצוא כל המידע</h4>
              <p className="text-sm text-muted-foreground mb-4">
                הורד את כל המידע השמור במערכת בפורמט מובנה
              </p>
              
              <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <Download className="ml-2 h-4 w-4" />
                    ייצוא כל המידע
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>ייצוא כל המידע</DialogTitle>
                    <DialogDescription>
                      כל המידע ירד כקובץ ZIP המכיל את הנתונים בפורמט JSON או CSV.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="mb-4">המידע שיוצא כולל:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      <li>פרטי לקוחות</li>
                      <li>היסטוריית תורים</li>
                      <li>היסטוריית תשלומים</li>
                      <li>הגדרות העסק</li>
                    </ul>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
                      ביטול
                    </Button>
                    <Button onClick={handleExportData} disabled={isExporting}>
                      {isExporting ? "מייצא..." : "ייצא מידע"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="border-b pb-4">
              <h4 className="font-medium mb-1 text-destructive">מחיקת כל המידע</h4>
              <p className="text-sm text-muted-foreground mb-4">
                מחק את כל המידע השמור במערכת באופן בלתי הפיך
              </p>
              
              <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="ml-2 h-4 w-4" />
                    מחק את כל המידע
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="text-destructive">מחיקת כל המידע</DialogTitle>
                    <DialogDescription>
                      זוהי פעולה בלתי הפיכה. כל המידע יימחק לצמיתות.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Alert variant="destructive" className="mb-4">
                      <AlertTitle>אזהרה</AlertTitle>
                      <AlertDescription>
                        מחיקה זו היא סופית ובלתי הפיכה. כל הנתונים שלך יאבדו לנצח.
                      </AlertDescription>
                    </Alert>
                    
                    <p className="mb-4">הקלד "מחק את כל המידע" כדי לאשר:</p>
                    <input 
                      type="text" 
                      className="w-full border-2 border-red-300 rounded-md p-2"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                      ביטול
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={handleDeleteAllData}
                      disabled={deleteConfirmText !== "מחק את כל המידע"}
                    >
                      מחק הכל לצמיתות
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div>
              <h4 className="font-medium mb-1">הגדרות פרטיות</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="privacy-updates">קבל עדכונים על שינויים בפרטיות</Label>
                  <Switch id="privacy-updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="consent-tracking">מעקב אוטומטי אחר הסכמות לקוחות</Label>
                  <Switch id="consent-tracking" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-delete">מחיקת מידע אוטומטית לאחר 3 שנים ללא פעילות</Label>
                  <Switch id="auto-delete" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityTab;
