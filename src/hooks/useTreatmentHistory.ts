
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { parseISO } from "date-fns";
import { TreatmentHistoryItem, TreatmentFilter } from "@/types/treatmentHistory";
import { formatAttachments } from "@/utils/treatmentAttachments";
import { 
  getClientId, 
  fetchAppointments, 
  fetchBusinessOwners, 
  fetchTreatmentPrices,
  fetchAvailableTreatments as fetchTreatmentsList
} from "@/services/treatmentHistoryService";

export type { TreatmentHistoryItem, TreatmentFilter };

export const useTreatmentHistory = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [treatmentHistory, setTreatmentHistory] = useState<TreatmentHistoryItem[]>([]);
  const [availableTreatments, setAvailableTreatments] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState<TreatmentFilter>({});
  
  // Fetch treatment history based on filters
  const fetchTreatmentHistory = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Get client ID and appointments
      const clientId = await getClientId(user.id);
      const appointments = await fetchAppointments(clientId, filters);
      
      if (appointments.length === 0) {
        setTreatmentHistory([]);
        setIsLoading(false);
        return;
      }
      
      // Get business owner names and treatment prices
      const businessOwnerIds = [...new Set(appointments.map(app => app.business_owner_id))];
      const businessOwners = await fetchBusinessOwners(businessOwnerIds);
      
      const treatmentIds = [...new Set(appointments
        .map(app => app.treatment_id)
        .filter(id => id !== null))] as string[];
      
      const treatments = await fetchTreatmentPrices(treatmentIds);
      
      // Format appointments data
      const history: TreatmentHistoryItem[] = appointments.map(appointment => {
        const businessOwner = businessOwners?.find(bo => bo.id === appointment.business_owner_id);
        const treatment = treatments?.find(t => t.id === appointment.treatment_id);
        
        const businessOwnerName = businessOwner
          ? `${businessOwner.first_name} ${businessOwner.last_name}`
          : undefined;
        
        // Format the attachments using the updated utility function
        const formattedAttachments = formatAttachments(appointment.attachments);
        
        return {
          id: appointment.id,
          treatmentName: appointment.treatment_name,
          appointmentDate: parseISO(appointment.appointment_date),
          appointmentStatus: appointment.status,
          businessOwnerName,
          therapistNotes: appointment.therapist_notes,
          price: treatment?.price || 0,
          attachments: formattedAttachments
        };
      });
      
      setTreatmentHistory(history);
      
    } catch (error) {
      console.error("Error fetching treatment history:", error);
      toast({
        title: "שגיאה בטעינת היסטורית טיפולים",
        description: "לא ניתן לטעון את היסטורית הטיפולים כרגע. נא לנסות שוב מאוחר יותר",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch available treatments for filtering
  const fetchAvailableTreatments = async () => {
    if (!user) return;
    
    try {
      const clientId = await getClientId(user.id);
      const treatments = await fetchTreatmentsList(clientId);
      setAvailableTreatments(treatments);
    } catch (error) {
      console.error("Error fetching available treatments:", error);
    }
  };
  
  // Effect to fetch initial data
  useEffect(() => {
    if (user) {
      fetchTreatmentHistory();
      fetchAvailableTreatments();
    }
  }, [user, filters]);
  
  // Update filters
  const updateFilters = (newFilters: Partial<TreatmentFilter>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  return {
    isLoading,
    treatmentHistory,
    availableTreatments,
    filters,
    updateFilters,
    refreshTreatmentHistory: fetchTreatmentHistory,
  };
};
