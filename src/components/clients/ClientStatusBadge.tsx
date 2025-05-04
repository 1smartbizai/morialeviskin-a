
import { Badge } from "@/components/ui/badge";

interface ClientStatusBadgeProps {
  status: "active" | "at_risk" | "new_lead" | "inactive";
  className?: string;
}

export const ClientStatusBadge = ({ status, className }: ClientStatusBadgeProps) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="success" className={className}>
          פעיל
        </Badge>
      );
    case "at_risk":
      return (
        <Badge variant="warning" className={className}>
          בסיכון
        </Badge>
      );
    case "new_lead":
      return (
        <Badge variant="info" className={className}>
          ליד חדש
        </Badge>
      );
    case "inactive":
      return (
        <Badge variant="outline" className={className}>
          לא פעיל
        </Badge>
      );
    default:
      return null;
  }
};
