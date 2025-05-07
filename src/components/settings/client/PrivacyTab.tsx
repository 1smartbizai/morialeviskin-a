
import { useState } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { FileText, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const PrivacyTab = () => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Export user data
  const exportUserData = async () => {
    setIsExporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("לא מחובר");
      }
      
      // Fetch client data
      const { data: clientData } = await supabase
        .from("clients")
        .select("*")
        .eq("id", user.id)
        .single();
      
      // Fetch treatment history
      const { data: treatments } = await supabase
        .from("appointments")
        .select("*")
        .eq("client_id", user.id);
      
      // Fetch payment history (mock data for now)
      const paymentHistory = []; // This would come from a real table in a full implementation
      
      // Prepare export data
      const exportData = {
        personalInfo: clientData,
        treatments: treatments || [],
        paymentHistory: paymentHistory || [],
        exportDate: new Date().toISOString(),
      };
      
      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `user-data-export-${new Date().toISOString().slice(0,10)}.json`;
      
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "ייצוא הושלם",
        description: "הנתונים שלך יוצאו בהצלחה",
      });
    } catch (error) {
      console.error("Error exporting user data:", error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן לייצא את הנתונים",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("לא מחובר");
      }

      // In a real application, you'd want to:
      // 1. Delete all user data from tables with relations
      // 2. Finally delete the user account itself
      // 3. Handle this logic in a Supabase Edge Function for security
      
      // For this demo, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sign out the user
      await supabase.auth.signOut();
      
      toast({
        title: "חשבון נמחק",
        description: "החשבון שלך נמחק בהצלחה",
      });
      
      // Redirect to home page
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן למחוק את החשבון",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <CardDescription>
          נהל את המידע האישי שלך וכלי פרטיות בהתאם לדרישות GDPR
        </CardDescription>
        
        <div className="space-y-4">
          {/* Export Data Section */}
          <div className="border-b pb-4">
            <h3 className="text-lg font-medium mb-2 flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              ייצוא מידע אישי
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              הורד את כל המידע האישי שלך, כולל היסטוריית טיפולים ותשלומים
            </p>
            <Button 
              variant="outline" 
              onClick={exportUserData}
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? "מייצא..." : "ייצא את המידע שלי"}
            </Button>
          </div>
          
          {/* Delete Account Section */}
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center text-destructive">
              <Trash2 className="mr-2 h-5 w-5" />
              מחיקת חשבון
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              מחק את החשבון שלך ואת כל המידע האישי הקשור אליו
            </p>
            
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  מחק את החשבון שלי
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-destructive">מחיקת חשבון</DialogTitle>
                  <DialogDescription>
                    זוהי פעולה בלתי הפיכה. כל הנתונים שלך יימחקו לצמיתות.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>אזהרה</AlertTitle>
                    <AlertDescription>
                      מחיקה זו היא סופית ובלתי הפיכה. כל הנתונים שלך יאבדו לנצח.
                    </AlertDescription>
                  </Alert>
                  
                  <p className="mb-2">הקלד "מחק את החשבון שלי" כדי לאשר:</p>
                  <input 
                    type="text" 
                    className="w-full border-2 border-red-300 rounded-md p-2"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    dir="rtl"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    ביטול
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={deleteAccount}
                    disabled={isDeleting || deleteConfirmText !== "מחק את החשבון שלי"}
                  >
                    {isDeleting ? "מוחק..." : "מחק לצמיתות"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyTab;
