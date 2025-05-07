
import { supabase } from "@/integrations/supabase/client";
import { SkinQuestion, SkinAnswer, SkinAttribute, SkinProfile } from "@/types/skincare";

export const fetchClientSkinProfile = async (clientId: string): Promise<SkinProfile | null> => {
  try {
    // Fetch the skin attributes
    const { data: attributes, error: attributesError } = await supabase
      .from("client_skin_attributes")
      .select("*")
      .eq("client_id", clientId);
    
    if (attributesError) throw attributesError;

    // Fetch the answered questions
    const { data: answers, error: answersError } = await supabase
      .from("client_skin_answers")
      .select("*")
      .eq("client_id", clientId)
      .order("answered_at", { ascending: false });
    
    if (answersError) throw answersError;

    // Format the data
    const formattedAttributes: SkinAttribute[] = attributes?.map(attr => ({
      category: attr.category,
      attribute: attr.attribute,
      value: attr.value,
      confidence: attr.confidence,
      updatedAt: new Date(attr.updated_at)
    })) || [];

    const formattedAnswers: SkinAnswer[] = answers?.map(ans => ({
      id: ans.id,
      questionId: ans.question_id,
      clientId: ans.client_id,
      answer: ans.answer,
      answeredAt: new Date(ans.answered_at)
    })) || [];

    const lastQuestionDate = formattedAnswers.length > 0 
      ? formattedAnswers[0].answeredAt 
      : undefined;

    return {
      clientId,
      attributes: formattedAttributes,
      lastQuestionDate,
      answeredQuestions: formattedAnswers
    };
  } catch (error) {
    console.error("Error fetching skin profile:", error);
    return null;
  }
};

export const fetchNextQuestion = async (clientId: string): Promise<SkinQuestion | null> => {
  try {
    // Get all questions
    const { data: questions, error: questionsError } = await supabase
      .from("skin_questions")
      .select("*")
      .eq("is_active", true)
      .order("order", { ascending: true });
    
    if (questionsError) throw questionsError;
    
    // Get already answered question ids
    const { data: answers, error: answersError } = await supabase
      .from("client_skin_answers")
      .select("question_id")
      .eq("client_id", clientId);
    
    if (answersError) throw answersError;
    
    const answeredQuestionIds = new Set(answers?.map(a => a.question_id));
    
    // Find first unanswered question
    const nextQuestion = questions?.find(q => !answeredQuestionIds.has(q.id));
    
    // If all questions have been answered, pick the oldest one to ask again
    const oldestQuestion = answers && answers.length > 0 && !nextQuestion
      ? questions?.find(q => q.id === answers[answers.length - 1]?.question_id)
      : null;
    
    if (!nextQuestion && !oldestQuestion) return null;
    
    return nextQuestion ? formatQuestion(nextQuestion) : formatQuestion(oldestQuestion);
  } catch (error) {
    console.error("Error fetching next question:", error);
    return null;
  }
};

export const saveAnswer = async (answer: Omit<SkinAnswer, "id" | "answeredAt">): Promise<SkinAnswer | null> => {
  try {
    const { data, error } = await supabase
      .from("client_skin_answers")
      .insert({
        question_id: answer.questionId,
        client_id: answer.clientId,
        answer: answer.answer,
        answered_at: new Date().toISOString()
      })
      .select("*")
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      questionId: data.question_id,
      clientId: data.client_id,
      answer: data.answer,
      answeredAt: new Date(data.answered_at)
    };
  } catch (error) {
    console.error("Error saving answer:", error);
    return null;
  }
};

export const fetchProductSuggestions = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from("client_product_suggestions")
      .select(`
        id,
        product_id,
        reason,
        products (
          id,
          name,
          description,
          image_url
        )
      `)
      .eq("client_id", clientId);
    
    if (error) throw error;
    
    return data?.map(item => ({
      id: item.product_id,
      name: item.products.name,
      description: item.products.description,
      imageUrl: item.products.image_url,
      reason: item.reason
    })) || [];
  } catch (error) {
    console.error("Error fetching product suggestions:", error);
    return [];
  }
};

export const fetchTreatmentSuggestions = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from("client_treatment_suggestions")
      .select(`
        id,
        treatment_id,
        reason,
        treatments (
          id,
          name,
          description
        )
      `)
      .eq("client_id", clientId);
    
    if (error) throw error;
    
    return data?.map(item => ({
      id: item.treatment_id,
      name: item.treatments.name,
      description: item.treatments.description,
      reason: item.reason
    })) || [];
  } catch (error) {
    console.error("Error fetching treatment suggestions:", error);
    return [];
  }
};

// Helper function to format question from database to our type
const formatQuestion = (question: any): SkinQuestion => {
  return {
    id: question.id,
    question: question.question,
    questionType: question.question_type,
    options: question.options,
    order: question.order,
    isActive: question.is_active
  };
};
