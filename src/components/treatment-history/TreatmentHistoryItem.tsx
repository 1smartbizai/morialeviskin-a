
import { useState } from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { 
  Calendar, 
  Clock, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  Download
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
import { TreatmentHistoryItem as TreatmentHistoryItemType } from "@/hooks/useTreatmentHistory";

interface TreatmentHistoryItemProps {
  item: TreatmentHistoryItemType;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "done":
      return "bg-green-100 text-green-800";
    case "cancelled":
    case "canceled":
      return "bg-red-100 text-red-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "completed":
    case "done":
      return "בוצע";
    case "cancelled":
    case "canceled":
      return "בוטל";
    case "confirmed":
      return "מאושר";
    case "pending":
      return "ממתין";
    default:
      return status;
  }
};

export const TreatmentHistoryItem = ({ item }: TreatmentHistoryItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hasDetails = item.therapistNotes || (item.attachments && item.attachments.length > 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Main content - always visible */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-semibold text-beauty-dark">{item.treatmentName}</h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Calendar className="h-3.5 w-3.5 ms-0.5 me-1" />
              {format(item.appointmentDate, "dd/MM/yyyy", { locale: he })}
              <Clock className="h-3.5 w-3.5 ms-3 me-1" />
              {format(item.appointmentDate, "HH:mm", { locale: he })}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={cn(getStatusColor(item.appointmentStatus))}>
              {getStatusText(item.appointmentStatus)}
            </Badge>
            
            {item.price > 0 && (
              <span className="text-sm font-medium">{formatCurrency(item.price)}</span>
            )}
          </div>
        </div>
        
        {item.businessOwnerName && (
          <div className="mt-2 text-xs text-muted-foreground">
            מטפל/ת: {item.businessOwnerName}
          </div>
        )}
        
        {hasDetails && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 h-auto p-1 text-beauty-primary w-full flex justify-center items-center"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 me-1" />
                הסתר פרטים
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 me-1" />
                הצג פרטים
              </>
            )}
          </Button>
        )}
      </div>
      
      {/* Expandable content */}
      {isExpanded && hasDetails && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          {/* Therapist Notes */}
          {item.therapistNotes && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1 text-beauty-dark flex items-center">
                <FileText className="h-4 w-4 me-1" />
                הערות מטפל/ת:
              </h4>
              <p className="text-sm text-muted-foreground bg-white p-3 rounded border border-gray-100">
                {item.therapistNotes}
              </p>
            </div>
          )}
          
          {/* Attachments */}
          {item.attachments && item.attachments.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-beauty-dark">קבצים מצורפים:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {item.attachments.map((attachment, index) => (
                  <a 
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 rounded border border-gray-200 bg-white hover:bg-beauty-accent/10 transition-colors"
                  >
                    <Download className="h-4 w-4 me-2 text-beauty-primary" />
                    <span className="text-sm truncate">{attachment.name}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
