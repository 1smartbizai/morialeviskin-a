
import ClientLayout from "@/components/layouts/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Gift, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LoyaltyReward, RedeemedReward } from "@/types/management";
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
import { format } from "date-fns";
import { he } from "date-fns/locale";

const ClientRewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  
  const { data: clientData } = useQuery({
    queryKey: ["client-data"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("clients")
        .select("id")
        .eq("phone", user.phone || "") // Assuming the user object has a phone property
        .single();
      
      if (error) throw error;
      if (data) setClientId(data.id);
      return data;
    },
    enabled: !!user
  });
  
  const { data: loyalty = { total_points: 0, nextRewardAt: 300 } } = useQuery({
    queryKey: ["client-loyalty", clientId],
    queryFn: async () => {
      if (!clientId) throw new Error("Client ID not found");
      
      const { data, error } = await supabase
        .from("client_loyalty")
        .select("*")
        .eq("client_id", clientId)
        .single();
      
      if (error) {
        if (error.code === "PGRST116") {
          return { 
            total_points: 0,
            nextRewardAt: 300
          };
        }
        throw error;
      }
      
      // In a real app, you would calculate nextRewardAt based on available rewards
      return { 
        ...data,
        nextRewardAt: 300 // For demonstration purposes
      };
    },
    enabled: !!clientId
  });
  
  const { data: availableRewards = [] } = useQuery({
    queryKey: ["available-rewards"],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from("loyalty_rewards")
        .select("*")
        .eq("is_active", true)
        .order("point_cost", { ascending: true });
      
      if (error) throw error;
      return data as LoyaltyReward[];
    }
  });
  
  const { data: rewardHistory = [] } = useQuery({
    queryKey: ["reward-history", clientId],
    queryFn: async () => {
      if (!clientId) throw new Error("Client ID not found");
      
      const { data, error } = await supabase
        .from("redeemed_rewards")
        .select("*, reward:loyalty_reward_id(*)")
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as RedeemedReward[];
    },
    enabled: !!clientId
  });
  
  const redeemReward = useMutation({
    mutationFn: async (reward: LoyaltyReward) => {
      if (!clientId) throw new Error("Client ID not found");
      
      // 1. Insert into redeemed_rewards table
      const { data: redeemedReward, error: redeemError } = await supabase
        .from("redeemed_rewards")
        .insert({
          client_id: clientId,
          loyalty_reward_id: reward.id,
          points_used: reward.point_cost,
          status: "pending",
          user_id: user!.id
        })
        .select()
        .single();
      
      if (redeemError) throw redeemError;
      
      // 2. Insert transaction record for the points deduction
      const { error: transactionError } = await supabase
        .from("loyalty_transactions")
        .insert({
          client_id: clientId,
          user_id: user!.id,
          transaction_type: "redeemed",
          points: reward.point_cost,
          source: "reward",
          source_id: redeemedReward.id,
          description: `פדיון הטבה: ${reward.name}`
        });
      
      if (transactionError) throw transactionError;
      
      // 3. Update client loyalty points
      const { error: updateError } = await supabase
        .from("client_loyalty")
        .update({ 
          total_points: loyalty.total_points - reward.point_cost,
          updated_at: new Date().toISOString()
        })
        .eq("client_id", clientId);
      
      if (updateError) throw updateError;
      
      return redeemedReward;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-loyalty", clientId] });
      queryClient.invalidateQueries({ queryKey: ["reward-history", clientId] });
      
      toast({
        title: "הטבה נפדתה בהצלחה!",
        description: "ההטבה נוספה לחשבונך ומחכה לך אצלנו במספרה",
        duration: 5000,
      });
      
      setSelectedReward(null);
    },
    onError: (error) => {
      toast({
        title: "שגיאה בפדיון ההטבה",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const progress = (loyalty.total_points / loyalty.nextRewardAt) * 100;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d בMMMM yyyy", { locale: he });
    } catch (error) {
      return dateString;
    }
  };
  
  const handleRedeemClick = (reward: LoyaltyReward) => {
    setSelectedReward(reward);
  };
  
  const confirmRedeem = () => {
    if (selectedReward) {
      redeemReward.mutate(selectedReward);
    }
  };
  
  return (
    <ClientLayout>
      <div className="space-y-6" dir="rtl">
        <h1 className="text-2xl font-bold text-beauty-dark">מועדון נאמנות</h1>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 text-beauty-primary ml-2" />
                  <h2 className="text-xl font-bold">נקודות הנאמנות שלך</h2>
                </div>
                <div className="text-3xl font-bold mb-2">{loyalty.total_points} נקודות</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>נשארו עוד {loyalty.nextRewardAt - loyalty.total_points} נקודות להטבה הבאה</span>
                </div>
                
                <div className="mt-4">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button className="bg-beauty-primary">
                  לפרטים נוספים
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-beauty-dark">הטבות זמינות</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className={loyalty.total_points < reward.point_cost ? "opacity-60" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="h-4 w-4 text-beauty-primary" />
                      {reward.name}
                    </CardTitle>
                    <Badge variant="outline" className="font-normal">
                      {reward.point_cost} נקודות
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  <Button 
                    disabled={loyalty.total_points < reward.point_cost} 
                    className={loyalty.total_points >= reward.point_cost ? "bg-beauty-primary" : ""}
                    onClick={() => handleRedeemClick(reward)}
                  >
                    {loyalty.total_points >= reward.point_cost ? "פדה הטבה" : `דרושות עוד ${reward.point_cost - loyalty.total_points} נקודות`}
                  </Button>
                </CardContent>
              </Card>
            ))}
            
            {availableRewards.length === 0 && (
              <Card className="p-6 text-center col-span-full">
                <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">אין כרגע הטבות זמינות במועדון</p>
              </Card>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-beauty-dark">היסטוריית הטבות</h2>
          
          {rewardHistory.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr,auto,auto] p-4 text-sm font-medium text-muted-foreground bg-muted/50">
                    <div>הטבה</div>
                    <div>תאריך</div>
                    <div>נקודות</div>
                  </div>
                  {rewardHistory.map((item) => (
                    <div 
                      key={item.id}
                      className="grid grid-cols-[1fr,auto,auto] items-center p-4 border-t text-sm"
                    >
                      <div>
                        <div className="font-medium">{item.reward?.name || 'הטבה לא ידועה'}</div>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 ml-1" />
                        {formatDate(item.created_at)}
                      </div>
                      <div>
                        -{item.points_used}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">עוד לא פדית הטבות כלשהן</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <AlertDialog 
        open={!!selectedReward} 
        onOpenChange={(open) => !open && setSelectedReward(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>פדיון הטבה</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedReward && (
                <>
                  האם את/ה בטוח/ה שברצונך לפדות את ההטבה "{selectedReward.name}" עבור {selectedReward.point_cost} נקודות?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row-reverse justify-start gap-2">
            <AlertDialogAction
              onClick={confirmRedeem}
              className="bg-beauty-primary"
              disabled={redeemReward.isPending}
            >
              {redeemReward.isPending ? "מעבד..." : "כן, פדה הטבה"}
            </AlertDialogAction>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ClientLayout>
  );
};

export default ClientRewards;
