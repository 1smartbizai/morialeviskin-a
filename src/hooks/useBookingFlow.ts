
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format, addMinutes } from "date-fns";
import { he } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Treatment {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export const useBookingFlow = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [suggestedTreatments, setSuggestedTreatments] = useState<Treatment[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [clientData, setClientData] = useState<any | null>(null);
  
  // Fetch treatments and client data
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        navigate("/client/auth");
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Get treatments
        const { data: treatmentsData, error: treatmentsError } = await supabase
          .from("treatments")
          .select("*")
          .eq("is_visible", true);
          
        if (treatmentsError) throw treatmentsError;
        
        // Get client data
        const { data: clientData, error: clientError } = await supabase
          .from("clients")
          .select(`
            id, 
            first_name, 
            last_name,
            skin_goals
          `)
          .eq("user_id", user.id)
          .single();
          
        if (clientError) throw clientError;
        
        // Get recent appointments to provide suggestions
        const { data: recentAppointments, error: appointmentsError } = await supabase
          .from("appointments")
          .select("treatment_id, treatment_name")
          .eq("client_id", clientData.id)
          .order("appointment_date", { ascending: false })
          .limit(3);
        
        if (appointmentsError) throw appointmentsError;
        
        // Transform treatments data
        const formattedTreatments = treatmentsData.map((treatment: any) => ({
          id: treatment.id,
          name: treatment.name,
          duration: treatment.duration,
          price: treatment.price,
          description: treatment.description
        }));
        
        setTreatments(formattedTreatments);
        setClientData(clientData);
        
        // Create suggested treatments based on history and skin goals
        let suggested = [...formattedTreatments];
        
        // If client has recent appointments, prioritize those treatments
        if (recentAppointments && recentAppointments.length > 0) {
          const recentTreatmentIds = recentAppointments.map((a: any) => a.treatment_id);
          
          // Move recent treatments to the top
          suggested = [
            ...formattedTreatments.filter(t => recentTreatmentIds.includes(t.id)),
            ...formattedTreatments.filter(t => !recentTreatmentIds.includes(t.id))
          ];
        }
        
        // Further personalize if skin goals are present
        if (clientData.skin_goals) {
          // This is a simple implementation - in a real app you might have a more
          // sophisticated matching algorithm based on treatment tags or categories
          const skinGoalsLower = clientData.skin_goals.toLowerCase();
          
          // Prioritize treatments that might match skin goals based on name/description
          suggested = suggested.sort((a, b) => {
            const aMatchesGoals = (a.name.toLowerCase().includes(skinGoalsLower) || 
                                   (a.description && a.description.toLowerCase().includes(skinGoalsLower)));
            const bMatchesGoals = (b.name.toLowerCase().includes(skinGoalsLower) || 
                                   (b.description && b.description.toLowerCase().includes(skinGoalsLower)));
            
            if (aMatchesGoals && !bMatchesGoals) return -1;
            if (!aMatchesGoals && bMatchesGoals) return 1;
            return 0;
          });
        }
        
        setSuggestedTreatments(suggested);
      } catch (error) {
        console.error("Error fetching booking data:", error);
        toast({
          title: "שגיאה בטעינת נתונים",
          description: "לא ניתן לטעון את הטיפולים כרגע. נא לנסות שוב מאוחר יותר",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user, navigate, toast]);
  
  // Fetch available time slots when date and treatment are selected
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate || !selectedTreatment || !clientData) return;
      
      try {
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);
        
        // Get business owner ID from a client's previous appointment or use a default
        const { data: businessOwner } = await supabase
          .from("appointments")
          .select("business_owner_id")
          .eq("client_id", clientData.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();
          
        const businessOwnerId = businessOwner?.business_owner_id;
        
        // If no previous appointment found, get any business owner
        let defaultBusinessOwnerId = null;
        
        if (!businessOwnerId) {
          // Get any business owner
          const { data: anyBusinessOwner } = await supabase
            .from("business_owners")
            .select("id")
            .limit(1)
            .single();
            
          if (!anyBusinessOwner) {
            throw new Error("לא נמצאו בעלי עסק במערכת");
          }
          defaultBusinessOwnerId = anyBusinessOwner.id;
        }
        
        // Use business owner id from previous appointment or the default one
        const ownerIdToUse = businessOwnerId || defaultBusinessOwnerId;
        
        // Get available time slots
        const { data: availableSlots, error: slotsError } = await supabase
          .from("available_timeslots")
          .select("*")
          .eq("business_owner_id", ownerIdToUse)
          .gte("start_time", startOfDay.toISOString())
          .lte("start_time", endOfDay.toISOString())
          .eq("is_available", true);
          
        if (slotsError) throw slotsError;
        
        // Get existing appointments to check for conflicts
        const { data: existingAppointments, error: appError } = await supabase
          .from("appointments")
          .select("*")
          .eq("business_owner_id", ownerIdToUse)
          .gte("appointment_date", startOfDay.toISOString())
          .lte("appointment_date", endOfDay.toISOString())
          .neq("status", "cancelled");
          
        if (appError) throw appError;
        
        // Generate time slots from 8 AM to 8 PM in 30-minute intervals
        const slots: TimeSlot[] = [];
        const treatmentDurationMs = selectedTreatment.duration * 60 * 1000;
        
        for (let hour = 8; hour <= 20; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const slotTime = new Date(selectedDate);
            slotTime.setHours(hour, minute, 0, 0);
            
            // Don't show slots in the past
            if (slotTime < new Date()) continue;
            
            // Format time for display
            const timeString = format(slotTime, "HH:mm", { locale: he });
            
            // Check if the time slot is available based on business hours
            const isInBusinessHours = availableSlots.some(slot => {
              const slotStart = new Date(slot.start_time);
              const slotEnd = new Date(slot.end_time);
              return slotTime >= slotStart && slotTime <= slotEnd;
            });
            
            // Check for conflicts with existing appointments
            const hasConflict = existingAppointments.some(appointment => {
              const appointmentStart = new Date(appointment.appointment_date);
              const appointmentEnd = new Date(appointment.end_time);
              
              const potentialEnd = new Date(slotTime.getTime() + treatmentDurationMs);
              
              // Check if there's an overlap
              return (
                (slotTime >= appointmentStart && slotTime < appointmentEnd) ||
                (potentialEnd > appointmentStart && potentialEnd <= appointmentEnd) ||
                (slotTime <= appointmentStart && potentialEnd >= appointmentEnd)
              );
            });
            
            slots.push({
              time: timeString,
              available: isInBusinessHours && !hasConflict
            });
          }
        }
        
        setAvailableTimeSlots(slots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        toast({
          title: "שגיאה בטעינת זמנים פנויים",
          description: "לא ניתן לטעון את הזמנים הפנויים כרגע. נא לנסות שוב מאוחר יותר",
          variant: "destructive",
        });
        setAvailableTimeSlots([]);
      }
    };
    
    if (selectedDate && selectedTreatment) {
      fetchTimeSlots();
    }
  }, [selectedDate, selectedTreatment, clientData, toast]);
  
  // Book the appointment
  const bookAppointment = async () => {
    if (!selectedTreatment || !selectedDate || !selectedTime || !user || !clientData) {
      toast({
        title: "שגיאה בהזמנת תור",
        description: "חסרים פרטים להשלמת ההזמנה",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Set appointment date from selected date and time
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const appointmentDate = new Date(selectedDate);
      appointmentDate.setHours(hours, minutes, 0, 0);
      
      // Calculate end time based on treatment duration
      const endTime = addMinutes(appointmentDate, selectedTreatment.duration);
      
      // Get business owner ID
      const { data: businessOwner } = await supabase
        .from("appointments")
        .select("business_owner_id")
        .eq("client_id", clientData.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
        
      let businessOwnerId = businessOwner?.business_owner_id;
      
      if (!businessOwnerId) {
        // If no previous appointment, get any business owner
        const { data: anyBusinessOwner } = await supabase
          .from("business_owners")
          .select("id")
          .limit(1)
          .single();
          
        businessOwnerId = anyBusinessOwner?.id;
      }
      
      // Insert appointment
      const { data, error } = await supabase
        .from("appointments")
        .insert({
          client_id: clientData.id,
          business_owner_id: businessOwnerId,
          treatment_id: selectedTreatment.id,
          treatment_name: selectedTreatment.name,
          appointment_date: appointmentDate.toISOString(),
          end_time: endTime.toISOString(),
          status: "confirmed"
        })
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "התור נקבע בהצלחה",
        description: `התור שלך ל${selectedTreatment.name} נקבע ליום ${format(appointmentDate, "dd/MM/yyyy", { locale: he })} בשעה ${selectedTime}`,
      });
      
      navigate("/client/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: "שגיאה בהזמנת תור",
        description: "לא ניתן לקבוע את התור כרגע. נא לנסות שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  };
  
  return {
    currentStep,
    setCurrentStep,
    treatments,
    suggestedTreatments,
    selectedTreatment,
    setSelectedTreatment,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    availableTimeSlots,
    isLoading,
    bookAppointment
  };
};
