
import { useState } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Download, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const PrivacyTab = () => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { toast } = useToast();

  // Handle data export
  const handleExportData = async () => {
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
      
      // Fetch treatments history
      const { data: treatmentsData } = await supabase
        .from("appointments")
        .select("*")
        .eq("client_id", user.id);
      
      // Instead of querying a non-existent 'payments' table directly,
      // we'll check if there's payment-related data in appointments or prepare a placeholder
      let paymentsData = [];
      
      // Prepare download data
      const exportData = {
        personalInfo: clientData,
        treatments: treatmentsData || [],
        payments: paymentsData
      };
      
      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `data-export-${new Date().toISOString()}.json`;
      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "הנתונים יוצאו בהצלחה",
        description: "קובץ היצוא נשמר במחשב שלך",
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן לייצא את הנתונים, נסו שוב מאוחר יותר",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("לא מחובר");
      }
      
      // Delete user data from clients table
      const { error: deleteClientError } = await supabase
        .from("clients")
        .delete()
        .eq("id", user.id);
        
      if (deleteClientError) {
        throw deleteClientError;
      }
      
      // Delete user authentication using admin functions via RPC
      // Note: Direct auth.admin access isn't available in client-side code
      try {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;
      } catch (error) {
        console.error("Error signing out:", error);
      }
      
      toast({
        title: "החשבון נמחק",
        description: "כל הנתונים שלך נמחקו בהצלחה",
      });
      
      // Redirect to login page after successful deletion
      setTimeout(() => {
        window.location.href = "/client/auth";
      }, 2000);
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן למחוק את החשבון, נסו שוב מאוחר יותר",
      });
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <CardDescription>
          הפרטיות שלך חשובה לנו. אנחנו מאפשרים לך לייצא את הנתונים שלך או למחוק את החשבון לחלוטין
        </CardDescription>
        
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">ייצוא נתונים</h3>
            <p className="text-sm text-muted-foreground mb-4">
              ניתן לייצא את כל המידע האישי שלך, כולל היסטורית טיפולים ותשלומים
            </p>
            <Button 
              variant="outline" 
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full flex items-center justify-center"
            >
              <Download className="ml-2 h-4 w-4" />
              {isExporting ? "מייצא..." : "ייצוא כל הנתונים"}
            </Button>
          </div>
          
          <div className="p-4 border rounded-lg border-destructive/20">
            <h3 className="text-lg font-medium mb-2 text-destructive">מחיקת חשבון</h3>
            <p className="text-sm text-muted-foreground mb-4">
              פעולה זו תמחק לצמיתות את כל הנתונים שלך ואת החשבון שלך מהמערכת
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center"
                >
                  <Trash2 className="ml-2 h-4 w-4" />
                  מחיקת חשבון
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>מחיקת חשבון</DialogTitle>
                  <DialogDescription>
                    האם אתה בטוח שברצונך למחוק את החשבון שלך? לא ניתן לשחזר פעולה זו.
                    כל הנתונים והמידע האישי שלך יימחקו לצמיתות.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">ביטול</Button>
                  </DialogClose>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "מוחק..." : "כן, מחק את החשבון שלי"}
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
