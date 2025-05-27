
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TourStep {
  id: string;
  title: string;
  content: string;
  targetSelector?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
  primaryColor: string;
}

const OnboardingTour = ({ onComplete, onSkip, primaryColor }: OnboardingTourProps) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const tourSteps: TourStep[] = [
    {
      id: "welcome",
      title: "ברוכה הבאה למערכת הניהול שלך!",
      content: "אני אלווה אותך דרך התכונות החשובות במערכת כדי שתוכלי להתחיל לעבוד בקלות",
      position: "center"
    },
    {
      id: "sidebar",
      title: "תפריט הניווט",
      content: "כאן תמצאי את כל האזורים במערכת - לקוחות, תורים, תשלומים ועוד",
      targetSelector: "aside",
      position: "right"
    },
    {
      id: "clients",
      title: "ניהול לקוחות",
      content: "התחילי כאן - הוסיפי את הלקוחות שלך ונהלי את הפרטים שלהן",
      targetSelector: "a[href='/admin/clients']",
      position: "right"
    },
    {
      id: "appointments",
      title: "לוח תורים",
      content: "קבעי תורים, ערכי ונהלי את לוח הזמנים שלך בצורה נוחה",
      targetSelector: "a[href='/admin/appointments']",
      position: "right"
    },
    {
      id: "business-management",
      title: "ניהול עסק",
      content: "הגדירי את הטיפולים שלך, מחירים ופרטי העסק",
      targetSelector: "a[href='/admin/business-management']",
      position: "right"
    },
    {
      id: "complete",
      title: "מוכנה להתחיל!",
      content: "עכשיו את יכולה להתחיל לעבוד עם המערכת. אם תצטרכי עזרה, תמיד יש לך את מרכז העזרה",
      position: "center"
    }
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = async () => {
    // Mark tour as completed in database
    if (user?.id) {
      await supabase
        .from('business_owners')
        .update({
          metadata: {
            hasCompletedOnboardingTour: true,
            tourCompletedAt: new Date().toISOString()
          }
        })
        .eq('user_id', user.id);
    }
    
    setIsVisible(false);
    onComplete();
  };

  const skipTour = async () => {
    // Mark tour as skipped in database
    if (user?.id) {
      await supabase
        .from('business_owners')
        .update({
          metadata: {
            hasCompletedOnboardingTour: true,
            tourSkippedAt: new Date().toISOString()
          }
        })
        .eq('user_id', user.id);
    }
    
    setIsVisible(false);
    onSkip();
  };

  const currentTourStep = tourSteps[currentStep];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" dir="rtl">
      {/* Overlay */}
      <div className="absolute inset-0" onClick={skipTour} />
      
      {/* Tour Card */}
      <Card className="relative w-full max-w-md mx-4 z-10">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" style={{ color: primaryColor }} />
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} מתוך {tourSteps.length}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={skipTour}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2" style={{ color: primaryColor }}>
              {currentTourStep.title}
            </h3>
            <p className="text-muted-foreground">
              {currentTourStep.content}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((currentStep + 1) / tourSteps.length) * 100}%`,
                backgroundColor: primaryColor 
              }}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              קודם
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={skipTour}>
                דלג
              </Button>
              <Button 
                onClick={handleNext}
                style={{ backgroundColor: primaryColor }}
              >
                {currentStep === tourSteps.length - 1 ? 'סיום' : 'הבא'}
                {currentStep < tourSteps.length - 1 && (
                  <ArrowLeft className="mr-2 h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingTour;
