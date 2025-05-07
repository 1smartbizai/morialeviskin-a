
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Automation } from '@/types/messaging';
import { MessageSquare, Smartphone, Clock, Calendar, Edit, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface AutomationsListProps {
  automations: Automation[];
  onEdit: (automationId: string) => void;
  onDelete: (automationId: string) => void;
  onToggleActive: (automationId: string, isActive: boolean) => void;
  isLoading: boolean;
}

export const AutomationsList: React.FC<AutomationsListProps> = ({
  automations,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading
}) => {
  const channelIcons = {
    whatsapp: <MessageSquare className="h-4 w-4 text-green-600" />,
    sms: <Smartphone className="h-4 w-4" />,
    'in-app': <MessageSquare className="h-4 w-4" />
  };

  const getChannelLabel = (channel: 'whatsapp' | 'sms' | 'in-app') => {
    const labels = {
      whatsapp: 'וואטסאפ',
      sms: 'SMS',
      'in-app': 'באפליקציה'
    };
    return labels[channel] || channel;
  };

  const getTriggerTypeIcon = (type: string) => {
    switch (type) {
      case 'no_visit':
        return <Calendar className="h-4 w-4" />;
      case 'birthday':
        return <Calendar className="h-4 w-4" />;
      case 'appointment_reminder':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTriggerTypeLabel = (type: string, days: number) => {
    switch (type) {
      case 'no_visit':
        return `אין ביקור במשך ${days} ימים`;
      case 'birthday':
        return `יום הולדת (${days} ימים לפני)`;
      case 'appointment_reminder':
        return `תזכורת לפגישה (${days} שעות לפני)`;
      default:
        return type;
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'אף פעם';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: he });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">אוטומציות פעילות</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">טוען...</div>
        ) : automations?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            לא נוצרו אוטומציות עדיין
          </div>
        ) : (
          <div className="space-y-4">
            {automations?.map((automation) => (
              <div key={automation.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{automation.name}</h3>
                    <Badge 
                      variant={automation.isActive ? "default" : "outline"}
                      className={automation.isActive ? "bg-green-500" : ""}
                    >
                      {automation.isActive ? 'פעיל' : 'לא פעיל'}
                    </Badge>
                  </div>
                  <Switch
                    checked={automation.isActive}
                    onCheckedChange={(checked) => onToggleActive(automation.id, checked)}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 my-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {getTriggerTypeIcon(automation.trigger.type)}
                    {getTriggerTypeLabel(automation.trigger.type, automation.trigger.days)}
                  </Badge>
                  
                  <Badge variant="outline" className="flex items-center gap-1">
                    {channelIcons[automation.action.channel]}
                    {getChannelLabel(automation.action.channel)}
                  </Badge>
                </div>
                
                {automation.makeWebhookUrl && (
                  <div className="text-xs flex items-center gap-1 text-muted-foreground">
                    <span>Make.com webhook מוגדר</span>
                  </div>
                )}
                
                <div className="text-xs text-muted-foreground">
                  הופעל לאחרונה: {formatTime(automation.lastTriggeredAt)}
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => onEdit(automation.id)}
                  >
                    <Edit className="h-3 w-3" />
                    ערוך
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 border-destructive text-destructive hover:bg-destructive hover:text-white"
                    onClick={() => onDelete(automation.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                    מחק
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

function getTriggerTypeIcon(type: string) {
  switch (type) {
    case 'no_visit':
      return <Calendar className="h-4 w-4" />;
    case 'birthday':
      return <Calendar className="h-4 w-4" />;
    case 'appointment_reminder':
      return <Clock className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}

function getTriggerTypeLabel(type: string, days: number) {
  switch (type) {
    case 'no_visit':
      return `אין ביקור במשך ${days} ימים`;
    case 'birthday':
      return `יום הולדת (${days} ימים לפני)`;
    case 'appointment_reminder':
      return `תזכורת לפגישה (${days} שעות לפני)`;
    default:
      return type;
  }
}

function formatTime(dateString?: string) {
  if (!dateString) return 'אף פעם';
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: he });
  } catch (e) {
    return dateString;
  }
}
