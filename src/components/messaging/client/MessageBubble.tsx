
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Clock, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { ClientMessage, QuickResponseType } from "@/types/clientMessages";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: ClientMessage;
  onMarkAsRead: (messageId: string) => void;
  onQuickResponse: (messageId: string, responseType: QuickResponseType) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onMarkAsRead,
  onQuickResponse
}) => {
  const [hasResponded, setHasResponded] = useState(false);
  
  // Mark as read when component mounts if not already read
  useEffect(() => {
    if (!message.isRead) {
      onMarkAsRead(message.id);
    }
    
    // Check if there are any responses already
    if (message.responses && message.responses.length > 0) {
      setHasResponded(true);
    }
  }, [message, onMarkAsRead]);
  
  const formatSentTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true, 
        locale: he 
      });
    } catch (e) {
      return dateString;
    }
  };
  
  const getMessageTypeIcon = () => {
    switch (message.messageType) {
      case "greeting":
        return <User className="h-4 w-4 text-blue-500" />;
      case "recommendation":
        return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case "update":
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case "appointment":
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getMessageTypeName = () => {
    const types = {
      greeting: "ברכה",
      recommendation: "המלצה",
      update: "עדכון",
      appointment: "תזכורת תור",
      other: "הודעה"
    };
    
    return types[message.messageType] || "הודעה";
  };
  
  const handleQuickResponse = (responseType: QuickResponseType) => {
    onQuickResponse(message.id, responseType);
    setHasResponded(true);
  };
  
  return (
    <Card className={cn(
      "p-4 transition-all",
      !message.isRead && "border-r-4 border-beauty-primary shadow-md"
    )}>
      <div className="flex items-start gap-3">
        <div className="bg-beauty-accent/50 rounded-full p-2 flex-shrink-0">
          {getMessageTypeIcon()}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-beauty-dark">{message.senderName}</h4>
              <span className="text-xs bg-beauty-accent/30 px-2 py-0.5 rounded-full">
                {getMessageTypeName()}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {formatSentTime(message.sentAt)}
            </span>
          </div>
          
          <div className="bg-beauty-neutral/50 p-3 rounded-lg mt-2 text-sm leading-relaxed whitespace-pre-line">
            {message.content}
          </div>
          
          {!hasResponded && (
            <div className="flex flex-wrap gap-2 mt-3 justify-end">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickResponse("thank_you")}
              >
                תודה רבה
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickResponse("interested")}
              >
                מעוניינת
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickResponse("question")}
              >
                יש לי שאלה
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="text-xs text-gray-500"
                onClick={() => handleQuickResponse("not_relevant")}
              >
                לא רלוונטי
              </Button>
            </div>
          )}
          
          {hasResponded && (
            <div className="text-xs text-gray-500 text-center mt-2">
              הגבת להודעה זו
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MessageBubble;
