
import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Treatment } from '@/hooks/useBookingFlow';

interface BookingStepTwoProps {
  selectedTreatment: Treatment | null;
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onNext: () => void;
  onBack: () => void;
}

const BookingStepTwo: React.FC<BookingStepTwoProps> = ({
  selectedTreatment,
  selectedDate,
  onSelectDate,
  onNext,
  onBack
}) => {
  // Disable past dates and today (assuming same-day bookings aren't allowed)
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  return (
    <div className="space-y-6">
      {selectedTreatment && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="font-medium mb-1">הטיפול שבחרת: {selectedTreatment.name}</h3>
          <p className="text-sm text-purple-800">אנא בחרי תאריך מהלוח</p>
        </div>
      )}
      
      <div className="flex justify-center border rounded-lg p-4 bg-white">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={onSelectDate}
          disabled={disabledDays}
          locale={he}
          className="rounded-md border"
        />
      </div>
      
      {selectedDate && (
        <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
          <p>
            בחרת את התאריך: <strong>{format(selectedDate, "EEEE, d בMMMM yyyy", { locale: he })}</strong>
          </p>
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          חזרה
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedDate}
          className={!selectedDate ? 'opacity-50 cursor-not-allowed' : ''}
        >
          המשך לבחירת שעה
        </Button>
      </div>
    </div>
  );
};

export default BookingStepTwo;
