
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MotivationQuote {
  text: string;
  author?: string;
  category: 'business' | 'inspiration' | 'beauty' | 'success';
}

const DailyMotivation = () => {
  const { user } = useAuth();
  const [currentQuote, setCurrentQuote] = useState<MotivationQuote | null>(null);
  const [loading, setLoading] = useState(false);

  const motivationQuotes: MotivationQuote[] = [
    {
      text: "כל יום הוא הזדמנות חדשה להפוך חלומות למציאות",
      category: 'inspiration'
    },
    {
      text: "הצלחה היא לא יעד אלא מסע של גדילה והתפתחות",
      category: 'success'
    },
    {
      text: "היופי שלך מתחיל ברגע שאת מחליטה להיות עצמך",
      category: 'beauty'
    },
    {
      text: "עסק מצליח נבנה מחיבור אמיתי עם הלקוחות",
      category: 'business'
    },
    {
      text: "כל לקוחה שעוזבת מרוצה היא שגרירה של המותג שלך",
      category: 'business'
    },
    {
      text: "ההשקעה הטובה ביותר היא בעצמך ובכישורים שלך",
      category: 'success'
    },
    {
      text: "יופי אמיתי זה להרגיש בטוחה ומוכנה לכבוש את העולם",
      category: 'beauty'
    },
    {
      text: "כל טיפול שאת נותנת הוא מתנה של אהבה עצמית ללקוחה",
      category: 'beauty'
    },
    {
      text: "הדרך להצלחה עוברת דרך עמידה ביעדים קטנים כל יום",
      category: 'success'
    },
    {
      text: "הלקוחות שלך לא רק קונות שירות - הן קונות חוויה וביטחון",
      category: 'business'
    },
    {
      text: "כל 'לא' מקרב אותך לכן שיגיד 'כן'",
      category: 'business'
    },
    {
      text: "האושר שלך משתקף בעבודה שלך ומשפיע על כולם סביבך",
      category: 'inspiration'
    },
    {
      text: "גדלי את העסק שלך בקצב שמתאים לך, לא בקצב של אחרים",
      category: 'business'
    },
    {
      text: "כל יום שאת פותחת את הסלון זה יום של קסם ויצירתיות",
      category: 'beauty'
    },
    {
      text: "התשוקה שלך היא המנוע שיוביל אותך להצלחה",
      category: 'inspiration'
    },
    {
      text: "לקוחות מרוצות הן הפרסומת הטובה ביותר שיש",
      category: 'business'
    },
    {
      text: "כל שגיאה היא שיעור וכל שיעור מקרב אותך למומחיות",
      category: 'success'
    },
    {
      text: "היופי שאת יוצרת בעולם מתחיל מהיופי שבתוכך",
      category: 'beauty'
    },
    {
      text: "עסק מצליח נבנה צעד אחר צעד, יום אחר יום",
      category: 'business'
    },
    {
      text: "את לא רק מטפלת יופי - את אמנית ומטפלת נפש",
      category: 'beauty'
    }
  ];

  useEffect(() => {
    loadDailyQuote();
  }, [user]);

  const loadDailyQuote = async () => {
    if (!user) return;

    try {
      // בדיקה אם יש ציטוט שמור להיום
      const today = new Date().toISOString().split('T')[0];
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const savedQuoteIndex = preferences?.metadata?.daily_quote_index;
      const savedQuoteDate = preferences?.metadata?.daily_quote_date;

      if (savedQuoteDate === today && savedQuoteIndex !== undefined) {
        // השתמש בציטוט השמור
        setCurrentQuote(motivationQuotes[savedQuoteIndex] || motivationQuotes[0]);
      } else {
        // יצירת ציטוט חדש להיום
        generateDailyQuote();
      }
    } catch (error) {
      console.error('Error loading daily quote:', error);
      // ציטוט ברירת מחדל
      setCurrentQuote(motivationQuotes[0]);
    }
  };

  const generateDailyQuote = async () => {
    setLoading(true);
    
    try {
      // בחירה רנדומלית מותאמת לתאריך
      const today = new Date();
      const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
      const quoteIndex = dayOfYear % motivationQuotes.length;
      
      const selectedQuote = motivationQuotes[quoteIndex];
      setCurrentQuote(selectedQuote);

      // שמירה של הציטוט בהעדפות המשתמש
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        
        await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            metadata: {
              daily_quote_index: quoteIndex,
              daily_quote_date: today,
              daily_motivation: true
            }
          }, {
            onConflict: 'user_id'
          });
      }
    } catch (error) {
      console.error('Error generating daily quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationQuotes.length);
    setCurrentQuote(motivationQuotes[randomIndex]);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'business':
        return 'text-blue-600';
      case 'beauty':
        return 'text-pink-600';
      case 'success':
        return 'text-green-600';
      case 'inspiration':
        return 'text-purple-600';
      default:
        return 'text-beauty-primary';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'business':
        return 'עסק';
      case 'beauty':
        return 'יופי';
      case 'success':
        return 'הצלחה';
      case 'inspiration':
        return 'השראה';
      default:
        return '';
    }
  };

  if (!currentQuote) {
    return (
      <Card className="animate-fade-in bg-gradient-to-r from-beauty-primary/5 to-beauty-accent">
        <CardContent className="p-6">
          <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in bg-gradient-to-r from-beauty-primary/5 to-beauty-accent hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="p-3 bg-beauty-primary/10 rounded-full">
              <Quote className="h-6 w-6 text-beauty-primary" />
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-beauty-primary" />
                <span className="text-sm font-medium text-beauty-dark">מחשבה מעוררת השראה</span>
                <span className={`text-xs px-2 py-1 rounded-full bg-white/50 ${getCategoryColor(currentQuote.category)}`}>
                  {getCategoryName(currentQuote.category)}
                </span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={refreshQuote}
                disabled={loading}
                className="hover:bg-white/50"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            
            <blockquote className="text-lg leading-relaxed text-beauty-dark font-medium italic">
              "{currentQuote.text}"
            </blockquote>
            
            {currentQuote.author && (
              <div className="text-sm text-muted-foreground text-left">
                — {currentQuote.author}
              </div>
            )}
            
            <div className="text-xs text-muted-foreground pt-2 border-t border-white/30">
              מחשבה מיוחדת ליום {new Date().toLocaleDateString('he-IL', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyMotivation;
