
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Award, Droplet } from "lucide-react";
import { Link } from "react-router-dom";
import { useFeedbackSurvey } from "@/hooks/useFeedbackSurvey";

interface QuickActionsProps {
  hasPendingFeedback?: boolean;
}

const QuickActions = ({ hasPendingFeedback = false }: QuickActionsProps) => {
  const { isEligibleForSurvey } = useFeedbackSurvey();
  
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      <Link to="/client/appointments">
        <Button
          variant="outline"
          className="w-full h-auto py-4 flex flex-col items-center"
        >
          <Calendar className="h-5 w-5 mb-2" />
          <span>תורים</span>
        </Button>
      </Link>
      
      <Link to="/client/messages">
        <Button
          variant="outline"
          className="w-full h-auto py-4 flex flex-col items-center"
        >
          <MessageSquare className="h-5 w-5 mb-2" />
          <span>הודעות</span>
        </Button>
      </Link>
      
      <Link to="/client/rewards">
        <Button
          variant="outline"
          className="w-full h-auto py-4 flex flex-col items-center"
        >
          <Award className="h-5 w-5 mb-2" />
          <span>הטבות</span>
        </Button>
      </Link>
      
      <Link to="/client/skin-profile">
        <Button
          variant="outline"
          className="w-full h-auto py-4 flex flex-col items-center"
        >
          <Droplet className="h-5 w-5 mb-2" />
          <span>פרופיל העור</span>
        </Button>
      </Link>
      
      {isEligibleForSurvey && (
        <Link to="/client/feedback" className="col-span-2">
          <Button
            variant="secondary"
            className="w-full h-auto py-3 flex items-center justify-center gap-2 bg-beauty-accent/30"
          >
            <span className="text-sm">✨ שתפי אותנו במשוב קצר ✨</span>
          </Button>
        </Link>
      )}
    </div>
  );
};

export default QuickActions;
