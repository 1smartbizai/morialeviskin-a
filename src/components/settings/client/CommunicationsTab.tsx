
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bell, BellOff } from "lucide-react";

interface CommunicationPreferences {
  receive_tips: boolean;
  receive_reminders: boolean;
  receive_promotions: boolean;
}

const CommunicationsTab = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CommunicationPreferences>({
    receive_tips: true,
    receive_reminders: true,
    receive_promotions: true,
  });
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const { toast } = useToast();

  // Fetch communication preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          return;
        }
        
        const { data: clientData } = await supabase
          .from("clients")
          .select("communication_preferences")
          .eq("id", user.id)
          .single();
          
        if (clientData && clientData.communication_preferences) {
          // Type casting to handle the JSON response
          const prefs = clientData.communication_preferences as unknown as CommunicationPreferences;
          setPreferences(prefs);
        }
      } catch (error) {
        console.error("Error fetching communication preferences:", error);
      }
    };
    
    fetchPreferences();
  }, []);

  // Toggle preference
  const togglePreference = (key: keyof CommunicationPreferences) => {
    setPreferences(prev => {
      const newPreferences = {
        ...prev,
        [key]: !prev[key]
      };
      setHasChanges(true);
      return newPreferences;
    });
  };

  // Save preferences
  const savePreferences = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("לא מחובר");
      }
      
      const { error } = await supabase
        .from("clients")
        .update({
          communication_preferences: preferences as any,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
        
      if (error) {
        throw error;
      }
      
      setHasChanges(false);
      toast({
        title: "העדפות עודכנו",
        description: "העדפות התקשורת שלך עודכנו בהצלחה",
      });
    } catch (error) {
      console.error("Error updating communication preferences:", error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן לעדכן את העדפות התקשורת",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <CardDescription>
          עדכן את העדפות התקשורת שלך כדי לקבוע אילו התראות ועדכונים ישלחו אליך
        </CardDescription>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                {preferences.receive_tips ? (
                  <Bell className="mr-2 h-4 w-4 text-beauty-primary" />
                ) : (
                  <BellOff className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                <Label htmlFor="receive_tips">טיפים וטריקים</Label>
              </div>
              <p className="text-sm text-muted-foreground">קבלת טיפים שבועיים לטיפוח העור</p>
            </div>
            <Switch
              id="receive_tips"
              checked={preferences.receive_tips}
              onCheckedChange={() => togglePreference('receive_tips')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                {preferences.receive_reminders ? (
                  <Bell className="mr-2 h-4 w-4 text-beauty-primary" />
                ) : (
                  <BellOff className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                <Label htmlFor="receive_reminders">תזכורות</Label>
              </div>
              <p className="text-sm text-muted-foreground">תזכורות לפני תורים והמלצות לטיפולים</p>
            </div>
            <Switch
              id="receive_reminders"
              checked={preferences.receive_reminders}
              onCheckedChange={() => togglePreference('receive_reminders')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center">
                {preferences.receive_promotions ? (
                  <Bell className="mr-2 h-4 w-4 text-beauty-primary" />
                ) : (
                  <BellOff className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                <Label htmlFor="receive_promotions">הטבות ומבצעים</Label>
              </div>
              <p className="text-sm text-muted-foreground">עדכונים על מבצעים והטבות מיוחדות</p>
            </div>
            <Switch
              id="receive_promotions"
              checked={preferences.receive_promotions}
              onCheckedChange={() => togglePreference('receive_promotions')}
            />
          </div>
        </div>
        
        <Button
          onClick={savePreferences}
          className="w-full"
          disabled={isLoading || !hasChanges}
        >
          {isLoading ? "מעדכן..." : "שמור העדפות"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CommunicationsTab;
