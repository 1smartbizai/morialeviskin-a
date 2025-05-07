
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Share } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ReferralBannerProps {
  clientId?: string;
  referralsCount?: number;
  onShareClick: () => void;
}

const ReferralBanner = ({ clientId, referralsCount = 0, onShareClick }: ReferralBannerProps) => {
  const { toast } = useToast();
  
  if (!clientId) return null;
  
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-beauty-primary/10 p-3 rounded-full">
              <Users className="h-5 w-5 text-beauty-primary" />
            </div>
            <div>
              <h3 className="font-medium">תכנית חבר מביא חבר</h3>
              <p className="text-sm text-muted-foreground">הזמנת {referralsCount} חברים</p>
            </div>
          </div>
          <Button 
            onClick={onShareClick}
            className="bg-beauty-primary flex items-center gap-2"
            size="sm"
          >
            <Share className="h-4 w-4" />
            שתף הזמנה
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralBanner;
