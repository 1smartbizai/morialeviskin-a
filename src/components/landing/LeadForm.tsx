
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const LeadForm: React.FC = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [business, setBusiness] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "פנייתך התקבלה",
        description: "צוות Bellevo יחזור אליך בהקדם",
        duration: 5000,
      });
      setName('');
      setContact('');
      setBusiness('');
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white rounded-xl p-6 shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2 text-center">השאירו פרטים לתיאום הדגמה</h3>
        <p className="text-smartbiz-muted text-center text-sm">צוות Bellevo יחזור אליכם בהקדם</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">שם מלא</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="שם מלא"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">טלפון / דוא"ל</label>
          <Input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="טלפון או כתובת אימייל"
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">סוג העסק</label>
          <Input
            type="text"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            placeholder="קוסמטיקה, עיצוב שיער, עיצוב ציפורניים..."
            className="w-full"
          />
        </div>

        <Button 
          type="submit" 
          className="smartbiz-btn-primary w-full mt-4"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'שולח פרטים...' : 'שליחת פרטים'}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
