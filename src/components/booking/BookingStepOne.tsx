
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Treatment } from '@/hooks/useBookingFlow';
import { formatCurrency } from '@/utils/formatters';

interface BookingStepOneProps {
  treatments: Treatment[];
  selectedTreatment: Treatment | null;
  onSelectTreatment: (treatment: Treatment) => void;
  onNext: () => void;
  onCancel: () => void;
}

const BookingStepOne: React.FC<BookingStepOneProps> = ({ 
  treatments, 
  selectedTreatment, 
  onSelectTreatment, 
  onNext,
  onCancel 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
        <p className="text-purple-800">אנא בחרי את הטיפול המבוקש מהרשימה המותאמת לך אישית</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {treatments.map((treatment) => (
          <Card 
            key={treatment.id} 
            className={`cursor-pointer transition-all ${
              selectedTreatment?.id === treatment.id
                ? 'border-2 border-beauty-primary shadow-md'
                : 'hover:border-beauty-accent'
            }`}
            onClick={() => onSelectTreatment(treatment)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{treatment.name}</h3>
                  {treatment.description && (
                    <p className="text-muted-foreground text-sm mt-1">{treatment.description}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(treatment.price)}</p>
                  <p className="text-sm text-muted-foreground">{treatment.duration} דקות</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onCancel}>
          ביטול
        </Button>
        <Button 
          onClick={onNext}
          disabled={!selectedTreatment}
          className={!selectedTreatment ? 'opacity-50 cursor-not-allowed' : ''}
        >
          המשך לבחירת תאריך
        </Button>
      </div>
    </div>
  );
};

export default BookingStepOne;
