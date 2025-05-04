
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { Calendar, User, Tag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ClientStatusBadge } from "./ClientStatusBadge";

// Client type definition
interface Client {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
  photo_url?: string;
  status: "active" | "at_risk" | "new_lead" | "inactive";
  lastVisit?: string;
  nextAppointment?: string;
  loyaltyPoints?: number;
  tags?: string[];
}

interface ClientCardProps {
  client: Client;
  viewMode: "grid" | "list";
  onClick: () => void;
}

export const ClientCard = ({ client, viewMode, onClick }: ClientCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "לא זמין";
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: he });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const fullName = `${client.first_name} ${client.last_name}`;
  const initials = `${client.first_name[0]}${client.last_name[0]}`.toUpperCase();

  if (viewMode === "list") {
    return (
      <div 
        onClick={onClick}
        className="flex items-center gap-3 p-3 bg-white border rounded-lg hover:bg-beauty-accent/10 cursor-pointer transition-colors"
      >
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={client.photo_url} alt={fullName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium">{fullName}</h3>
            <ClientStatusBadge status={client.status} />
          </div>
          <p className="text-sm text-muted-foreground">{client.phone}</p>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {client.nextAppointment && (
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(client.nextAppointment)}</span>
            </div>
          )}
          
          {client.tags && client.tags.length > 0 && (
            <div className="flex gap-1">
              {client.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {client.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{client.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <Button variant="outline" size="sm" className="shrink-0">
          פרטים
        </Button>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden hover:ring-1 hover:ring-beauty-primary/20 transition-shadow cursor-pointer" onClick={onClick}>
      <div className="h-2 bg-beauty-primary opacity-80"></div>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={client.photo_url} alt={fullName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium">{fullName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <ClientStatusBadge status={client.status} />
              {client.loyaltyPoints !== undefined && client.loyaltyPoints > 0 && (
                <Badge variant="outline" className="bg-amber-50">
                  <Star className="h-3 w-3 mr-1 text-amber-500" /> {client.loyaltyPoints}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{client.phone}</span>
          </div>
          
          {client.lastVisit && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>ביקור אחרון: {formatDate(client.lastVisit)}</span>
            </div>
          )}
          
          {client.nextAppointment && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>תור הבא: {formatDate(client.nextAppointment)}</span>
            </div>
          )}
          
          {client.tags && client.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {client.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <Button className="w-full mt-3" variant="outline" size="sm">
          צפה בפרופיל
        </Button>
      </CardContent>
    </Card>
  );
};
