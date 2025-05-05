
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoyaltyRule } from "@/types/management";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Toggle } from "@/components/ui/toggle";
import { Sparkles, Plus, Edit, Trash2, Check, X, Info } from "lucide-react";
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

const loyaltyRuleSchema = z.object({
  name: z.string().min(1, { message: "נדרש שם לחוק" }),
  description: z.string().optional(),
  rule_type: z.enum(["visit_count", "spend_amount", "product_purchase"], {
    required_error: "יש לבחור סוג חוק",
  }),
  threshold: z.coerce.number().min(1, { message: "נדרש ערך מינימלי של 1" }),
  reward_type: z.enum(["points", "discount", "free_product", "free_service"], {
    required_error: "יש לבחור סוג תגמול",
  }),
  reward_value: z.coerce.number().min(1, { message: "נדרש ערך מינימלי של 1" }),
  is_active: z.boolean().default(true),
});

type LoyaltyRuleFormValues = z.infer<typeof loyaltyRuleSchema>;

const LoyaltyRules = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingRule, setEditingRule] = useState<LoyaltyRule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<LoyaltyRule | null>(null);

  const form = useForm<LoyaltyRuleFormValues>({
    resolver: zodResolver(loyaltyRuleSchema),
    defaultValues: {
      name: "",
      description: "",
      rule_type: "visit_count",
      threshold: 5,
      reward_type: "points",
      reward_value: 100,
      is_active: true,
    },
  });

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ["loyalty-rules"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("loyalty_rules")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as LoyaltyRule[];
    },
  });

  const createRule = useMutation({
    mutationFn: async (values: LoyaltyRuleFormValues) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("loyalty_rules")
        .insert({
          ...values,
          name: values.name,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-rules"] });
      toast({
        title: "חוק נאמנות נוצר בהצלחה",
        description: "החוק החדש נוסף למערכת הנאמנות",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "שגיאה ביצירת חוק נאמנות",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateRule = useMutation({
    mutationFn: async (values: LoyaltyRuleFormValues) => {
      if (!user || !editingRule) throw new Error("User not authenticated or rule not selected");

      const { data, error } = await supabase
        .from("loyalty_rules")
        .update({
          ...values,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingRule.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-rules"] });
      toast({
        title: "חוק נאמנות עודכן בהצלחה",
        description: "השינויים בחוק נשמרו",
      });
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "שגיאה בעדכון חוק נאמנות",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteRule = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("loyalty_rules").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-rules"] });
      toast({
        title: "חוק נאמנות נמחק",
        description: "החוק הוסר ממערכת הנאמנות",
      });
      setRuleToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "שגיאה במחיקת חוק",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: LoyaltyRuleFormValues) => {
    if (editingRule) {
      updateRule.mutate(values);
    } else {
      createRule.mutate(values);
    }
  };

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      rule_type: "visit_count",
      threshold: 5,
      reward_type: "points",
      reward_value: 100,
      is_active: true,
    });
    setEditingRule(null);
    setIsCreating(false);
  };

  const handleEditRule = (rule: LoyaltyRule) => {
    setEditingRule(rule);
    setIsCreating(true);
    form.reset({
      name: rule.name,
      description: rule.description || "",
      rule_type: rule.rule_type,
      threshold: rule.threshold,
      reward_type: rule.reward_type,
      reward_value: rule.reward_value,
      is_active: rule.is_active,
    });
  };

  const getRuleTypeDisplay = (type: string) => {
    switch (type) {
      case "visit_count":
        return "מספר ביקורים";
      case "spend_amount":
        return "סכום כספי";
      case "product_purchase":
        return "רכישת מוצר";
      default:
        return type;
    }
  };

  const getRewardTypeDisplay = (type: string) => {
    switch (type) {
      case "points":
        return "נקודות";
      case "discount":
        return "הנחה";
      case "free_product":
        return "מוצר חינם";
      case "free_service":
        return "טיפול חינם";
      default:
        return type;
    }
  };

  const renderRuleDescription = (rule: LoyaltyRule) => {
    const ruleTypeText = {
      visit_count: `לאחר ${rule.threshold} ביקורים`,
      spend_amount: `לאחר הוצאה של ${rule.threshold}₪`,
      product_purchase: `לאחר רכישת ${rule.threshold} מוצרים`
    };

    const rewardTypeText = {
      points: `${rule.reward_value} נקודות`,
      discount: `הנחה של ${rule.reward_value}%`,
      free_product: `מוצר חינם בשווי ${rule.reward_value}₪`,
      free_service: `טיפול חינם בשווי ${rule.reward_value}₪`
    };

    return `${ruleTypeText[rule.rule_type]} - ${rewardTypeText[rule.reward_type]}`;
  };

  return (
    <div className="space-y-6">
      {isCreating ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingRule ? "עריכת חוק נאמנות" : "הוספת חוק נאמנות חדש"}</CardTitle>
            <CardDescription>הגדר מתי וכיצד לקוחות ירוויחו תגמולים</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם החוק</FormLabel>
                      <FormControl>
                        <Input placeholder="לדוגמה: בונוס ביקור חמישי" {...field} />
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
                        <Textarea placeholder="תיאור מפורט של החוק" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="rule_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>סוג תנאי</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="בחר סוג תנאי" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="visit_count">מספר ביקורים</SelectItem>
                              <SelectItem value="spend_amount">סכום כספי</SelectItem>
                              <SelectItem value="product_purchase">רכישת מוצרים</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            מתי הלקוחות יקבלו את התגמול
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ערך סף</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            {form.watch("rule_type") === "visit_count" && "מספר הביקורים הנדרשים"}
                            {form.watch("rule_type") === "spend_amount" && "סכום ההוצאה הנדרש (₪)"}
                            {form.watch("rule_type") === "product_purchase" && "מספר המוצרים שיש לרכוש"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="reward_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>סוג התגמול</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="בחר סוג תגמול" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="points">נקודות</SelectItem>
                              <SelectItem value="discount">הנחה באחוזים</SelectItem>
                              <SelectItem value="free_product">מוצר חינם</SelectItem>
                              <SelectItem value="free_service">טיפול חינם</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            מה הלקוחות יקבלו כשיעמדו בתנאי
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reward_value"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ערך התגמול</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormDescription>
                            {form.watch("reward_type") === "points" && "מספר הנקודות שיתקבלו"}
                            {form.watch("reward_type") === "discount" && "אחוז ההנחה שיתקבל"}
                            {form.watch("reward_type") === "free_product" && "ערך המוצר החינם (₪)"}
                            {form.watch("reward_type") === "free_service" && "ערך הטיפול החינם (₪)"}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">חוק פעיל</FormLabel>
                        <FormDescription>האם להפעיל את החוק במערכת הנאמנות</FormDescription>
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
                    disabled={createRule.isPending || updateRule.isPending}
                  >
                    {editingRule ? "עדכון חוק" : "יצירת חוק"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">חוקי נאמנות</h2>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 ml-2" /> חוק חדש
          </Button>
        </div>
      )}

      {!isCreating && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {isLoading ? (
            <Card className="p-8 flex justify-center items-center">
              <p>טוען חוקי נאמנות...</p>
            </Card>
          ) : rules.length === 0 ? (
            <Card className="p-8 flex flex-col items-center justify-center text-center">
              <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">אין חוקי נאמנות</h3>
              <p className="text-muted-foreground mb-4">הגדר חוקים כדי שלקוחות יוכלו לצבור תגמולים</p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="h-4 w-4 ml-2" /> הוספת חוק ראשון
              </Button>
            </Card>
          ) : (
            rules.map((rule) => (
              <Card key={rule.id} className={!rule.is_active ? "opacity-60" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center">
                        {rule.name} 
                        {!rule.is_active && <Badge variant="outline" className="mr-2">לא פעיל</Badge>}
                      </CardTitle>
                      <CardDescription>{rule.description}</CardDescription>
                    </div>
                    <Badge className="bg-beauty-primary">
                      {getRuleTypeDisplay(rule.rule_type)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{renderRuleDescription(rule)}</p>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEditRule(rule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => setRuleToDelete(rule)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      )}

      <AlertDialog open={!!ruleToDelete} onOpenChange={(open) => !open && setRuleToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם למחוק את החוק?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק לצמיתות את חוק הנאמנות "{ruleToDelete?.name}". לא ניתן לשחזר אותו לאחר המחיקה.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                ruleToDelete && deleteRule.mutate(ruleToDelete.id);
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

export default LoyaltyRules;
