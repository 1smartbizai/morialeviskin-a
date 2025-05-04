
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  AlertCircle,
  TrendingUp 
} from "lucide-react";
import { Insight, InsightPriority, InsightType } from "@/types/insights";

interface InsightCardProps {
  insight: Insight;
}

const InsightCard = ({ insight }: InsightCardProps) => {
  const getPriorityColor = (priority: InsightPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "low":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getInsightIcon = (type: InsightType) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5" />;
      case "client":
        return <Users className="h-5 w-5" />;
      case "revenue":
        return <TrendingUp className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const handleActionClick = () => {
    // In a real implementation, this would trigger the action
    console.log(`Executing action for insight: ${insight.id}`);
    // Navigate to relevant page or show a modal based on the action type
  };

  return (
    <div className={`p-4 border rounded-lg ${insight.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${
            insight.type === 'appointment' ? 'bg-purple-100 text-purple-700' : 
            insight.type === 'client' ? 'bg-green-100 text-green-700' : 
            'bg-blue-100 text-blue-700'
          }`}>
            {getInsightIcon(insight.type)}
          </div>
          <h3 className="font-bold text-lg">{insight.title}</h3>
        </div>
        <Badge className={`${getPriorityColor(insight.priority)} border`}>
          {insight.priority === "high" ? "דחוף" : 
           insight.priority === "medium" ? "בינוני" : "נמוך"}
        </Badge>
      </div>
      
      <p className="text-gray-700 my-3">{insight.description}</p>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          {new Date(insight.createdAt).toLocaleDateString('he-IL')}
        </span>
        <Button onClick={handleActionClick}>
          {insight.actionText}
        </Button>
      </div>
    </div>
  );
};

export default InsightCard;
