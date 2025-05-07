
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LoyaltyBannerProps {
  points: number;
}

const LoyaltyBanner = ({ points }: LoyaltyBannerProps) => {
  const navigate = useNavigate();

  if (points <= 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-amber-900 mb-1">נקודות נאמנות</h3>
            <div className="text-2xl font-bold text-amber-700">{points} נקודות</div>
            <p className="text-sm text-amber-800 mt-1">עוד 50 נקודות להטבה הבאה</p>
          </div>
          <Award className="h-10 w-10 text-amber-500" />
        </div>
        <Button 
          variant="outline"
          className="mt-4 border-amber-300 text-amber-700 hover:bg-amber-200/50 hover:text-amber-900"
          onClick={() => navigate("/client/rewards")}
        >
          למימוש נקודות
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoyaltyBanner;
