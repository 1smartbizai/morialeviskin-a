
import ClientLayout from "@/components/layouts/ClientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useClientDashboard } from "@/hooks/useClientDashboard";

// Components
import WelcomeCard from "@/components/dashboard/client/WelcomeCard";
import NextAppointment from "@/components/dashboard/client/NextAppointment";
import LoyaltyBanner from "@/components/dashboard/client/LoyaltyBanner";
import PaymentBanner from "@/components/dashboard/client/PaymentBanner";
import TipCard from "@/components/dashboard/client/TipCard";
import QuickActions from "@/components/dashboard/client/QuickActions";
import LoadingState from "@/components/dashboard/client/LoadingState";

const ClientDashboard = () => {
  const { clientData, nextAppointment, tip, isLoading } = useClientDashboard();
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  return (
    <ClientLayout
      businessName="הפינוק שלך"
      clientName={clientData?.first_name}
    >
      <div className="space-y-6 pb-10" dir="rtl">
        {/* Greeting & Next Appointment */}
        <Card className="overflow-hidden">
          <WelcomeCard firstName={clientData?.first_name} />
          <CardContent className="p-4 md:p-6">
            <NextAppointment appointment={nextAppointment} />
          </CardContent>
        </Card>
        
        {/* Rewards & Payments Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LoyaltyBanner points={clientData?.points || 0} />
          <PaymentBanner pendingPayment={clientData?.pending_payment || 0} />
        </div>
        
        {/* Tip/Promo Card */}
        <TipCard tip={tip} />
        
        {/* Quick Actions */}
        <QuickActions />
      </div>
    </ClientLayout>
  );
};

export default ClientDashboard;
