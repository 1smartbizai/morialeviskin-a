
import { Button } from "@/components/ui/button";

const DashboardCTA = () => {
  return (
    <>
      <div className="py-4">
        <Button variant="default" size="lg" className="w-full sm:w-auto">
          היכנסי ללוח הבקרה
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground">
        הקלקיי כדי להתחיל לנהל את העסק שלך
      </p>
    </>
  );
};

export default DashboardCTA;
