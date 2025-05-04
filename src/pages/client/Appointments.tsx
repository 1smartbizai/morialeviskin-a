
import ClientLayout from "@/components/layouts/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for client appointments
const upcomingAppointments = [
  { 
    id: 1, 
    service: "Signature Facial", 
    date: "June 12, 2025", 
    time: "2:30 PM", 
    duration: "60 min",
    status: "confirmed",
    notes: "Please arrive 10 minutes early to complete intake form"
  }
];

const pastAppointments = [
  { 
    id: 2, 
    service: "Hair Styling", 
    date: "May 15, 2025", 
    time: "10:00 AM", 
    duration: "45 min",
    status: "completed" 
  },
  { 
    id: 3, 
    service: "Manicure", 
    date: "April 30, 2025", 
    time: "3:15 PM", 
    duration: "30 min",
    status: "completed" 
  }
];

const ClientAppointments = () => {
  return (
    <ClientLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-beauty-dark">My Appointments</h1>
          <Button className="bg-beauty-primary">+ Book New Appointment</Button>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{appointment.service}</CardTitle>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {appointment.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-muted-foreground">
                          <CalendarDays className="h-4 w-4 mr-2" />
                          {appointment.date}
                          <Clock className="h-4 w-4 ml-4 mr-2" />
                          {appointment.time} ({appointment.duration})
                        </div>
                        
                        {appointment.notes && (
                          <div className="bg-muted p-3 rounded-md text-sm">
                            <p className="font-medium mb-1">Notes:</p>
                            <p className="text-muted-foreground">{appointment.notes}</p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">Reschedule</Button>
                          <Button variant="destructive" className="flex-1">Cancel</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">You don't have any upcoming appointments</p>
                    <Button className="bg-beauty-primary">Book Now</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="past">
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id}>
                  <div className="grid grid-cols-[1fr,auto] items-center">
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{appointment.service}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {appointment.date}
                        <Clock className="h-3 w-3 ml-3 mr-1" />
                        {appointment.time}
                      </div>
                    </CardContent>
                    <div className="bg-beauty-accent h-full flex items-center p-4">
                      <Button variant="outline" size="sm">Book Again</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ClientLayout>
  );
};

export default ClientAppointments;
