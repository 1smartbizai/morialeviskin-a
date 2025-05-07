
import { supabase } from "@/integrations/supabase/client";
import { TreatmentFilter } from "@/types/treatmentHistory";

/**
 * Gets the client ID for the current user
 */
export const getClientId = async (userId: string) => {
  const { data, error } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", userId)
    .single();
    
  if (error) {
    throw new Error("לא נמצאו נתוני לקוח");
  }
  
  return data.id;
};

/**
 * Fetches appointment history with optional filters
 */
export const fetchAppointments = async (clientId: string, filters: TreatmentFilter) => {
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
    .eq("client_id", clientId)
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
  
  const { data, error } = await query;
  
  if (error) {
    throw error;
  }
  
  return data || [];
};

/**
 * Fetches business owners for a list of appointments
 */
export const fetchBusinessOwners = async (businessOwnerIds: string[]) => {
  if (businessOwnerIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from("business_owners")
    .select("id, first_name, last_name")
    .in("id", businessOwnerIds);
    
  if (error) {
    console.error("Error fetching business owners:", error);
    return [];
  }
  
  return data;
};

/**
 * Fetches treatment prices for a list of treatments
 */
export const fetchTreatmentPrices = async (treatmentIds: string[]) => {
  if (treatmentIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from("treatments")
    .select("id, price")
    .in("id", treatmentIds);
  
  if (error) {
    console.error("Error fetching treatment prices:", error);
    return [];
  }
  
  return data;
};

/**
 * Fetches available treatments for a client
 */
export const fetchAvailableTreatments = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from("appointments")
      .select(`treatment_id, treatment_name`)
      .eq("client_id", clientId)
      .not("treatment_id", "is", null);
      
    if (error) {
      throw error;
    }
    
    // Create unique list of treatments
    const uniqueTreatments = Array.from(
      new Map(
        data
          .filter(app => app.treatment_id)
          .map(app => [app.treatment_id, { id: app.treatment_id, name: app.treatment_name }])
      ).values()
    );
    
    return uniqueTreatments;
    
  } catch (error) {
    console.error("Error fetching available treatments:", error);
    return [];
  }
};
