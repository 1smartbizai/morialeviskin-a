
import { useState } from "react";
import ClientLayout from "@/components/layouts/ClientLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalDetailsTab from "@/components/settings/client/PersonalDetailsTab";
import CommunicationsTab from "@/components/settings/client/CommunicationsTab";
import PrivacyTab from "@/components/settings/client/PrivacyTab";
import { UserCog } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<string>("personal");

  return (
    <ClientLayout>
      <div className="space-y-4">
        <div className="flex items-center space-x-reverse space-x-2">
          <UserCog className="h-5 w-5 text-beauty-primary" />
          <h1 className="text-2xl font-medium">הגדרות</h1>
        </div>
        
        <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="personal">פרטים אישיים</TabsTrigger>
            <TabsTrigger value="communications">תקשורת</TabsTrigger>
            <TabsTrigger value="privacy">פרטיות</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="mt-4">
            <PersonalDetailsTab />
          </TabsContent>
          
          <TabsContent value="communications" className="mt-4">
            <CommunicationsTab />
          </TabsContent>
          
          <TabsContent value="privacy" className="mt-4">
            <PrivacyTab />
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default Settings;
