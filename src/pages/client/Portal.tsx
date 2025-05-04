
import ClientLayout from "@/components/layouts/ClientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CreditCard, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Mock data for client portal
const upcomingAppointments = [
  {
    id: 1,
    date: "June 12, 2025",
    time: "2:30 PM",
    service: "Hair Styling",
    duration: "45 min",
    status: "confirmed"
  }
];

const treatments = [
  { id: 1, name: "Signature Facial", description: "Hydrating and rejuvenating facial treatment", price: "$120", popular: true },
  { id: 2, name: "Hair Styling", description: "Cut, style, and blowout", price: "$85", popular: false },
  { id: 3, name: "Manicure", description: "Nail care and polish application", price: "$45", popular: true },
];

const ClientPortal = () => {
  const clientName = "Sarah";
  const businessName = "GlowUp Salon";
  const rewardPoints = 230;
  
  return (
    <ClientLayout businessName={businessName} clientName={clientName}>
      <div className="space-y-6 pb-10">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-beauty-primary/80 to-beauty-primary text-white">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {clientName}!</h2>
            <p className="opacity-90">You have {rewardPoints} reward points</p>
            <div className="mt-4 flex gap-3">
              <Button asChild size="sm" variant="secondary">
                <Link to="/client/appointments">Book Appointment</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="text-white border-white hover:text-beauty-primary">
                <Link to="/client/rewards">View Rewards</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Appointments */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-beauty-dark">Upcoming Appointments</h3>
            <Button asChild variant="ghost" size="sm" className="text-beauty-primary">
              <Link to="/client/appointments">View All</Link>
            </Button>
          </div>
          
          {upcomingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="overflow-hidden">
                  <div className="grid grid-cols-[1fr,auto] items-center">
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <Calendar className="h-4 w-4 text-beauty-primary mr-2" />
                        <span className="text-sm font-medium">{appointment.date}, {appointment.time}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {appointment.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{appointment.service}</h4>
                      <p className="text-sm text-muted-foreground">{appointment.duration}</p>
                    </CardContent>
                    <div className="bg-beauty-accent h-full flex items-center p-4">
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No upcoming appointments</p>
                <Button className="mt-4 bg-beauty-primary hover:bg-opacity-90">
                  Book Now
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Popular Treatments */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-beauty-dark">Popular Treatments</h3>
            <Button asChild variant="ghost" size="sm" className="text-beauty-primary">
              <Link to="/client/treatments">View All</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {treatments.map((treatment) => (
              <Card key={treatment.id} className="h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{treatment.name}</CardTitle>
                    {treatment.popular && (
                      <Badge className="bg-beauty-primary">Popular</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{treatment.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{treatment.price}</span>
                    <Button size="sm">Book</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-beauty-dark">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/client/appointments">
                <Calendar className="h-5 w-5 mb-2" />
                <span>Appointments</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/client/treatments">
                <Settings className="h-5 w-5 mb-2" />
                <span>Treatments</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/client/rewards">
                <Settings className="h-5 w-5 mb-2" />
                <span>Rewards</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex flex-col items-center justify-center">
              <Link to="/client/payments">
                <CreditCard className="h-5 w-5 mb-2" />
                <span>Payments</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default ClientPortal;
