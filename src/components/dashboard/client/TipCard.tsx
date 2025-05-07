
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface TipCardProps {
  tip: string;
}

const TipCard = ({ tip }: TipCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start">
          <Sparkles className="h-6 w-6 text-purple-500 ml-3 mt-1 shrink-0" />
          <div>
            <h3 className="font-medium text-purple-900 mb-2">טיפ אישי עבורך</h3>
            <p className="text-purple-800">{tip}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TipCard;
