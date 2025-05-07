
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DatePicker } from "@/components/ui/date-picker";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  action_type: z.string().min(2, {
    message: "יש לבחור סוג פעולה",
  }),
  description: z.string().min(10, {
    message: "תיאור הפעולה חייב להכיל לפחות 10 תווים",
  }),
  scheduled_date: z.date({
    required_error: "יש לבחור תאריך עתידי",
  }),
});

interface AutomatedActionFormProps {
  clientId: string;
  onSuccess: () => void;
}

const AutomatedActionForm = ({ clientId, onSuccess }: AutomatedActionFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      action_type: "",
      description: "",
      scheduled_date: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("client_automated_actions")
        .insert([{ 
          client_id: clientId,
          action_type: values.action_type,
          content: values.description,
          scheduled_for: values.scheduled_date.toISOString(),
          source_type: 'manual',
          source_id: clientId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }]);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("פעולה אוטומטית נוצרה בהצלחה");
      onSuccess();
    } catch (error) {
      console.error("Error creating automated action:", error);
      toast.error("שגיאה ביצירת פעולה אוטומטית");
    } finally {
      setIsLoading(false);
    }
  };

  const disabledDays = (day: Date) => {
    return day < new Date();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>צור פעולה אוטומטית</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="action_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>סוג פעולה</FormLabel>
                  <FormControl>
                    <Input placeholder="סוג פעולה" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תיאור</FormLabel>
                  <FormControl>
                    <Textarea placeholder="תיאור" {...field} className="min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="scheduled_date"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <FormLabel>תאריך</FormLabel>
                  <DatePicker
                    mode="single"
                    required
                    disabled={disabledDays}
                    selected={field.value}
                    onSelect={field.onChange}
                    className="w-full"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "יוצר..." : "צור פעולה"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AutomatedActionForm;
