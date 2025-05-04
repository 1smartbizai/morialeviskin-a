
import { useState, useEffect } from "react";
import { Insight } from "@/types/insights";

// Mock insights data
const mockInsights: Insight[] = [
  {
    id: "1",
    title: "תורים מעטים ביום שלישי",
    description: "יש רק 2 תורים ליום שלישי הקרוב. שקלי לשלוח הודעת SMS ללקוחות שלא היו אצלך בחודש האחרון עם הצעה מיוחדת.",
    type: "appointment",
    priority: "high",
    actionText: "שלחי הודעה ללקוחות",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "3 לקוחות קבועים לא ביקרו החודש",
    description: "מיכל כהן, יעל לוי ורחל גולן לא קבעו תור בחודשיים האחרונים. הן בדרך כלל מבקרות פעם בחודש.",
    type: "client",
    priority: "medium",
    actionText: "צרי קשר עם הלקוחות",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "הכנסות מטיפולי פנים בירידה",
    description: "הכנסות מטיפולי פנים ירדו ב-25% בהשוואה לחודש הקודם. שקלי הצעה מיוחדת או קמפיין ממוקד לקידום טיפולי פנים.",
    type: "revenue",
    priority: "medium",
    actionText: "צרי קמפיין מבצעים",
    createdAt: new Date().toISOString()
  },
  {
    id: "4",
    title: "יום הולדת ללקוחה קבועה",
    description: "ליאת ברקוביץ' חוגגת יום הולדת בשבוע הבא. שליחת ברכה אישית וקופון הנחה יכולה לחזק את הקשר.",
    type: "client",
    priority: "low",
    actionText: "שלחי ברכה וקופון",
    createdAt: new Date().toISOString()
  },
  {
    id: "5",
    title: "מלאי מוצרים נמוך",
    description: "המלאי של סרום הפנים הפופולרי עומד לפני סיום. יש להזמין מחדש כדי להימנע מחוסרים.",
    type: "revenue",
    priority: "high",
    actionText: "הזמיני מלאי חדש",
    createdAt: new Date().toISOString()
  }
];

export const useAIInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadInsights = () => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      try {
        // Sort insights by priority (high first)
        const sortedInsights = [...mockInsights].sort((a, b) => {
          const priorityMap: Record<string, number> = {
            high: 3,
            medium: 2,
            low: 1
          };
          return priorityMap[b.priority] - priorityMap[a.priority];
        });
        
        setInsights(sortedInsights);
        setIsLoading(false);
      } catch (err) {
        setError("אירעה שגיאה בטעינת התובנות. נסה שוב מאוחר יותר.");
        setIsLoading(false);
      }
    }, 1000);
  };

  const refreshInsights = () => {
    loadInsights();
  };

  // Load insights on first render
  useEffect(() => {
    loadInsights();
  }, []);

  return {
    insights,
    isLoading,
    error,
    refreshInsights
  };
};
