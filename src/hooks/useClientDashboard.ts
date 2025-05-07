
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Appointment } from "@/types/appointments";

interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  points?: number;
  pending_payment?: number;
}

const tips = [
  "טיפ: תזכירי לשתות לפחות 8 כוסות מים ביום לעור רענן וזוהר",
  "זכרי למרוח קרם הגנה גם בימי חורף",
  "מומלץ לגוון בשיגרת הטיפוח שלך מדי עונה",
  "טיפול קבוע אחת לחודש יכול לשפר משמעותית את מרקם העור",
];

export const useClientDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [tip, setTip] = useState<string>("");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/client/auth");
          return;
        }
        
        // Get client data
        const { data: clientData } = await supabase
          .from("clients")
          .select(`
            id, 
            first_name, 
            last_name
          `)
          .eq("id", user.id)
          .single();
          
        // Get loyalty data
        const { data: loyaltyData } = await supabase
          .from("client_loyalty")
          .select("total_points")
          .eq("client_id", user.id)
          .single();
        
        // Since the appointments table doesn't exist yet in our schema,
        // we'll mock the next appointment data for now
        // In a real implementation, you would fetch from the appointments table
        const mockAppointment = {
          id: "mock-appointment-1",
          client_id: user.id,
          treatment_name: "טיפול פנים מלא",
          appointment_date: new Date().toISOString(),
          status: "confirmed",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        if (clientData) {
          setClientData({
            ...clientData,
            points: loyaltyData?.total_points || 0,
            pending_payment: 0 // This would come from real payments data
          });
        }
        
        // Set mock appointment data
        setNextAppointment(mockAppointment);
        
        // Set random tip
        setTip(tips[Math.floor(Math.random() * tips.length)]);
        
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [navigate]);

  return { clientData, nextAppointment, tip, isLoading };
};
