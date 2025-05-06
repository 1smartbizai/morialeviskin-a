
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { CalendarClock, Check, Clock, MessageSquare, MoreVertical } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiskAssessment } from "@/types/client-management";
import { RiskScoreBadge } from "./RiskScoreBadge";
import { Badge } from "@/components/ui/badge";

interface RiskAssessmentItemProps {
  assessment: RiskAssessment;
  onEdit?: (assessment: RiskAssessment) => void;
  onCreateAction?: (assessment: RiskAssessment) => void;
  onMarkActionTaken?: (id: string) => void;
}

export const RiskAssessmentItem: React.FC<RiskAssessmentItemProps> = ({
  assessment,
  onEdit,
  onCreateAction,
  onMarkActionTaken,
}) => {
  const formattedDate = assessment.created_at 
    ? formatDistanceToNow(new Date(assessment.created_at), { addSuffix: true })
    : '';
  
  const formattedLastActionDate = assessment.last_action_date
    ? formatDistanceToNow(new Date(assessment.last_action_date), { addSuffix: true })
    : null;

  return (
    <Card className="mb-4 overflow-hidden border-r-4" 
      style={{ 
        borderRightColor: 
          assessment.risk_score >= 8 ? "#ef4444" : 
          assessment.risk_score >= 6 ? "#f97316" : 
          assessment.risk_score >= 4 ? "#eab308" : "#3b82f6"
      }}
    >
      <CardContent className="p-4">
        {assessment.client && (
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={assessment.client.photo_url || ''} alt={`${assessment.client.first_name} ${assessment.client.last_name}`} />
              <AvatarFallback>{assessment.client.first_name?.[0]}{assessment.client.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-medium">{assessment.client.first_name} {assessment.client.last_name}</p>
              <p className="text-xs text-muted-foreground">{assessment.client.phone}</p>
            </div>
            <RiskScoreBadge score={assessment.risk_score} />
          </div>
        )}
        
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <CalendarClock className="h-4 w-4" />
          <span>Created {formattedDate}</span>
          {assessment.status && (
            <>
              <span className="mx-1">•</span>
              <Badge variant="outline" className="text-xs">
                {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
              </Badge>
            </>
          )}
          {formattedLastActionDate && (
            <>
              <span className="mx-1">•</span>
              <Clock className="h-4 w-4" />
              <span>Last action {formattedLastActionDate}</span>
            </>
          )}
        </div>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold mb-1">Reasons:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {assessment.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-1">Suggested Actions:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {assessment.suggested_actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-2 bg-muted/20 flex justify-between">
        <div className="flex gap-2">
          {onMarkActionTaken && (
            <Button variant="secondary" size="sm" onClick={() => onMarkActionTaken(assessment.id)}>
              <Check className="h-4 w-4 mr-1" /> Mark Action Taken
            </Button>
          )}
          
          {onCreateAction && (
            <Button variant="ghost" size="sm" onClick={() => onCreateAction(assessment)}>
              <MessageSquare className="h-4 w-4 mr-1" /> Create Action
            </Button>
          )}
        </div>
        
        {onEdit && (
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
              <DropdownMenuItem onClick={() => onEdit(assessment)}>
                Edit Assessment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardFooter>
    </Card>
  );
};
