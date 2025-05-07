
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClientLayout from "@/components/layouts/ClientLayout";
import BookingStepOne from "@/components/booking/BookingStepOne";
import BookingStepTwo from "@/components/booking/BookingStepTwo";
import BookingStepThree from "@/components/booking/BookingStepThree";
import BookingStepFour from "@/components/booking/BookingStepFour";
import BookingStepper from "@/components/booking/BookingStepper";
import { useBookingFlow } from "@/hooks/useBookingFlow";
import { LoadingState } from "@/components/ui/loading-state";

const BookAppointment = () => {
  const navigate = useNavigate();
  const { 
    currentStep, 
    setCurrentStep,
    selectedTreatment,
    setSelectedTreatment,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    isLoading,
    bookAppointment,
    suggestedTreatments
  } = useBookingFlow();

  if (isLoading) {
    return <LoadingState message="טוען אפשרויות הזמנה..." />;
  }

  return (
    <ClientLayout>
      <div className="space-y-6" dir="rtl">
        <h1 className="text-2xl font-bold text-beauty-dark">קביעת תור חדש</h1>
        
        <BookingStepper currentStep={currentStep} />
        
        {currentStep === 1 && (
          <BookingStepOne 
            treatments={suggestedTreatments} 
            selectedTreatment={selectedTreatment}
            onSelectTreatment={setSelectedTreatment}
            onNext={() => setCurrentStep(2)}
            onCancel={() => navigate("/client/dashboard")}
          />
        )}
        
        {currentStep === 2 && (
          <BookingStepTwo 
            selectedTreatment={selectedTreatment}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        
        {currentStep === 3 && (
          <BookingStepThree 
            selectedTreatment={selectedTreatment}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}
        
        {currentStep === 4 && (
          <BookingStepFour 
            selectedTreatment={selectedTreatment}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onConfirm={bookAppointment}
            onBack={() => setCurrentStep(3)}
          />
        )}
      </div>
    </ClientLayout>
  );
};

export default BookAppointment;
