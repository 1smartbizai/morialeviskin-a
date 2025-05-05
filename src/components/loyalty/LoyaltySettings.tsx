
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Info } from "lucide-react";

const loyaltySettingsSchema = z.object({
  auto_enrollment: z.boolean().default(true),
  welcome_bonus: z.boolean().default(true),
  welcome_bonus_points: z.coerce.number().min(0).default(50),
  points_per_visit: z.coerce.number().min(0).default(10),
  points_per_amount: z.coerce.number().min(0).default(1),
  amount_per_point: z.coerce.number().min(1).default(10),
  send_notification_on_reward: z.boolean().default(true),
  send_notification_on_points: z.boolean().default(true),
  points_expiry_days: z.coerce.number().min(0).default(365),
});

type LoyaltySettingsFormValues = z.infer<typeof loyaltySettingsSchema>;

const LoyaltySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<LoyaltySettingsFormValues>({
    resolver: zodResolver(loyaltySettingsSchema),
    defaultValues: {
      auto_enrollment: true,
      welcome_bonus: true,
      welcome_bonus_points: 50,
      points_per_visit: 10,
      points_per_amount: 1,
      amount_per_point: 10,
      send_notification_on_reward: true,
      send_notification_on_points: true,
      points_expiry_days: 365,
    },
  });

  const { data: settings, isLoading } = useQuery({
    queryKey: ["loyalty-settings"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // This would be a real API call in a production environment
      // Here we're just returning mock data as if it came from the database
      return {
        auto_enrollment: true,
        welcome_bonus: true,
        welcome_bonus_points: 50,
        points_per_visit: 10,
        points_per_amount: 1,
        amount_per_point: 10,
        send_notification_on_reward: true,
        send_notification_on_points: true,
        points_expiry_days: 365,
      };
    },
    onSuccess: (data) => {
      if (data) {
        form.reset(data);
      }
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (values: LoyaltySettingsFormValues) => {
      if (!user) throw new Error("User not authenticated");

      // This would save settings to the database in a real app
      // For now we'll just simulate a delay
      return new Promise<LoyaltySettingsFormValues>((resolve) => {
        setTimeout(() => {
          resolve(values);
        }, 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-settings"] });
      toast({
        title: "הגדרות נשמרו",
        description: "הגדרות מערכת הנאמנות עודכנו בהצלחה",
      });
    },
    onError: (error) => {
      toast({
        title: "שגיאה בשמירת הגדרות",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: LoyaltySettingsFormValues) => {
    updateSettings.mutate(values);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>הגדרות מערכת נאמנות</CardTitle>
          <CardDescription>הגדר כיצד מערכת הנקודות והתגמולים תפעל עבור לקוחותיך</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">הגדרות בסיסיות</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="auto_enrollment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">הרשמה אוטומטית</FormLabel>
                          <FormDescription>
                            רשום לקוחות חדשים אוטומטית למערכת הנאמנות
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="welcome_bonus"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">בונוס הרשמה</FormLabel>
                          <FormDescription>
                            העניק נקודות בונוס ללקוחות חדשים
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("welcome_bonus") && (
                    <FormField
                      control={form.control}
                      name="welcome_bonus_points"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>נקודות בונוס הרשמה</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            מספר הנקודות שלקוחות חדשים יקבלו בהרשמה
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">צבירת נקודות</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="points_per_visit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>נקודות לכל ביקור</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          מספר הנקודות שלקוחות יקבלו עבור כל ביקור
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount_per_point"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>סכום לנקודה (₪)</FormLabel>
                        <FormControl>
                          <Input type="number" min="1" {...field} />
                        </FormControl>
                        <FormDescription>
                          סכום הכסף (₪) שלקוח צריך להוציא בשביל לקבל נקודה אחת
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="points_per_amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>נקודות לכל יחידת מטבע</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" step="0.1" {...field} />
                        </FormControl>
                        <FormDescription>
                          מספר הנקודות שיתקבלו לכל {form.watch("amount_per_point")} ש״ח
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="points_expiry_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>תוקף נקודות (ימים)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormDescription>
                          מספר הימים עד לפקיעת תוקף הנקודות (0 = לעולם לא פג)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">הגדרות התראות</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="send_notification_on_points"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">התראה על צבירת נקודות</FormLabel>
                          <FormDescription>
                            שלח התראה ללקוחות כשהם צוברים נקודות
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="send_notification_on_reward"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">התראה על זמינות הטבה</FormLabel>
                          <FormDescription>
                            שלח התראה ללקוחות כשהם זכאים להטבה חדשה
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="help">
                  <AccordionTrigger className="text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      <span>מידע נוסף על הגדרות מערכת הנאמנות</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-sm text-muted-foreground p-4 bg-muted/50 rounded-md">
                      <p>
                        <strong>הרשמה אוטומטית</strong> - כאשר מופעל, לקוחות חדשים יירשמו אוטומטית למערכת הנאמנות בעת יצירת חשבון.
                      </p>
                      <p>
                        <strong>בונוס הרשמה</strong> - כאשר מופעל, לקוחות חדשים יקבלו נקודות בונוס בעת הצטרפותם למערכת.
                      </p>
                      <p>
                        <strong>צבירת נקודות</strong> - הגדר כיצד לקוחות צוברים נקודות: כמה נקודות לכל ביקור וכמה נקודות לכל יחידת מטבע שהוצאה.
                      </p>
                      <p>
                        <strong>תוקף נקודות</strong> - קבע את מספר הימים עד לפקיעת תוקף הנקודות. השתמש ב-0 אם ברצונך שהנקודות לעולם לא יפקעו.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <div className="flex justify-end">
                <Button 
                  type="submit"
                  disabled={updateSettings.isPending || !form.formState.isDirty}
                >
                  שמירת הגדרות
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoyaltySettings;
