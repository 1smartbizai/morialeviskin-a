
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { personalDetailsSchema, PersonalDetailsFormValues } from "../types";

export const usePersonalDetails = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<PersonalDetailsFormValues | null>(null);
  const { toast } = useToast();

  // Form initialization
  const form = useForm<PersonalDetailsFormValues>({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      birthdate: "",
    },
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          return;
        }
        
        const { data: clientData } = await supabase
          .from("clients")
          .select("first_name, last_name, phone, birthdate")
          .eq("id", user.id)
          .single();
          
        if (clientData) {
          setUserData(clientData);
          form.reset({
            first_name: clientData.first_name || "",
            last_name: clientData.last_name || "",
            phone: clientData.phone || "",
            birthdate: clientData.birthdate ? new Date(clientData.birthdate).toISOString().split('T')[0] : "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          variant: "destructive",
          title: "שגיאה",
          description: "לא ניתן לטעון את הפרטים האישיים",
        });
      }
    };
    
    fetchUserData();
  }, [form, toast]);

  // Handle form submission
  const onSubmit = async (values: PersonalDetailsFormValues) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("לא מחובר");
      }
      
      const { error } = await supabase
        .from("clients")
        .update({
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phone,
          birthdate: values.birthdate || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "הפרטים עודכנו",
        description: "הפרטים האישיים שלך עודכנו בהצלחה",
      });
    } catch (error) {
      console.error("Error updating user data:", error);
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן לעדכן את הפרטים האישיים",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, onSubmit };
};
