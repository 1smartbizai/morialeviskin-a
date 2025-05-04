
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminLayout from '@/components/layouts/AdminLayout';
import TreatmentsTab from '@/components/management/TreatmentsTab';
import ProductsTab from '@/components/management/ProductsTab';
import TreatmentPlansTab from '@/components/management/TreatmentPlansTab';
import { useToast } from '@/hooks/use-toast';

const BusinessManagement = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('treatments');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">ניהול עסק</h1>
        
        <Tabs defaultValue="treatments" value={activeTab} onValueChange={handleTabChange} dir="rtl">
          <div className="flex justify-center mb-6">
            <TabsList className="grid grid-cols-3 w-full md:w-2/3 lg:w-1/2">
              <TabsTrigger value="treatments">טיפולים</TabsTrigger>
              <TabsTrigger value="products">מוצרים</TabsTrigger>
              <TabsTrigger value="treatment-plans">מסלולי טיפול</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="treatments" className="mt-6">
            <TreatmentsTab />
          </TabsContent>
          
          <TabsContent value="products" className="mt-6">
            <ProductsTab />
          </TabsContent>
          
          <TabsContent value="treatment-plans" className="mt-6">
            <TreatmentPlansTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default BusinessManagement;
