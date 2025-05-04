
import ClientLayout from "@/components/layouts/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Gift, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ClientRewards = () => {
  // Mock reward data
  const points = 230;
  const nextRewardAt = 300;
  const progress = (points / nextRewardAt) * 100;
  
  const availableRewards = [
    {
      id: 1,
      name: "Free Add-On Service",
      description: "Add a complimentary service (up to $25 value) to your next appointment",
      pointCost: 200,
      isAvailable: true
    },
    {
      id: 2,
      name: "15% Off Any Treatment",
      description: "Get 15% off any single treatment of your choice",
      pointCost: 300,
      isAvailable: false
    }
  ];
  
  const rewardHistory = [
    {
      id: 1,
      name: "$10 Off Coupon",
      date: "April 15, 2025",
      pointCost: 100,
      status: "redeemed"
    },
    {
      id: 2,
      name: "Free Product Sample",
      date: "March 2, 2025",
      pointCost: 50,
      status: "redeemed"
    }
  ];
  
  return (
    <ClientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-beauty-dark">Rewards Program</h1>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 text-beauty-primary mr-2" />
                  <h2 className="text-xl font-bold">Your Reward Points</h2>
                </div>
                <div className="text-3xl font-bold mb-2">{points} points</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{nextRewardAt - points} points away from next reward</span>
                </div>
                
                <div className="mt-4">
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button className="bg-beauty-primary">
                  View How to Earn
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-beauty-dark">Available Rewards</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableRewards.map((reward) => (
              <Card key={reward.id} className={!reward.isAvailable ? "opacity-60" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Gift className="h-4 w-4 text-beauty-primary" />
                      {reward.name}
                    </CardTitle>
                    <Badge variant="outline" className="font-normal">
                      {reward.pointCost} points
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                  <Button 
                    disabled={!reward.isAvailable} 
                    className={reward.isAvailable ? "bg-beauty-primary" : ""}
                  >
                    {reward.isAvailable ? "Redeem Reward" : `Need ${reward.pointCost - points} more points`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-beauty-dark">Reward History</h2>
          
          {rewardHistory.length > 0 ? (
            <Card>
              <CardContent className="p-0">
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr,auto,auto] p-4 text-sm font-medium text-muted-foreground bg-muted/50">
                    <div>Reward</div>
                    <div>Date</div>
                    <div>Points</div>
                  </div>
                  {rewardHistory.map((item) => (
                    <div 
                      key={item.id}
                      className="grid grid-cols-[1fr,auto,auto] items-center p-4 border-t text-sm"
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {item.date}
                      </div>
                      <div>
                        -{item.pointCost}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You haven't redeemed any rewards yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientRewards;
