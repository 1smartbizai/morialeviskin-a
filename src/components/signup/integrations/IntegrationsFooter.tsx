
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";
import { Settings, Crown, ArrowUp } from "lucide-react";

interface IntegrationsFooterProps {
  onUpgradeClick: (integration: string) => void;
}

const IntegrationsFooter = ({ onUpgradeClick }: IntegrationsFooterProps) => {
  const { currentPlan } = usePlanPermissions();

  return (
    <>
      {/* Help Section */}
      <Card className="bg-gradient-to-l from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
            <Settings className="h-5 w-5" />
            🚀 טיפים לאינטגרציות מוצלחות
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
            <div className="space-y-2">
              <h4 className="font-medium">מומלץ להתחיל עם:</h4>
              <ul className="space-y-1">
                <li>• יומן Google (סנכרון תורים)</li>
                <li>• הודעות SMS (תזכורות)</li>
                <li>• אימייל מרקטינג (שמירת קשר)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">לאחר מכן:</h4>
              <ul className="space-y-1">
                <li>• WhatsApp Business (תקשורת מהירה)</li>
                <li>• רשתות חברתיות (חשיפה)</li>
                <li>• אינטגרציות מתקדמות נוספות</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      {currentPlan === 'starter' && (
        <Card className="bg-gradient-to-l from-primary/10 to-purple-200/50 border-primary/30">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-primary mb-2">
              שדרגי לתכנית מתקדמת ופתחי את כל האינטגרציות
            </h3>
            <p className="text-muted-foreground mb-4">
              קבלי גישה לכל האינטגרציות, תכונות מתקדמות ותמיכה VIP
            </p>
            <Button 
              size="lg" 
              onClick={() => onUpgradeClick('general')}
              className="gap-2"
            >
              <ArrowUp className="h-5 w-5" />
              שדרגי את התכנית שלך
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default IntegrationsFooter;
