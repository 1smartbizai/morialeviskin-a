
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmotionalLogTab } from "./EmotionalLogTab";
import { RiskAssessmentTab } from "./RiskAssessmentTab";

interface ClientInsightsModuleProps {
  clientId?: string;
  defaultTab?: 'emotional' | 'risk';
}

export const ClientInsightsModule: React.FC<ClientInsightsModuleProps> = ({ 
  clientId,
  defaultTab = 'emotional'
}) => {
  return (
    <div className="w-full" style={{ direction: 'rtl' }}>
      <Tabs defaultValue={defaultTab} className="w-full" dir="rtl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold">תובנות לקוח</div>
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="emotional">יומן רגשי</TabsTrigger>
            <TabsTrigger value="risk">לקוחות בסיכון</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="emotional">
          <EmotionalLogTab clientId={clientId} />
        </TabsContent>
        
        <TabsContent value="risk">
          <RiskAssessmentTab clientId={clientId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
