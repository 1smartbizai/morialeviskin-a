
import { useTreatmentHistory } from "@/hooks/useTreatmentHistory";
import ClientLayout from "@/components/layouts/ClientLayout";
import { TreatmentHistoryItem } from "@/components/treatment-history/TreatmentHistoryItem";
import { TreatmentHistoryFilters } from "@/components/treatment-history/TreatmentHistoryFilters";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const TreatmentHistory = () => {
  const navigate = useNavigate();
  const {
    isLoading,
    treatmentHistory,
    availableTreatments,
    filters,
    updateFilters,
  } = useTreatmentHistory();
  
  const handleBookAppointment = () => {
    navigate("/client/book");
  };
  
  return (
    <ClientLayout>
      <div className="space-y-6" dir="rtl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-beauty-dark">היסטורית טיפולים</h1>
          <Button className="bg-beauty-primary" onClick={handleBookAppointment}>
            + קביעת תור חדש
          </Button>
        </div>
        
        <TreatmentHistoryFilters
          filters={filters}
          updateFilters={updateFilters}
          availableTreatments={availableTreatments}
        />
        
        {isLoading ? (
          <LoadingState message="טוען היסטוריית טיפולים..." />
        ) : treatmentHistory.length > 0 ? (
          <div className="space-y-4">
            {treatmentHistory.map((item) => (
              <TreatmentHistoryItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-beauty-accent/20 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-beauty-primary" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">אין היסטוריית טיפולים</h3>
            <p className="text-muted-foreground mb-4">
              לא נמצאו טיפולים קודמים בהיסטוריה שלך
            </p>
            <Button className="bg-beauty-primary" onClick={handleBookAppointment}>
              קביעת תור ראשון
            </Button>
          </Card>
        )}
      </div>
    </ClientLayout>
  );
};

export default TreatmentHistory;
