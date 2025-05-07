
import { useState } from "react";
import ClientLayout from "@/components/layouts/ClientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useClientDashboard } from "@/hooks/useClientDashboard";
import NextAppointment from "@/components/dashboard/client/NextAppointment";
import WelcomeCard from "@/components/dashboard/client/WelcomeCard";
import QuickActions from "@/components/dashboard/client/QuickActions";
import LoadingState from "@/components/dashboard/client/LoadingState";
import PaymentBanner from "@/components/dashboard/client/PaymentBanner";
import LoyaltyBanner from "@/components/dashboard/client/LoyaltyBanner";
import TipCard from "@/components/dashboard/client/TipCard";
import ReferralBanner from "@/components/client/ReferralBanner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ClientDashboard = () => {
  const { 
    clientData,
    isLoading,
    nextAppointment,
    treatmentHistory,
    pendingPayment,
    skinProfile,
    loyalty
  } = useClientDashboard();
  
  const { toast } = useToast();
  const [referralDialogOpen, setReferralDialogOpen] = useState(false);
  const [referralLink, setReferralLink] = useState("");
  
  // Generate referral link based on client ID
  useState(() => {
    if (clientData?.id) {
      setReferralLink(`${window.location.origin}/referral/${clientData.id}`);
    }
  });
  
  const handleShareReferral = async () => {
    if (navigator.share && referralLink) {
      try {
        await navigator.share({
          title: 'הצטרף אלינו!',
          text: 'הצטרף אלינו וקבל הנחה בטיפול הראשון שלך!',
          url: referralLink,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(
      () => {
        toast({
          title: "הקישור הועתק",
          description: "הקישור הועתק ללוח. עכשיו אפשר לשתף עם חברים!",
        });
      },
      (err) => {
        toast({
          title: "לא הצלחנו להעתיק את הקישור",
          description: "אנא נסה שוב מאוחר יותר",
          variant: "destructive",
        });
      }
    );
  };
  
  if (isLoading) {
    return (
      <ClientLayout>
        <LoadingState />
      </ClientLayout>
    );
  }
  
  return (
    <ClientLayout
      clientName={clientData ? `${clientData.first_name}` : undefined}
    >
      <div className="space-y-6" dir="rtl">
        <WelcomeCard 
          clientName={clientData?.first_name}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActions />
          
          <NextAppointment 
            appointment={nextAppointment}
          />
        </div>
        
        {pendingPayment && (
          <PaymentBanner amount={pendingPayment.amount} />
        )}
        
        {loyalty?.total_points > 0 && (
          <LoyaltyBanner points={loyalty.total_points} />
        )}
        
        <ReferralBanner 
          clientId={clientData?.id} 
          referralsCount={2} 
          onShareClick={() => setReferralDialogOpen(true)}
        />
        
        {treatmentHistory && treatmentHistory.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-beauty-dark">טיפולים אחרונים</h2>
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {treatmentHistory.slice(0, 2).map((treatment) => (
                    <div key={treatment.id} className="p-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{treatment.name}</h3>
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 ml-1" />
                          {treatment.date}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="p-4 text-center">
                    <Button variant="ghost" size="sm">לכל ההיסטוריה</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <TipCard />
      </div>
      
      {/* Referral Link Dialog */}
      <Dialog open={referralDialogOpen} onOpenChange={setReferralDialogOpen}>
        <DialogContent dir="rtl" className="max-w-md">
          <DialogHeader>
            <DialogTitle>שתף קישור הזמנה</DialogTitle>
            <DialogDescription>
              כשחברים נרשמים דרך הקישור שלך, אתם מקבלים 50 נקודות לחשבון שלכם
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted p-3 rounded-md text-center break-all text-xs">
            {referralLink}
          </div>
          
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button 
              onClick={handleShareReferral} 
              className="w-full bg-beauty-primary hover:bg-beauty-primary/90"
            >
              <Share className="mr-2 h-4 w-4" />
              שתף את הקישור
            </Button>
            <Button 
              onClick={copyToClipboard} 
              className="w-full"
              variant="outline"
            >
              העתק קישור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClientLayout>
  );
};

export default ClientDashboard;
