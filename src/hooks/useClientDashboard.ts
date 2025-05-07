
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Appointment } from "@/types/appointments";
import type { TreatmentHistoryItem } from "@/types/treatmentHistory";

interface ClientData {
  id: string;
  first_name: string;
  last_name: string;
  points?: number;
  pending_payment?: number;
}

interface LoyaltyData {
  total_points: number;
  next_reward_threshold?: number;
}

interface SkinProfile {
  attributes: string[];
  lastQuestionDate?: string;
  answeredQuestions: any[];
}

interface PendingPayment {
  amount: number;
  treatmentId: string;
  treatmentName: string;
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
  const [treatmentHistory, setTreatmentHistory] = useState<TreatmentHistoryItem[] | null>(null);
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [loyalty, setLoyalty] = useState<LoyaltyData | null>(null);
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

        // Mock treatment history data
        const mockTreatmentHistory = [
          {
            id: "history-1",
            treatmentName: "טיפול פנים מעמיק",
            appointmentDate: new Date(),
            appointmentStatus: "completed",
            price: 300,
            attachments: []
          },
          {
            id: "history-2",
            treatmentName: "טיפול אקנה",
            appointmentDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
            appointmentStatus: "completed",
            price: 250,
            attachments: []
          }
        ];

        // Mock pending payment
        const mockPendingPayment = {
          amount: 350,
          treatmentId: "treatment-1",
          treatmentName: "טיפול פנים משולב"
        };

        // Mock skin profile
        const mockSkinProfile = {
          attributes: ["רגיש", "יבש", "נוטה לאדמומיות"],
          lastQuestionDate: new Date().toISOString(),
          answeredQuestions: []
        };

        if (clientData) {
          setClientData({
            ...clientData,
            points: loyaltyData?.total_points || 0,
            pending_payment: mockPendingPayment.amount // Mock pending payment amount
          });
        }
        
        // Set mock appointment data
        setNextAppointment(mockAppointment);
        setTreatmentHistory(mockTreatmentHistory);
        setPendingPayment(mockPendingPayment);
        setSkinProfile(mockSkinProfile);
        setLoyalty({
          total_points: loyaltyData?.total_points || 0,
          next_reward_threshold: 100
        });
        
        // Set random tip
        setTip(tips[Math.floor(Math.random() * tips.length)]);
        
      } catch (error) {
        console.error("Error fetching client dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientData();
  }, [navigate]);

  return { 
    clientData, 
    nextAppointment, 
    treatmentHistory, 
    pendingPayment, 
    skinProfile, 
    loyalty, 
    tip, 
    isLoading 
  };
};
