
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/layouts/AdminLayout";
import BusinessInfoTab from "@/components/settings/BusinessInfoTab";
import WorkingHoursTab from "@/components/settings/WorkingHoursTab";
import BrandingTab from "@/components/settings/BrandingTab";
import TeamPermissionsTab from "@/components/settings/TeamPermissionsTab";
import IntegrationsTab from "@/components/settings/IntegrationsTab";
import SecurityTab from "@/components/settings/SecurityTab";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const BusinessSettings = () => {
  const [activeTab, setActiveTab] = useState("business-info");
  const { toast } = useToast();

  // Fetch business owner data
  const { data: businessOwner, isLoading } = useQuery({
    queryKey: ["businessOwner"],
    queryFn: async () => {
      const { data: businessOwner, error } = await supabase
        .from("business_owners")
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message);
      }
      
      return businessOwner;
    }
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6 space-y-6 rtl">
        <div>
          <h1 className="text-2xl font-bold">הגדרות העסק</h1>
          <p className="text-muted-foreground">נהל את הגדרות העסק, המותג והצוות שלך</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <Tabs
            defaultValue="business-info"
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="mb-6 flex flex-nowrap overflow-x-auto space-x-1 space-x-reverse rtl:space-x-reverse w-full h-auto p-1 sm:justify-center">
              <TabsTrigger value="business-info" className="px-3 py-2 whitespace-nowrap">
                פרטי העסק
              </TabsTrigger>
              <TabsTrigger value="working-hours" className="px-3 py-2 whitespace-nowrap">
                שעות פעילות וחופשות
              </TabsTrigger>
              <TabsTrigger value="branding" className="px-3 py-2 whitespace-nowrap">
                מיתוג
              </TabsTrigger>
              <TabsTrigger value="team" className="px-3 py-2 whitespace-nowrap">
                הרשאות צוות
              </TabsTrigger>
              <TabsTrigger value="integrations" className="px-3 py-2 whitespace-nowrap">
                אינטגרציות
              </TabsTrigger>
              <TabsTrigger value="security" className="px-3 py-2 whitespace-nowrap">
                אבטחה
              </TabsTrigger>
            </TabsList>

            <TabsContent value="business-info">
              <BusinessInfoTab businessOwner={businessOwner} />
            </TabsContent>

            <TabsContent value="working-hours">
              <WorkingHoursTab businessOwner={businessOwner} />
            </TabsContent>

            <TabsContent value="branding">
              <BrandingTab businessOwner={businessOwner} />
            </TabsContent>

            <TabsContent value="team">
              <TeamPermissionsTab />
            </TabsContent>

            <TabsContent value="integrations">
              <IntegrationsTab businessOwner={businessOwner} />
            </TabsContent>

            <TabsContent value="security">
              <SecurityTab />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
};

export default BusinessSettings;
