
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Message } from '@/types/messaging';
import { formatTime } from './utils/messageUtils';
import MessageItem from './MessageItem';

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
              <MessageItem 
                key={message.id}
                message={message}
                onResend={onResend}
                isLoading={isLoading}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageLog;
