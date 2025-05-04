
import { useState } from "react";
import { Calendar, Clock, User, X, Briefcase, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AppointmentBadge from "./AppointmentBadge";
import { Appointment } from "./AppointmentCard";

interface AppointmentDetailsProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (appointmentId: string, newStatus: Appointment['status']) => void;
}

const AppointmentDetails = ({ 
  appointment, 
  isOpen, 
  onClose,
  onStatusChange 
}: AppointmentDetailsProps) => {
  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">פרטי פגישה</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Client Info */}
          <div className="flex items-center gap-3">
            <div className="bg-beauty-accent p-2 rounded-full">
              <User className="h-5 w-5 text-beauty-primary" />
            </div>
            <div>
              <h3 className="font-medium">{appointment.clientName}</h3>
              <p className="text-sm text-muted-foreground">לקוח</p>
            </div>
          </div>
          
          {/* Service Info */}
          <div className="flex items-center gap-3">
            <div className="bg-beauty-accent p-2 rounded-full">
              <Briefcase className="h-5 w-5 text-beauty-primary" />
            </div>
            <div>
              <h3 className="font-medium">{appointment.serviceName}</h3>
              <p className="text-sm text-muted-foreground">{appointment.duration} דקות</p>
            </div>
          </div>
          
          {/* Time Info */}
          <div className="flex items-center gap-3">
            <div className="bg-beauty-accent p-2 rounded-full">
              <Clock className="h-5 w-5 text-beauty-primary" />
            </div>
            <div>
              <h3 className="font-medium">{appointment.time}</h3>
              <p className="text-sm text-muted-foreground">2025/05/25</p>
            </div>
          </div>
          
          {/* Payment Info */}
          <div className="flex items-center gap-3">
            <div className="bg-beauty-accent p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-beauty-primary" />
            </div>
            <div>
              <h3 className="font-medium">₪180</h3>
              <p className="text-sm text-muted-foreground">התשלום התקבל</p>
            </div>
          </div>
          
          {/* Status Controls */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-2">סטטוס</h4>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={appointment.status === "confirmed" ? "bg-emerald-100" : ""}
                onClick={() => onStatusChange(appointment.id, "confirmed")}
              >
                מאושר
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={appointment.status === "done" ? "bg-sky-100" : ""}
                onClick={() => onStatusChange(appointment.id, "done")}
              >
                בוצע
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={appointment.status === "pending" ? "bg-amber-100" : ""}
                onClick={() => onStatusChange(appointment.id, "pending")}
              >
                ממתין
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={appointment.status === "canceled" ? "bg-rose-100" : ""}
                onClick={() => onStatusChange(appointment.id, "canceled")}
              >
                בוטל
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between gap-2">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            סגור
          </Button>
          <Button className="flex-1 bg-beauty-primary hover:bg-beauty-primary/90">
            ערוך פרטים
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetails;
