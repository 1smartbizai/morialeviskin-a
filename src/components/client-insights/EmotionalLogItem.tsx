
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { CalendarClock, Heart, MessageSquare, MoreVertical, Tag } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmotionalLog } from "@/types/client-management";

interface EmotionalLogItemProps {
  log: EmotionalLog;
  onEdit?: (log: EmotionalLog) => void;
  onDelete?: (id: string) => void;
  onCreateAction?: (log: EmotionalLog) => void;
}

export const EmotionalLogItem: React.FC<EmotionalLogItemProps> = ({
  log,
  onEdit,
  onDelete,
  onCreateAction,
}) => {
  const getSentimentColor = (sentiment: string | undefined) => {
    switch (sentiment) {
      case "positive": return "bg-green-100 text-green-800";
      case "negative": return "bg-red-100 text-red-800";
      case "neutral": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  // Format date for display
  const formattedDate = formatDistanceToNow(new Date(log.created_at), { addSuffix: true });

  return (
    <Card className="mb-4 overflow-hidden border-r-4" 
      style={{ borderRightColor: log.sentiment === "positive" 
        ? "#10b981" 
        : log.sentiment === "negative" 
          ? "#ef4444" 
          : "#6b7280" }}
    >
      <CardContent className="p-4">
        {log.client && (
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={log.client.photo_url || ''} alt={`${log.client.first_name} ${log.client.last_name}`} />
              <AvatarFallback>{log.client.first_name?.[0]}{log.client.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{log.client.first_name} {log.client.last_name}</p>
              <p className="text-xs text-muted-foreground">{log.client.phone}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <CalendarClock className="h-4 w-4" />
          <span>{formattedDate}</span>
          {log.sentiment && (
            <>
              <span className="mx-1">•</span>
              <Heart className="h-4 w-4" />
              <span className={`px-2 py-0.5 rounded-full text-xs ${getSentimentColor(log.sentiment)}`}>
                {log.sentiment.charAt(0).toUpperCase() + log.sentiment.slice(1)}
              </span>
            </>
          )}
        </div>
        
        <p className="text-base whitespace-pre-wrap">{log.content}</p>
        
        {log.tags && log.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {log.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs flex items-center gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="px-4 py-2 bg-muted/20 flex justify-between">
        {onCreateAction && (
          <Button variant="ghost" size="sm" onClick={() => onCreateAction(log)}>
            <MessageSquare className="h-4 w-4 mr-1" /> Create Action
          </Button>
        )}
        
        {(onEdit || onDelete) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(log)}>
                  Edit Log
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(log.id)}>
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  );
};
