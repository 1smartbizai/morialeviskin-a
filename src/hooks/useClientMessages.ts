
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientMessage, QuickResponseType } from "@/types/clientMessages";
import { toast } from "sonner";

export const useClientMessages = () => {
  const queryClient = useQueryClient();
  
  // Fetch messages for the client
  const { 
    data: messages, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['client-messages'],
    queryFn: async () => {
      try {
        // In a real app, this would fetch from Supabase
        // Mocking the data for now
        const mockMessages: ClientMessage[] = [
          {
            id: "1",
            content: "ברוכה הבאה לקליניקה שלנו! אנו מצפים לעזור לך להגיע ליעדי הטיפוח שלך.",
            senderName: "שרון כהן",
            senderRole: "practitioner",
            messageType: "greeting",
            sentAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            isRead: true
          },
          {
            id: "2",
            content: "לפי הנתונים שמסרת, אנו ממליצים על טיפול לחות מוגבר. זה יעזור עם היובש שציינת.",
            senderName: "שרון כהן",
            senderRole: "practitioner",
            messageType: "recommendation",
            sentAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            isRead: false
          },
          {
            id: "3",
            content: "רק להזכיר לך שיש לך תור מחר בשעה 10:00! אנא אשרי שקיבלת את ההודעה.",
            senderName: "מערכת",
            senderRole: "system",
            messageType: "appointment",
            sentAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
            isRead: false
          },
          {
            id: "4",
            content: "שמנו לב שיש לך עור רגיש במיוחד. להלן קישור למאמר על איך לטפל בעור רגיש בחורף.",
            senderName: "שרון כהן",
            senderRole: "practitioner",
            messageType: "update",
            sentAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
            isRead: false
          }
        ];
        
        return mockMessages;
      } catch (error) {
        console.error("Error fetching client messages:", error);
        throw error;
      }
    }
  });

  // Mark message as read
  const markAsRead = useMutation({
    mutationFn: async (messageId: string) => {
      try {
        // In a real app, this would update the database
        console.log(`Marking message ${messageId} as read`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { success: true };
      } catch (error) {
        console.error("Error marking message as read:", error);
        throw error;
      }
    },
    onSuccess: (_, messageId) => {
      // Update the cache with the read status
      queryClient.setQueryData(['client-messages'], (oldData: ClientMessage[] | undefined) => {
        if (!oldData) return [];
        
        return oldData.map(message => 
          message.id === messageId ? { ...message, isRead: true } : message
        );
      });
    }
  });

  // Send quick response
  const sendQuickResponse = useMutation({
    mutationFn: async ({ 
      messageId, 
      responseType 
    }: { 
      messageId: string; 
      responseType: QuickResponseType;
    }) => {
      try {
        // In a real app, this would send to the database
        console.log(`Sending response ${responseType} for message ${messageId}`);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 700));
        
        const responseLabels = {
          thank_you: "תודה רבה",
          not_relevant: "לא רלוונטי",
          interested: "מעוניינת",
          question: "יש לי שאלה"
        };
        
        toast.success(`התגובה "${responseLabels[responseType]}" נשלחה בהצלחה`);
        
        return { 
          id: `resp-${Date.now()}`,
          messageId,
          responseType,
          respondedAt: new Date().toISOString()
        };
      } catch (error) {
        console.error("Error sending quick response:", error);
        toast.error("לא ניתן לשלוח תגובה כעת, נסי שוב מאוחר יותר");
        throw error;
      }
    },
    onSuccess: (response, { messageId }) => {
      // Update the cache with the new response
      queryClient.setQueryData(['client-messages'], (oldData: ClientMessage[] | undefined) => {
        if (!oldData) return [];
        
        return oldData.map(message => {
          if (message.id === messageId) {
            return {
              ...message,
              responses: [...(message.responses || []), response]
            };
          }
          return message;
        });
      });
    }
  });

  return {
    messages: messages || [],
    isLoading,
    error,
    markAsRead: (messageId: string) => markAsRead.mutate(messageId),
    sendQuickResponse: (messageId: string, responseType: QuickResponseType) => 
      sendQuickResponse.mutate({ messageId, responseType })
  };
};
