
import React, { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { MessageComposer } from '@/components/messaging/MessageComposer';
import { AutomationBuilder } from '@/components/messaging/AutomationBuilder';
import { MessageLog } from '@/components/messaging/MessageLog';
import { AutomationsList } from '@/components/messaging/AutomationsList';
import { ClientSelector } from '@/components/messaging/ClientSelector';
import { useMessaging } from '@/hooks/useMessaging';
import { Automation } from '@/types/messaging';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, MessageSquare, Clock } from 'lucide-react';

const MessagesAndAutomations: React.FC = () => {
  const {
    messages,
    templates,
    automations,
    messagesLoading,
    templatesLoading,
    automationsLoading,
    selectedClients,
    setSelectedClients,
    sendMessage,
    saveAutomation,
    resendMessage
  } = useMessaging();
  
  const [activeTab, setActiveTab] = useState('messages');
  const [editingAutomation, setEditingAutomation] = useState<Automation | undefined>(undefined);
  const [showAutomationBuilder, setShowAutomationBuilder] = useState(false);
  
  const handleSendMessage = (content: string, channel: 'whatsapp' | 'sms' | 'in-app') => {
    sendMessage.mutate({
      content,
      clientIds: selectedClients,
      channel
    });
  };
  
  const handleSaveAutomation = (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => {
    saveAutomation.mutate(automation, {
      onSuccess: () => {
        setEditingAutomation(undefined);
        setShowAutomationBuilder(false);
      }
    });
  };
  
  const handleEditAutomation = (automationId: string) => {
    const automation = automations?.find(a => a.id === automationId);
    if (automation) {
      setEditingAutomation(automation);
      setShowAutomationBuilder(true);
      setActiveTab('automations');
    }
  };
  
  const handleDeleteAutomation = (automationId: string) => {
    // In a real app, this would delete the automation
    console.log('Deleting automation:', automationId);
  };
  
  const handleToggleAutomationActive = (automationId: string, isActive: boolean) => {
    // In a real app, this would update the automation's active status
    console.log('Toggling automation active status:', automationId, isActive);
  };
  
  const handleNewAutomation = () => {
    setEditingAutomation(undefined);
    setShowAutomationBuilder(true);
  };
  
  return (
    <AdminLayout>
      <div className="py-6 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-1">הודעות ואוטומציה</h1>
            <p className="text-muted-foreground">
              שלח הודעות ללקוחות שלך וצור אוטומציה חכמה לתקשורת
            </p>
          </div>
        </div>
        
        <Tabs 
          defaultValue="messages" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
          dir="rtl"
        >
          <div className="flex justify-between items-center">
            <TabsList className="grid grid-cols-2 w-[400px]">
              <TabsTrigger value="messages" className="flex gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>הודעות</span>
              </TabsTrigger>
              <TabsTrigger value="automations" className="flex gap-2">
                <Clock className="h-4 w-4" />
                <span>אוטומציה</span>
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'automations' && (
              <Button 
                onClick={handleNewAutomation}
                variant={showAutomationBuilder ? "outline" : "default"}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                {showAutomationBuilder ? 'סגור טופס חדש' : 'צור אוטומציה'}
              </Button>
            )}
          </div>
          
          <TabsContent value="messages" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <ClientSelector
                selectedClients={selectedClients}
                onClientSelectionChange={setSelectedClients}
              />
              
              <MessageComposer
                templates={templates || []}
                onSendMessage={handleSendMessage}
                selectedClients={selectedClients}
                isLoading={templatesLoading || sendMessage.isPending}
              />
            </div>
            
            <MessageLog
              messages={messages || []}
              onResend={resendMessage}
              isLoading={messagesLoading}
            />
          </TabsContent>
          
          <TabsContent value="automations" className="space-y-6">
            {showAutomationBuilder && (
              <AutomationBuilder
                templates={templates || []}
                onSave={handleSaveAutomation}
                initialAutomation={editingAutomation}
                isLoading={templatesLoading || saveAutomation.isPending}
              />
            )}
            
            <AutomationsList
              automations={automations || []}
              onEdit={handleEditAutomation}
              onDelete={handleDeleteAutomation}
              onToggleActive={handleToggleAutomationActive}
              isLoading={automationsLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default MessagesAndAutomations;
