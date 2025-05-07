
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Automation, MessageTemplate } from '@/types/messaging';
import { MessageSquare, Smartphone, Clock } from 'lucide-react';

interface AutomationBuilderProps {
  templates: MessageTemplate[];
  onSave: (automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  initialAutomation?: Automation;
  isLoading: boolean;
}

export const AutomationBuilder: React.FC<AutomationBuilderProps> = ({
  templates,
  onSave,
  initialAutomation,
  isLoading
}) => {
  const [name, setName] = useState(initialAutomation?.name || '');
  const [triggerType, setTriggerType] = useState<'no_visit' | 'birthday' | 'appointment_reminder' | 'custom'>(
    initialAutomation?.trigger.type as 'no_visit' | 'birthday' | 'appointment_reminder' | 'custom' || 'no_visit'
  );
  const [triggerDays, setTriggerDays] = useState(initialAutomation?.trigger.days?.toString() || '30');
  const [messageTemplate, setMessageTemplate] = useState(initialAutomation?.action.messageTemplate || '');
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'in-app'>(initialAutomation?.action.channel || 'whatsapp');
  const [isActive, setIsActive] = useState(initialAutomation?.isActive ?? true);
  const [webhookUrl, setWebhookUrl] = useState(initialAutomation?.makeWebhookUrl || '');

  const handleSave = () => {
    const automation: Omit<Automation, 'id' | 'createdAt' | 'updatedAt'> & { id?: string } = {
      id: initialAutomation?.id,
      name,
      trigger: {
        type: triggerType,
        days: parseInt(triggerDays, 10)
      },
      action: {
        type: 'send_message',
        messageTemplate,
        channel
      },
      isActive,
      makeWebhookUrl: webhookUrl || undefined,
      lastTriggeredAt: initialAutomation?.lastTriggeredAt
    };
    
    onSave(automation);
  };

  const channelIcons = {
    whatsapp: <MessageSquare className="h-4 w-4 text-green-600" />,
    sms: <Smartphone className="h-4 w-4" />,
    'in-app': <MessageSquare className="h-4 w-4" />
  };

  const getChannelLabel = (ch: 'whatsapp' | 'sms' | 'in-app') => {
    const labels = {
      whatsapp: 'וואטסאפ',
      sms: 'SMS',
      'in-app': 'בתוך האפליקציה'
    };
    return labels[ch];
  };

  const getTriggerTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      no_visit: 'אין ביקור במשך X ימים',
      birthday: 'יום הולדת',
      appointment_reminder: 'תזכורת לפגישה',
      custom: 'מותאם אישית'
    };
    return labels[type] || type;
  };
  
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">בניית אוטומציה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">שם האוטומציה</label>
          <Input
            placeholder="הזן שם לאוטומציה..."
            className="text-right"
            dir="rtl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium block">תנאי הפעלה</label>
          
          <Select
            value={triggerType}
            onValueChange={(value: 'no_visit' | 'birthday' | 'appointment_reminder' | 'custom') => setTriggerType(value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>{getTriggerTypeLabel(triggerType)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no_visit">אין ביקור במשך X ימים</SelectItem>
              <SelectItem value="birthday">יום הולדת</SelectItem>
              <SelectItem value="appointment_reminder">תזכורת לפגישה</SelectItem>
              <SelectItem value="custom">מותאם אישית</SelectItem>
            </SelectContent>
          </Select>
          
          {triggerType === 'no_visit' && (
            <div className="flex items-center gap-2">
              <span className="text-sm">לאחר</span>
              <Input 
                type="number" 
                className="w-20 text-center" 
                value={triggerDays} 
                onChange={(e) => setTriggerDays(e.target.value)} 
              />
              <span className="text-sm">ימים ללא ביקור</span>
            </div>
          )}
          
          {triggerType === 'birthday' && (
            <div className="flex items-center gap-2">
              <span className="text-sm">שלח</span>
              <Input 
                type="number" 
                className="w-20 text-center" 
                value={triggerDays} 
                onChange={(e) => setTriggerDays(e.target.value)} 
              />
              <span className="text-sm">ימים לפני יום ההולדת</span>
            </div>
          )}
          
          {triggerType === 'appointment_reminder' && (
            <div className="flex items-center gap-2">
              <span className="text-sm">שלח</span>
              <Input 
                type="number" 
                className="w-20 text-center" 
                value={triggerDays} 
                onChange={(e) => setTriggerDays(e.target.value)} 
              />
              <span className="text-sm">שעות לפני התור</span>
            </div>
          )}
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">תבנית הודעה לשליחה</label>
          <Select value={messageTemplate} onValueChange={setMessageTemplate}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="בחר תבנית" />
            </SelectTrigger>
            <SelectContent>
              {templates?.map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">ערוץ שליחה</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {(['whatsapp', 'sms', 'in-app'] as const).map(ch => (
              <Button
                key={ch}
                variant={channel === ch ? "default" : "outline"}
                className={`flex items-center gap-2 ${channel === ch ? 'bg-primary' : ''}`}
                onClick={() => setChannel(ch)}
                type="button"
              >
                {channelIcons[ch]}
                {getChannelLabel(ch)}
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">אינטגרציה עם Make (webhook URL)</label>
          <Input
            placeholder="הזן URL ל-webhook של Make..."
            className="text-left"
            dir="ltr"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            זה יאפשר לאוטומציה לפעול דרך Make בהתאם לתנאים שהגדרת
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="active-automation" className="flex items-center gap-2 cursor-pointer">
            <Clock className="h-4 w-4" />
            <span>האוטומציה פעילה</span>
          </Label>
          <Switch
            id="active-automation"
            checked={isActive}
            onCheckedChange={setIsActive}
          />
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          className="w-full" 
          disabled={isLoading || !name || !messageTemplate}
          onClick={handleSave}
        >
          {initialAutomation ? 'עדכן אוטומציה' : 'צור אוטומציה'}
        </Button>
      </CardFooter>
    </Card>
  );
};
