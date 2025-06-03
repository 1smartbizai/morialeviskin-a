
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface IntegrationsProgressProps {
  enabledCount: number;
  totalCount: number;
}

const IntegrationsProgress = ({ enabledCount, totalCount }: IntegrationsProgressProps) => {
  return (
    <Card className="bg-gradient-to-l from-green-50 to-blue-50 border-green-200">
      <CardContent className="p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <h3 className="font-semibold text-green-900 text-lg">
              {enabledCount} מתוך {totalCount} אינטגרציות נבחרו
            </h3>
          </div>
          <p className="text-green-800 text-sm">
            תוכלי להוסיף או לשנות אינטגרציות בכל עת מדף ההגדרות של העסק
          </p>
          
          {enabledCount === 0 && (
            <div className="mt-3 p-3 bg-yellow-100 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">
                  מומלץ לבחור לפחות אינטגרציה אחת כדי להתחיל
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsProgress;
