
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LightbulbIcon, RefreshCw } from "lucide-react";

interface InsightData {
  title: string;
  content: string;
  type: "revenue" | "client" | "appointment" | "marketing";
}

const mockInsights: InsightData[] = [
  {
    title: "הזדמנות להגדלת הכנסות",
    content: "55% מהלקוחות שלך קונים טיפול אחד בלבד. שקלי להציע חבילות טיפולים בהנחה לעידוד רכישות חוזרות.",
    type: "revenue"
  },
  {
    title: "זיהוי מגמת לקוחות",
    content: "לקוחות בגילאי 25-34 הם הקבוצה הצומחת ביותר - שקלי למקד קמפיינים לקהל יעד זה.",
    type: "client"
  },
  {
    title: "אופטימיזציה של לוח זמנים",
    content: "ימי רביעי בין 16:00-19:00 הם הזמנים המבוקשים ביותר. שקלי להרחיב את שעות הפעילות בזמנים אלה.",
    type: "appointment"
  }
];

const AIInsights = () => {
  const [currentInsight, setCurrentInsight] = useState<InsightData>(mockInsights[0]);
  const [loading, setLoading] = useState(false);

  const getRandomInsight = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockInsights.length);
      setCurrentInsight(mockInsights[randomIndex]);
      setLoading(false);
    }, 800);
  };

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-semibold flex items-center">
          <LightbulbIcon className="mr-2 h-5 w-5 text-yellow-500" />
          תובנה חכמה
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={getRandomInsight} 
          disabled={loading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="bg-beauty-accent p-4 rounded-lg">
          <h3 className="font-bold mb-2 text-lg">{currentInsight.title}</h3>
          <p className="text-muted-foreground">{currentInsight.content}</p>
        </div>
        <div className="flex justify-end mt-3">
          <Button variant="link" size="sm" className="text-beauty-primary">
            יישום המלצה זו
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIInsights;
