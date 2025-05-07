
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Message } from '@/types/messaging';
import { MessageSquare, Smartphone, Send, Check, CheckCheck, Clock, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

interface MessageLogProps {
  messages: Message[];
  onResend: (messageId: string) => void;
  isLoading: boolean;
}

export const MessageLog: React.FC<MessageLogProps> = ({
  messages,
  onResend,
  isLoading
}) => {
  const channelIcons = {
    whatsapp: <MessageSquare className="h-4 w-4 text-green-600" />,
    sms: <Smartphone className="h-4 w-4" />,
    'in-app': <MessageSquare className="h-4 w-4" />
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />;
      case 'delivered':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'read':
        return <CheckCheck className="h-4 w-4 text-green-700" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: Message['status']) => {
    const labels = {
      pending: 'ממתין',
      sent: 'נשלח',
      delivered: 'נמסר',
      read: 'נקרא',
      failed: 'נכשל'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: Message['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'read':
        return 'bg-green-700 text-white';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  const getChannelLabel = (channel: 'whatsapp' | 'sms' | 'in-app') => {
    const labels = {
      whatsapp: 'וואטסאפ',
      sms: 'SMS',
      'in-app': 'באפליקציה'
    };
    return labels[channel] || channel;
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: he });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">יומן הודעות</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">טוען...</div>
        ) : messages?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            לא נשלחו הודעות עדיין
          </div>
        ) : (
          <div className="space-y-4">
            {messages?.map((message) => (
              <div key={message.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(message.status)}>
                      {getStatusIcon(message.status)}
                      <span className="mr-1">{getStatusLabel(message.status)}</span>
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {channelIcons[message.channel]}
                      {getChannelLabel(message.channel)}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(message.sentAt)}
                  </div>
                </div>
                
                <div className="text-sm font-medium">
                  {message.clientName || 'ללקוח'}
                </div>
                
                <div className="bg-slate-50 p-3 rounded text-sm break-words">
                  {message.content}
                </div>
                
                {message.status === 'failed' && message.failureReason && (
                  <div className="text-xs text-destructive">
                    סיבת כישלון: {message.failureReason}
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => onResend(message.id)}
                    disabled={isLoading || message.status === 'pending'}
                  >
                    <Send className="h-3 w-3" />
                    שלח שוב
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

function getStatusColor(status: Message['status']) {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'read':
      return 'bg-green-700 text-white';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return '';
  }
}

function getStatusLabel(status: Message['status']) {
  const labels = {
    pending: 'ממתין',
    sent: 'נשלח',
    delivered: 'נמסר',
    read: 'נקרא',
    failed: 'נכשל'
  };
  return labels[status] || status;
}

function getChannelLabel(channel: 'whatsapp' | 'sms' | 'in-app') {
  const labels = {
    whatsapp: 'וואטסאפ',
    sms: 'SMS',
    'in-app': 'באפליקציה'
  };
  return labels[channel] || channel;
}

function formatTime(dateString: string) {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: he });
  } catch (e) {
    return dateString;
  }
}
