
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MessageCircle, 
  Search,
  ChevronRight,
  Book,
  Video,
  Phone,
  Mail,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface HelpItem {
  id: string;
  title: string;
  category: 'technical' | 'business' | 'operational';
  content: string;
  videoUrl?: string;
}

const QuickHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HelpItem | null>(null);

  const helpItems: HelpItem[] = [
    {
      id: '1',
      title: 'איך להוסיף לקוח חדש?',
      category: 'operational',
      content: 'לחץ על "הלקוחות שלי" בתפריט הצדדי, ואז על כפתור "לקוח חדש". מלא את הפרטים הנדרשים ולחץ שמירה.'
    },
    {
      id: '2',
      title: 'איך לקבוע תור חדש?',
      category: 'operational',
      content: 'עבור לעמוד "התורים שלי", בחר תאריך ושעה פנויים, בחר לקוח וטיפול, ולחץ על "קביעת תור".'
    },
    {
      id: '3',
      title: 'בעיות חיבור למערכת',
      category: 'technical',
      content: 'אם אתה נתקל בבעיות חיבור, נסה לרענן את הדף או לבדוק את חיבור האינטרנט. אם הבעיה נמשכת, צור קשר עם התמיכה.'
    },
    {
      id: '4',
      title: 'איך להגדיר מחירי טיפולים?',
      category: 'business',
      content: 'עבור ל"ניהול עסק" > "טיפולים". לחץ על טיפול קיים לעריכה או על "טיפול חדש" להוספה.'
    },
    {
      id: '5',
      title: 'ייבוא לקוחות קיימים',
      category: 'operational',
      content: 'במסך "הלקוחות שלי", לחץ על "ייבוא לקוחות". תוכל להעלות קובץ Excel או CSV עם פרטי הלקוחות.'
    },
    {
      id: '6',
      title: 'הגדרת שעות עבודה',
      category: 'business',
      content: 'עבור ל"הגדרות עסק" > "שעות עבודה". קבע את השעות לכל יום בשבוע ושמור את השינויים.'
    }
  ];

  const categories = [
    { id: 'technical', name: 'תמיכה טכנית', icon: '⚙️', color: 'bg-blue-100 text-blue-800' },
    { id: 'business', name: 'ניהול עסק', icon: '💼', color: 'bg-green-100 text-green-800' },
    { id: 'operational', name: 'תפעול יומי', icon: '📋', color: 'bg-purple-100 text-purple-800' }
  ];

  const filteredItems = helpItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const contactOptions = [
    {
      type: 'phone',
      title: 'שיחת טלפון',
      description: 'זמינים 24/7',
      icon: Phone,
      action: () => window.open('tel:*2222', '_self')
    },
    {
      type: 'email',
      title: 'דוא"ל תמיכה',
      description: 'מענה תוך 24 שעות',
      icon: Mail,
      action: () => window.open('mailto:support@bellevo.app', '_self')
    },
    {
      type: 'chat',
      title: 'צ\'אט בזמן אמת',
      description: 'מענה מיידי',
      icon: MessageCircle,
      action: () => {
        // כאן ניתן להוסיף אינטגרציה עם מערכת צ'אט
        alert('מערכת צ\'אט תיפתח בקרוב...');
      }
    }
  ];

  return (
    <>
      {/* כפתור צף */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 h-14 w-14 rounded-full shadow-lg bg-beauty-primary hover:bg-beauty-primary/90 animate-scale-in"
        size="icon"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      {/* דיאלוג עזרה */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-beauty-dark">
              <HelpCircle className="h-5 w-5 text-beauty-primary" />
              מרכז עזרה מהיר
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[70vh]">
            {/* עמודה שמאלית - חיפוש וקטגוריות */}
            <div className="space-y-4">
              {/* חיפוש */}
              <div className="relative">
                <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="חפש בעזרה..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>

              {/* קטגוריות */}
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-beauty-dark">קטגוריות</h3>
                <Button
                  variant={selectedCategory === null ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  <Book className="mr-2 h-4 w-4" />
                  כל הנושאים
                </Button>
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* יצירת קשר */}
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">זקוק לעזרה נוספת?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {contactOptions.map(option => (
                    <Button
                      key={option.type}
                      variant="ghost"
                      className="w-full justify-start h-auto p-2"
                      onClick={option.action}
                    >
                      <option.icon className="mr-2 h-4 w-4" />
                      <div className="text-right">
                        <div className="font-medium text-xs">{option.title}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* עמודה אמצעית - רשימת שאלות */}
            <div className="border-r border-l px-4 overflow-y-auto">
              <h3 className="font-medium mb-3 text-beauty-dark">
                שאלות נפוצות ({filteredItems.length})
              </h3>
              <div className="space-y-2">
                {filteredItems.map(item => {
                  const category = categories.find(c => c.id === item.category);
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className="w-full justify-between h-auto p-3 text-right"
                      onClick={() => setSelectedItem(item)}
                    >
                      <div className="flex-1 text-right">
                        <div className="font-medium text-sm mb-1">{item.title}</div>
                        {category && (
                          <Badge variant="outline" className={`text-xs ${category.color}`}>
                            {category.icon} {category.name}
                          </Badge>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    </Button>
                  );
                })}
                {filteredItems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Book className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>לא נמצאו תוצאות</p>
                    <p className="text-sm">נסה חיפוש אחר או צור קשר איתנו</p>
                  </div>
                )}
              </div>
            </div>

            {/* עמודה ימנית - תוכן */}
            <div className="overflow-y-auto">
              {selectedItem ? (
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-beauty-dark">{selectedItem.title}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedItem(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="prose prose-sm text-right">
                    <p className="text-muted-foreground leading-relaxed">
                      {selectedItem.content}
                    </p>
                  </div>

                  {selectedItem.videoUrl && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        סרטון הדרכה
                      </h4>
                      <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">סרטון יהיה זמין בקרוב</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">האם זה עזר לך?</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">👍 כן</Button>
                      <Button size="sm" variant="outline">👎 לא</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="font-medium mb-2">בחר שאלה מהרשימה</h3>
                  <p className="text-sm">או חפש נושא שמעניין אותך</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QuickHelp;
