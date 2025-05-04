
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentsHeaderProps {
  onExportData: () => void;
  onNewPayment: () => void;
}

export const PaymentsHeader = ({ onExportData, onNewPayment }: PaymentsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-2xl font-bold text-beauty-dark">תשלומים וחשבוניות</h1>
      <div className="flex gap-2">
        <Button variant="outline" className="flex items-center gap-2" onClick={onExportData}>
          <Download className="h-4 w-4" />
          ייצוא
        </Button>
        <Button className="bg-beauty-primary" onClick={onNewPayment}>+ תשלום חדש</Button>
      </div>
    </div>
  );
};
