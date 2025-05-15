
import { Button } from "@/components/ui/button";
import { ArrowRight, Stars } from "lucide-react";
import { useSignup } from "@/contexts/SignupContext";

const DashboardCTA = () => {
  const { signupData } = useSignup();
  const { firstName, businessName } = signupData;
  
  return (
    <>
      <div className="py-6">
        <Button 
          variant="default" 
          size="lg" 
          className="w-full sm:w-auto text-base px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <span>
            {firstName ? `${firstName}, ` : ''}היכנסי ללוח הבקרה
          </span>
          <ArrowRight className="ml-1 h-5 w-5" />
        </Button>
      </div>
      
      <div className="mt-2 flex items-center justify-center gap-2 text-muted-foreground">
        <Stars className="h-4 w-4 text-yellow-500" />
        <p className="text-sm">
          {businessName ? `${businessName} מוכן לקבלת לקוחות!` : 'העסק שלך מוכן לקבל לקוחות!'}
        </p>
        <Stars className="h-4 w-4 text-yellow-500" />
      </div>
    </>
  );
};

export default DashboardCTA;
