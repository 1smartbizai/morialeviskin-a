
import { RefreshCw, ChartBarIcon, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InsightsHeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const InsightsHeader = ({ onRefresh, isLoading }: InsightsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="text-yellow-500 h-6 w-6" />
        <h1 className="text-2xl font-bold">תובנות עסקיות חכמות</h1>
      </div>
      <Button 
        onClick={onRefresh} 
        disabled={isLoading}
        className="flex items-center"
      >
        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        רענן תובנות
      </Button>
    </div>
  );
};

export default InsightsHeader;
