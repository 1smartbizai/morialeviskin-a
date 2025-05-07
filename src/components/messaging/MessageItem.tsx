
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Send } from 'lucide-react';
import { Message } from '@/types/messaging';
import { formatTime } from './utils/messageUtils';
import MessageStatusBadge from './MessageStatusBadge';
import MessageChannelBadge from './MessageChannelBadge';

interface MessageItemProps {
  message: Message;
  onResend: (messageId: string) => void;
  isLoading: boolean;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onResend, isLoading }) => {
  return (
    <div key={message.id} className="border rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <MessageStatusBadge status={message.status} />
          <MessageChannelBadge channel={message.channel} />
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
  );
};

export default MessageItem;
