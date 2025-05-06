
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

interface RiskScoreBadgeProps {
  score: number;
  showIcon?: boolean;
}

export const RiskScoreBadge: React.FC<RiskScoreBadgeProps> = ({ score, showIcon = true }) => {
  const getScoreColor = () => {
    if (score >= 8) return "bg-red-100 text-red-800";
    if (score >= 6) return "bg-orange-100 text-orange-800";
    if (score >= 4) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };
  
  const getSeverityText = () => {
    if (score >= 8) return "High Risk";
    if (score >= 6) return "Medium Risk";
    if (score >= 4) return "Low Risk";
    return "Minimal Risk";
  };
  
  return (
    <Badge className={`rounded-md text-xs px-2 py-1 ${getScoreColor()}`}>
      {showIcon && <AlertTriangle className="h-3 w-3 mr-1" />}
      {getSeverityText()} ({score}/10)
    </Badge>
  );
};
