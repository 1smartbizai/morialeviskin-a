
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchClientSkinProfile, 
  fetchNextQuestion, 
  saveAnswer,
  fetchProductSuggestions,
  fetchTreatmentSuggestions
} from "@/services/skincareService";
import { 
  SkinProfile, 
  SkinQuestion, 
  SkinAnswer, 
  SkinProductSuggestion,
  SkinTreatmentSuggestion
} from "@/types/skincare";

export const useSkinProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<SkinQuestion | null>(null);
  const [productSuggestions, setProductSuggestions] = useState<SkinProductSuggestion[]>([]);
  const [treatmentSuggestions, setTreatmentSuggestions] = useState<SkinTreatmentSuggestion[]>([]);
  
  // Fetch client ID from user
  const getClientId = async (): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const clientId = user.id; // Assuming user.id is the client ID
      return clientId;
    } catch (error) {
      console.error("Error fetching client ID:", error);
      return null;
    }
  };
  
  // Load skin profile data
  const loadSkinProfile = async () => {
    const clientId = await getClientId();
    if (!clientId) return;
    
    setIsLoading(true);
    
    try {
      // Get profile
      const profile = await fetchClientSkinProfile(clientId);
      setSkinProfile(profile || { clientId, attributes: [], answeredQuestions: [] });
      
      // Get next question
      const question = await fetchNextQuestion(clientId);
      setCurrentQuestion(question);
      
      // Get product suggestions
      const products = await fetchProductSuggestions(clientId);
      setProductSuggestions(products);
      
      // Get treatment suggestions
      const treatments = await fetchTreatmentSuggestions(clientId);
      setTreatmentSuggestions(treatments);
    } catch (error) {
      console.error("Error loading skin profile:", error);
      toast({
        title: "שגיאה בטעינת פרופיל עור",
        description: "לא ניתן לטעון את פרופיל העור שלך כרגע. נא לנסות שוב מאוחר יותר",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Submit answer to current question
  const submitAnswer = async (answer: string): Promise<boolean> => {
    const clientId = await getClientId();
    if (!clientId || !currentQuestion) return false;
    
    try {
      // Save the answer
      const savedAnswer = await saveAnswer({
        questionId: currentQuestion.id,
        clientId,
        answer
      });
      
      if (!savedAnswer) return false;
      
      // Update local state
      setSkinProfile(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          lastQuestionDate: savedAnswer.answeredAt,
          answeredQuestions: [savedAnswer, ...prev.answeredQuestions]
        };
      });
      
      // Get next question
      const nextQuestion = await fetchNextQuestion(clientId);
      setCurrentQuestion(nextQuestion);
      
      // Reload profile to get updated attributes (server-side logic may have updated them)
      loadSkinProfile();
      
      toast({
        title: "תשובה נשמרה",
        description: "תשובתך נשמרה בהצלחה",
        variant: "default",
      });
      
      return true;
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast({
        title: "שגיאה בשמירת תשובה",
        description: "לא ניתן לשמור את תשובתך כרגע. נא לנסות שוב מאוחר יותר",
        variant: "destructive",
      });
      return false;
    }
  };
  
  // Load data on component mount
  useEffect(() => {
    if (user) {
      loadSkinProfile();
    }
  }, [user]);
  
  return {
    isLoading,
    skinProfile,
    currentQuestion,
    productSuggestions,
    treatmentSuggestions,
    submitAnswer,
    refreshProfile: loadSkinProfile
  };
};
