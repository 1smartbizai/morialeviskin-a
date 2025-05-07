
import React from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Treatment } from '@/hooks/useBookingFlow';
import { useBookingFlow } from '@/hooks/useBookingFlow';

interface BookingStepThreeProps {
  selectedTreatment: Treatment | null;
  selectedDate: Date | undefined;
  selectedTime: string | undefined;
  onSelectTime: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const BookingStepThree: React.FC<BookingStepThreeProps> = ({
  selectedTreatment,
  selectedDate,
  selectedTime,
  onSelectTime,
  onNext,
  onBack
}) => {
  const { availableTimeSlots } = useBookingFlow();
  
  // Group time slots by availability
  const availableSlots = availableTimeSlots.filter(slot => slot.available);
  const unavailableSlots = availableTimeSlots.filter(slot => !slot.available);
  
  return (
    <div className="space-y-6">
      {selectedTreatment && selectedDate && (
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <h3 className="font-medium">הטיפול שבחרת: {selectedTreatment.name}</h3>
          <p className="text-sm mt-1">
            תאריך: {format(selectedDate, "EEEE, d בMMMM yyyy", { locale: he })}
          </p>
          <p className="text-sm text-purple-800 mt-2">אנא בחרי שעה פנויה מהרשימה</p>
        </div>
      )}
      
      <div className="space-y-4">
        <h3 className="font-medium">שעות פנויות:</h3>
        {availableSlots.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {availableSlots.map((slot) => (
              <Card
                key={slot.time}
                className={`cursor-pointer transition-all text-center p-3 ${
                  selectedTime === slot.time 
                  ? 'border-2 border-beauty-primary bg-beauty-accent/10 shadow-md' 
                  : 'hover:border-beauty-accent'
                }`}
                onClick={() => onSelectTime(slot.time)}
              >
                <span className="text-lg">{slot.time}</span>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">אין שעות פנויות ביום זה</p>
        )}
        
        {unavailableSlots.length > 0 && (
          <>
            <h3 className="font-medium mt-6">שעות תפוסות:</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {unavailableSlots.map((slot) => (
                <Card
                  key={slot.time}
                  className="text-center p-3 bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  <span className="text-lg">{slot.time}</span>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          חזרה
        </Button>
        <Button
          onClick={onNext}
          disabled={!selectedTime}
          className={!selectedTime ? 'opacity-50 cursor-not-allowed' : ''}
        >
          המשך לאישור
        </Button>
      </div>
    </div>
  );
};

export default BookingStepThree;
