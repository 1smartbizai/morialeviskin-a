
import React from "react";
import { useClientMessages } from "@/hooks/useClientMessages";
import MessageBubble from "./MessageBubble";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { MessageSquareWarning } from "lucide-react";
import { QuickResponseType } from "@/types/clientMessages";

const MessagesList: React.FC = () => {
  const { messages, isLoading, markAsRead, sendQuickResponse } = useClientMessages();
  
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  if (messages.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <MessageSquareWarning className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">אין הודעות</h3>
        <p className="text-gray-500 mb-4">לא נמצאו הודעות חדשות עבורך</p>
        <Button>רענון</Button>
      </div>
    );
  }
  
  // Function to format date headers
  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return "היום";
    }
    
    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return "אתמול";
    }
    
    // Format date as dd/mm/yyyy
    return new Intl.DateTimeFormat("he-IL").format(date);
  };
  
  // Group messages by date
  const groupedMessages = messages.reduce<Record<string, typeof messages>>((acc, message) => {
    const dateHeader = formatDateHeader(message.sentAt);
    if (!acc[dateHeader]) {
      acc[dateHeader] = [];
    }
    acc[dateHeader].push(message);
    return acc;
  }, {});
  
  const handleMarkAsRead = (messageId: string) => {
    markAsRead(messageId);
  };
  
  const handleQuickResponse = (messageId: string, responseType: QuickResponseType) => {
    sendQuickResponse(messageId, responseType);
  };
  
  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([dateHeader, dateMessages]) => (
        <div key={dateHeader}>
          <div className="flex items-center gap-2 mb-3">
            <Separator className="flex-1" />
            <span className="text-xs font-medium text-gray-500 px-2">{dateHeader}</span>
            <Separator className="flex-1" />
          </div>
          <div className="space-y-4">
            {dateMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onMarkAsRead={handleMarkAsRead}
                onQuickResponse={handleQuickResponse}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessagesList;
