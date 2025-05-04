
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users } from "lucide-react";

// Mock data for appointments
const upcomingAppointments = [
  { 
    id: 1, 
    clientName: "Sarah Johnson", 
    service: "Signature Facial", 
    date: "June 12, 2025", 
    time: "2:30 PM", 
    status: "confirmed" 
  },
  { 
    id: 2, 
    clientName: "Michael Chen", 
    service: "Hair Styling", 
    date: "June 13, 2025", 
    time: "10:00 AM", 
    status: "confirmed" 
  },
  { 
    id: 3, 
    clientName: "Emily Rodriguez", 
    service: "Manicure", 
    date: "June 14, 2025", 
    time: "3:15 PM", 
    status: "pending" 
  }
];

const AdminAppointments = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-beauty-dark">Appointments</h1>
          <Button className="bg-beauty-primary">+ New Appointment</Button>
        </div>
        
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="canceled">Canceled</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-medium">
                  <Calendar className="h-5 w-5 text-beauty-primary" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingAppointments.map((appointment) => (
                    <Card key={appointment.id} className="overflow-hidden">
                      <div className="grid grid-cols-[1fr,auto] items-center">
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{appointment.clientName}</h3>
                          <p className="text-sm text-muted-foreground">{appointment.service}</p>
                          <div className="mt-2 flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {appointment.date}
                            <Clock className="h-3 w-3 ml-3 mr-1" />
                            {appointment.time}
                          </div>
                        </CardContent>
                        <div className="bg-beauty-accent h-full flex items-center p-4">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="past">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No past appointments to display.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="canceled">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No canceled appointments to display.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAppointments;
