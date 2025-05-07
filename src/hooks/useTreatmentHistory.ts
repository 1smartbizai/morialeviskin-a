import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, parseISO } from "date-fns";
import { he } from "date-fns/locale";
import { formatCurrency } from "@/utils/formatters";

export interface TreatmentHistoryItem {
  id: string;
  treatmentName: string;
  appointmentDate: Date;
  appointmentStatus: string;
  businessOwnerName?: string;
  therapistNotes?: string | null;
  price: number;
  attachments: {
    name: string;
    type: string;
    url: string;
  }[];
}

export interface TreatmentFilter {
  treatmentId?: string | null;
  fromDate?: Date | null;
  toDate?: Date | null;
}

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
      
      // First get the client ID for the current user
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .single();
        
      if (clientError) {
        throw new Error("לא נמצאו נתוני לקוח");
      }
      
      // Build query for appointments with filters
      let query = supabase
        .from("appointments")
        .select(`
          id,
          treatment_name,
          appointment_date,
          status,
          therapist_notes,
          attachments,
          business_owner_id,
          treatment_id
        `)
        .eq("client_id", clientData.id)
        .order("appointment_date", { ascending: false });
      
      // Apply filters if they exist
      if (filters.treatmentId) {
        query = query.eq("treatment_id", filters.treatmentId);
      }
      
      if (filters.fromDate) {
        const fromDateStr = filters.fromDate.toISOString();
        query = query.gte("appointment_date", fromDateStr);
      }
      
      if (filters.toDate) {
        const toDateStr = new Date(filters.toDate.setHours(23, 59, 59, 999)).toISOString();
        query = query.lte("appointment_date", toDateStr);
      }
      
      const { data: appointments, error: appointmentsError } = await query;
      
      if (appointmentsError) {
        throw appointmentsError;
      }
      
      if (!appointments || appointments.length === 0) {
        setTreatmentHistory([]);
        setIsLoading(false);
        return;
      }
      
      // Get business owner names for the appointments
      const businessOwnerIds = [...new Set(appointments.map(app => app.business_owner_id))];
      
      const { data: businessOwners, error: bOwnersError } = await supabase
        .from("business_owners")
        .select("id, first_name, last_name")
        .in("id", businessOwnerIds);
        
      if (bOwnersError) {
        console.error("Error fetching business owners:", bOwnersError);
      }
      
      // Get treatment prices
      const treatmentIds = [...new Set(appointments
        .map(app => app.treatment_id)
        .filter(id => id !== null))] as string[];
      
      const { data: treatments, error: treatmentsError } = await supabase
        .from("treatments")
        .select("id, price")
        .in("id", treatmentIds);
      
      if (treatmentsError) {
        console.error("Error fetching treatment prices:", treatmentsError);
      }
      
      // Format appointments data
      const history = appointments.map(appointment => {
        const businessOwner = businessOwners?.find(bo => bo.id === appointment.business_owner_id);
        const treatment = treatments?.find(t => t.id === appointment.treatment_id);
        
        const businessOwnerName = businessOwner
          ? `${businessOwner.first_name} ${businessOwner.last_name}`
          : undefined;
        
        // Process attachments to ensure they match the expected format
        const formattedAttachments = Array.isArray(appointment.attachments) 
          ? appointment.attachments.map((attachment: any) => {
              // If attachment is already in the correct format, use it
              if (attachment && typeof attachment === 'object' && 'name' in attachment && 'type' in attachment && 'url' in attachment) {
                return {
                  name: attachment.name,
                  type: attachment.type,
                  url: attachment.url
                };
              }
              // Otherwise, create a placeholder or extract information if possible
              return {
                name: typeof attachment === 'object' && attachment?.name ? attachment.name : 'Attachment',
                type: typeof attachment === 'object' && attachment?.type ? attachment.type : 'unknown',
                url: typeof attachment === 'string' ? attachment : 
                     (typeof attachment === 'object' && attachment?.url ? attachment.url : '')
              };
            })
          : [];
        
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
      const { data: clientData, error: clientError } = await supabase
        .from("clients")
        .select("id")
        .eq("user_id", user.id)
        .single();
        
      if (clientError) {
        throw new Error("לא נמצאו נתוני לקוח");
      }
      
      const { data: appointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select(`treatment_id, treatment_name`)
        .eq("client_id", clientData.id)
        .not("treatment_id", "is", null);
        
      if (appointmentsError) {
        throw appointmentsError;
      }
      
      // Create unique list of treatments
      const uniqueTreatments = Array.from(
        new Map(
          appointments
            .filter(app => app.treatment_id)
            .map(app => [app.treatment_id, { id: app.treatment_id, name: app.treatment_name }])
        ).values()
      );
      
      setAvailableTreatments(uniqueTreatments);
      
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
