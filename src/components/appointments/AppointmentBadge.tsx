
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AppointmentStatus = "confirmed" | "done" | "canceled" | "pending";

interface AppointmentBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const AppointmentBadge = ({ status, className }: AppointmentBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200";
      case "done":
        return "bg-sky-100 text-sky-700 hover:bg-sky-200";
      case "canceled":
        return "bg-rose-100 text-rose-700 hover:bg-rose-200";
      case "pending":
        return "bg-amber-100 text-amber-700 hover:bg-amber-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200";
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={cn("border-none", getStatusStyles(), className)}
    >
      {status}
    </Badge>
  );
};

export default AppointmentBadge;
