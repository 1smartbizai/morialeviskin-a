
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/components/layouts/AdminLayout";
import LoyaltyRules from "@/components/loyalty/LoyaltyRules";
import LoyaltyRewards from "@/components/loyalty/LoyaltyRewards";
import LoyaltyClients from "@/components/loyalty/LoyaltyClients";
import LoyaltySettings from "@/components/loyalty/LoyaltySettings";
import { Sparkles, Award, Users, Settings } from "lucide-react";

const AdminLoyalty = () => {
  const [activeTab, setActiveTab] = useState("rules");

  return (
    <AdminLayout>
      <div className="space-y-6" dir="rtl">
        <div>
          <h1 className="text-3xl font-bold text-beauty-dark">ניהול נקודות ותגמול</h1>
          <p className="text-muted-foreground">הגדר את מערכת הנקודות והתגמולים עבור הלקוחות שלך</p>
        </div>

        <Tabs defaultValue="rules" className="w-full" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-4 w-full md:w-fit">
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span className="hidden md:inline">הגדרת חוקים</span>
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="hidden md:inline">הטבות</span>
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">לקוחות</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">הגדרות</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules">
            <LoyaltyRules />
          </TabsContent>

          <TabsContent value="rewards">
            <LoyaltyRewards />
          </TabsContent>

          <TabsContent value="clients">
            <LoyaltyClients />
          </TabsContent>

          <TabsContent value="settings">
            <LoyaltySettings />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminLoyalty;
