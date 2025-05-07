
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useGoogleCalendar } from "@/hooks/useGoogleCalendar";
import { CreditCard, FileText, Database, Calendar, Sparkles } from "lucide-react";

interface IntegrationsTabProps {
  businessOwner: any;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  icon: React.ReactNode;
}

const IntegrationsTab = ({ businessOwner }: IntegrationsTabProps) => {
  const { isConnected: isGCalConnected, connectGoogleCalendar } = useGoogleCalendar();
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "tranzila",
      name: "Tranzila",
      description: "עיבוד תשלומים ועסקאות אשראי",
      connected: false,
      icon: <CreditCard className="h-8 w-8 text-orange-500" />
    },
    {
      id: "green_invoice",
      name: "Green Invoice",
      description: "הפקה אוטומטית של חשבוניות וקבלות",
      connected: false,
      icon: <FileText className="h-8 w-8 text-green-500" />
    },
    {
      id: "supabase",
      name: "Supabase",
      description: "בסיס נתונים ואחסון קבצים",
      connected: true,
      icon: <Database className="h-8 w-8 text-blue-500" />
    },
    {
      id: "google_calendar",
      name: "Google Calendar",
      description: "סנכרון דו-כיווני של תורים",
      connected: isGCalConnected || businessOwner?.google_calendar_connected || false,
      icon: <Calendar className="h-8 w-8 text-red-500" />
    },
    {
      id: "make",
      name: "Make.com",
      description: "אוטומציה וזרימת עבודה",
      connected: false,
      icon: <Sparkles className="h-8 w-8 text-purple-500" />
    }
  ]);

  const handleConnect = async (integrationId: string) => {
    // Find the integration
    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) return;

    if (integration.connected) {
      // Disconnect logic
      try {
        if (integrationId === "google_calendar") {
          // Update the database
          await supabase
            .from("business_owners")
            .update({ google_calendar_connected: false })
            .eq("id", businessOwner.id);
        }
        
        // Update UI
        setIntegrations(prevIntegrations => 
          prevIntegrations.map(i => 
            i.id === integrationId ? { ...i, connected: false } : i
          )
        );
        
        toast.success(`${integration.name} נותק בהצלחה`);
      } catch (error) {
        console.error(`Error disconnecting ${integration.name}:`, error);
        toast.error(`שגיאה בניתוק ${integration.name}`);
      }
    } else {
      // Connect logic
      try {
        if (integrationId === "google_calendar") {
          await connectGoogleCalendar();
          
          // Update the database
          await supabase
            .from("business_owners")
            .update({ google_calendar_connected: true })
            .eq("id", businessOwner.id);
        } else {
          // Mocked connect behavior for other services
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Update UI
        setIntegrations(prevIntegrations => 
          prevIntegrations.map(i => 
            i.id === integrationId ? { ...i, connected: true } : i
          )
        );
        
        toast.success(`${integration.name} חובר בהצלחה`);
      } catch (error) {
        console.error(`Error connecting to ${integration.name}:`, error);
        toast.error(`שגיאה בחיבור ל-${integration.name}`);
      }
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTitle>אינטגרציות חיצוניות</AlertTitle>
        <AlertDescription>
          חבר את העסק שלך לשירותים חיצוניים כדי להרחיב את היכולות והאוטומציה
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        {integrations.map((integration) => (
          <Card key={integration.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    {integration.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                {integration.connected && (
                  <Badge className="bg-green-100 text-green-800 border-green-300">מחובר</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              {integration.id === "supabase" ? (
                <div className="text-sm text-gray-500">
                  בסיס הנתונים מחובר ומאובטח עם הגדרות אבטחה מתקדמות.
                </div>
              ) : integration.id === "google_calendar" && integration.connected ? (
                <div className="text-sm text-gray-500">
                  יומן Google מסונכרן באופן דו-כיווני עם התורים שלך.
                </div>
              ) : null}
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                variant={integration.connected ? "outline" : "default"}
                onClick={() => handleConnect(integration.id)}
                disabled={integration.id === "supabase"} // Cannot disconnect Supabase
              >
                {integration.connected ? "נתק" : "חבר"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationsTab;
