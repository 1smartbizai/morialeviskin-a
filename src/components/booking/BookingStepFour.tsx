
import React, { useState } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from '@/utils/formatters';
import { Treatment } from '@/hooks/useBookingFlow';
import { Calendar, Clock, Check, AlertCircle } from 'lucide-react';

interface BookingStepFourProps {
  selectedTreatment: Treatment | null;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onConfirm: () => void;
  onBack: () => void;
}

const BookingStepFour: React.FC<BookingStepFourProps> = ({
  selectedTreatment,
  selectedDate,
  selectedTime,
  onConfirm,
  onBack
}) => {
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addToCalendar, setAddToCalendar] = useState<boolean>(true);
  
  const handleConfirm = async () => {
    setIsLoading(true);
    
    try {
      await onConfirm();
      
      if (addToCalendar) {
        // Create calendar event URL (Google Calendar)
        if (selectedTreatment && selectedDate && selectedTime) {
          const [hours, minutes] = selectedTime.split(':').map(Number);
          const startDate = new Date(selectedDate);
          startDate.setHours(hours, minutes, 0, 0);
          
          const endDate = new Date(startDate);
          endDate.setMinutes(startDate.getMinutes() + (selectedTreatment.duration || 60));
          
          const eventTitle = `טיפול: ${selectedTreatment.name}`;
          const eventDetails = selectedTreatment.description || '';
          
          const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${startDate.toISOString().replace(/-|:|\.\d+/g, '')}/${endDate.toISOString().replace(/-|:|\.\d+/g, '')}&details=${encodeURIComponent(eventDetails)}`;
          
          window.open(googleCalendarUrl, '_blank');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!selectedTreatment || !selectedDate || !selectedTime) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-medium mt-4">חסרים פרטים להזמנה</h3>
        <p className="text-muted-foreground mt-2">
          אנא חזרי לשלבים הקודמים כדי להשלים את הפרטים החסרים
        </p>
        <Button variant="outline" onClick={onBack} className="mt-6">
          חזרה
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg border border-green-100">
        <h3 className="font-medium mb-2">סיכום הזמנה</h3>
        <p className="text-sm text-green-800">
          נא לוודא שכל הפרטים נכונים לפני אישור התור
        </p>
      </div>
      
      <Card className="overflow-hidden">
        <div className="bg-beauty-primary text-white p-4">
          <h3 className="text-xl font-medium">פרטי התור</h3>
        </div>
        <CardContent className="p-5 space-y-4">
          <div className="flex justify-between items-center pb-3 border-b">
            <div className="font-medium text-xl">{selectedTreatment.name}</div>
            <div className="text-xl">{formatCurrency(selectedTreatment.price)}</div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-5 w-5 ml-2" />
            <span>{format(selectedDate, "EEEE, d בMMMM yyyy", { locale: he })}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 ml-2" />
            <span>
              {selectedTime} ({selectedTreatment.duration} דקות)
            </span>
          </div>
          
          {selectedTreatment.description && (
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">{selectedTreatment.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="space-y-2">
        <h4 className="font-medium">הערות נוספות (לא חובה)</h4>
        <Textarea 
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="הוסיפי הערות מיוחדות לגבי הטיפול, כמו העדפות או בקשות מיוחדות"
          className="min-h-[100px]"
        />
      </div>
      
      <div className="flex items-center bg-purple-50 p-4 rounded-lg">
        <input
          type="checkbox"
          id="add-to-calendar"
          checked={addToCalendar}
          onChange={() => setAddToCalendar(!addToCalendar)}
          className="ml-2 h-4 w-4"
        />
        <label htmlFor="add-to-calendar">
          הוסיפי את התור ליומן שלך
        </label>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          חזרה
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={isLoading}
          className="min-w-[150px]"
        >
          {isLoading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent ml-2"></div>
              מאשרת...
            </span>
          ) : (
            <span className="flex items-center">
              <Check className="ml-2 h-4 w-4" />
              אישור הזמנה
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BookingStepFour;
