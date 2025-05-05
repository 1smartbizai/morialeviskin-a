
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoyaltyReward } from "@/types/management";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Award, Plus, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const loyaltyRewardSchema = z.object({
  name: z.string().min(1, { message: "נדרש שם להטבה" }),
  description: z.string().optional(),
  point_cost: z.coerce.number().min(1, { message: "נדרשת עלות מינימלית של נקודה אחת" }),
  is_active: z.boolean().default(true),
});

type LoyaltyRewardFormValues = z.infer<typeof loyaltyRewardSchema>;

const LoyaltyRewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingReward, setEditingReward] = useState<LoyaltyReward | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState<LoyaltyReward | null>(null);

  const form = useForm<LoyaltyRewardFormValues>({
    resolver: zodResolver(loyaltyRewardSchema),
    defaultValues: {
      name: "",
      description: "",
      point_cost: 100,
      is_active: true,
    },
  });

  const { data: rewards = [], isLoading } = useQuery({
    queryKey: ["loyalty-rewards"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("loyalty_rewards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LoyaltyReward[];
    },
  });

  const createReward = useMutation({
    mutationFn: async (values: LoyaltyRewardFormValues) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("loyalty_rewards")
        .insert({
          ...values,
          name: values.name,
          point_cost: values.point_cost,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-rewards"] });
      toast({
        title: "הטבה נוצרה בהצלחה",
        description: "ההטבה החדשה נוספה למערכת הנאמנות",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "שגיאה ביצירת הטבה",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateReward = useMutation({
    mutationFn: async (values: LoyaltyRewardFormValues) => {
      if (!user || !editingReward) throw new Error("User not authenticated or reward not selected");

      const { data, error } = await supabase
        .from("loyalty_rewards")
        .update({
          ...values,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingReward.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-rewards"] });
      toast({
        title: "הטבה עודכנה בהצלחה",
        description: "השינויים בהטבה נשמרו",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "שגיאה בעדכון הטבה",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteReward = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("loyalty_rewards").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-rewards"] });
      toast({
        title: "הטבה נמחקה",
        description: "ההטבה הוסרה ממערכת הנאמנות",
      });
      setRewardToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "שגיאה במחיקת הטבה",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: LoyaltyRewardFormValues) => {
    if (editingReward) {
      updateReward.mutate(values);
    } else {
      createReward.mutate(values);
    }
  };

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      point_cost: 100,
      is_active: true,
    });
    setEditingReward(null);
    setIsCreating(false);
  };

  const handleEditReward = (reward: LoyaltyReward) => {
    setEditingReward(reward);
    setIsCreating(true);
    form.reset({
      name: reward.name,
      description: reward.description || "",
      point_cost: reward.point_cost,
      is_active: reward.is_active,
    });
  };

  return (
    <div className="space-y-6">
      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingReward ? "עריכת הטבה" : "הוספת הטבה חדשה"}</CardTitle>
            <CardDescription>הגדר הטבות שלקוחות יכולים לפדות עם נקודות נאמנות</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם ההטבה</FormLabel>
                      <FormControl>
                        <Input placeholder="לדוגמה: טיפול פנים חינם" {...field} />
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
                      <FormLabel>תיאור (אופציונלי)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="תיאור מפורט של ההטבה" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="point_cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>עלות בנקודות</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        מספר הנקודות שעל הלקוח לצבור כדי לפדות הטבה זו
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">הטבה פעילה</FormLabel>
                        <FormDescription>האם להפעיל את ההטבה במערכת הנאמנות</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    ביטול
                  </Button>
                  <Button 
                    type="submit"
                    className="mr-2"
                    disabled={createReward.isPending || updateReward.isPending}
                  >
                    {editingReward ? "עדכון הטבה" : "יצירת הטבה"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">הטבות לפדיון</h2>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 ml-2" /> הטבה חדשה
          </Button>
        </div>
      )}

      {!isCreating && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <Card className="p-8 flex justify-center items-center">
              <p>טוען הטבות...</p>
            </Card>
          ) : rewards.length === 0 ? (
            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <Award className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">אין הטבות</h3>
              <p className="text-muted-foreground mb-4">הגדר הטבות שלקוחות יוכלו לפדות עם נקודות</p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 ml-2" /> הוספת הטבה ראשונה
              </Button>
            </Card>
          ) : (
            rewards.map((reward) => (
              <Card key={reward.id} className={!reward.is_active ? "opacity-60" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {reward.name}
                        {!reward.is_active && <Badge variant="outline" className="mr-2">לא פעיל</Badge>}
                      </CardTitle>
                    </div>
                    <Badge className="bg-beauty-primary">{reward.point_cost} נקודות</Badge>
                  </div>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditReward(reward)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setRewardToDelete(reward)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      <AlertDialog open={!!rewardToDelete} onOpenChange={(open) => !open && setRewardToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם למחוק את ההטבה?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק לצמיתות את ההטבה "{rewardToDelete?.name}". לא ניתן לשחזר אותה לאחר המחיקה.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                rewardToDelete && deleteReward.mutate(rewardToDelete.id);
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              אישור מחיקה
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LoyaltyRewards;
