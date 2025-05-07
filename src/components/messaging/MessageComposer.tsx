
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageTemplate } from '@/types/messaging';
import { MessageSquare, Smartphone } from 'lucide-react';

interface MessageComposerProps {
  templates: MessageTemplate[];
  onSendMessage: (content: string, channel: 'whatsapp' | 'sms' | 'in-app') => void;
  selectedClients: string[];
  isLoading: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  templates,
  onSendMessage,
  selectedClients,
  isLoading
}) => {
  const [content, setContent] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'in-app'>('whatsapp');
  
  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setContent(template.content);
    }
  };

  const handleSend = () => {
    if (content.trim() && selectedClients.length > 0) {
      onSendMessage(content, channel);
      setContent('');
    }
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
  
  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">חיבור הודעה</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-1">תבניות הודעה</label>
          <Select onValueChange={handleTemplateSelect}>
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
          <label className="text-sm font-medium block mb-1">תוכן ההודעה</label>
          <Textarea
            placeholder="הזן את תוכן ההודעה כאן..."
            className="min-h-[120px] text-right"
            dir="rtl"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
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
          <label className="text-sm font-medium block mb-1">נמענים</label>
          {selectedClients.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-primary">{selectedClients.length} לקוחות נבחרו</Badge>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">לא נבחרו לקוחות</div>
          )}
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button 
          className="w-full" 
          disabled={isLoading || content.trim() === '' || selectedClients.length === 0}
          onClick={handleSend}
        >
          שלח הודעה
          {channelIcons[channel]}
        </Button>
      </CardFooter>
    </Card>
  );
};
