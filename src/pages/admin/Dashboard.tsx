
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, UserCheck, CreditCard, ChartBar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for the dashboard
const appointmentsToday = [
  { id: 1, time: "10:00 AM", client: "Emma Smith", service: "Hair Coloring", duration: "90 mins" },
  { id: 2, time: "12:30 PM", client: "Rachel Green", service: "Manicure", duration: "45 mins" },
  { id: 3, time: "2:00 PM", client: "Monica Geller", service: "Facial", duration: "60 mins" },
];

const AdminDashboard = () => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-beauty-dark">Dashboard</h1>
            <p className="text-muted-foreground">{currentDate}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-beauty-primary hover:bg-opacity-90">
              <Calendar className="mr-2 h-4 w-4" /> New Appointment
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                <UserCheck className="h-5 w-5 text-beauty-primary" />
              </div>
              <div className="text-2xl font-bold">145</div>
              <p className="text-xs text-muted-foreground mt-1">+4 this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                <Calendar className="h-5 w-5 text-beauty-primary" />
              </div>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <CreditCard className="h-5 w-5 text-beauty-primary" />
              </div>
              <div className="text-2xl font-bold">$1,240</div>
              <p className="text-xs text-muted-foreground mt-1">+8% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Utilization</CardTitle>
                <ChartBar className="h-5 w-5 text-beauty-primary" />
              </div>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground mt-1">+2% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>You have {appointmentsToday.length} appointments today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointmentsToday.map((appointment) => (
                  <div key={appointment.id} className="flex items-center p-4 rounded-lg bg-beauty-accent">
                    <div className="mr-4 flex-shrink-0 w-14 text-center">
                      <div className="font-medium text-beauty-primary">{appointment.time}</div>
                      <div className="text-xs text-muted-foreground">{appointment.duration}</div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-medium truncate">{appointment.client}</div>
                      <div className="text-sm text-muted-foreground">{appointment.service}</div>
                    </div>
                    <Button variant="outline" size="sm" className="ml-3">View</Button>
                  </div>
                ))}
                <div className="text-center mt-4">
                  <Button variant="link" className="text-beauty-primary">
                    View Full Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Business Insights</CardTitle>
              <CardDescription>Your business at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="performance">
                <TabsList className="w-full">
                  <TabsTrigger value="performance" className="flex-1">Performance</TabsTrigger>
                  <TabsTrigger value="clients" className="flex-1">Clients</TabsTrigger>
                </TabsList>
                <TabsContent value="performance" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Most Popular Service</span>
                      <span className="font-medium">Hair Styling</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Appointment Value</span>
                      <span className="font-medium">$85</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Busiest Day of Week</span>
                      <span className="font-medium">Saturday</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Return Rate</span>
                      <span className="font-medium">68%</span>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="clients" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>New Clients (This Month)</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Repeat Clients</span>
                      <span className="font-medium">87</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Average Client Spend</span>
                      <span className="font-medium">$240/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Client Retention</span>
                      <span className="font-medium">76%</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <ChartBar className="mr-2 h-4 w-4" />
                  View Detailed Reports
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mr-3 bg-beauty-primary/20 rounded-full p-2">
                    <Calendar className="h-4 w-4 text-beauty-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New Appointment Booked</p>
                    <p className="text-sm text-muted-foreground">Emma Smith booked a Hair Coloring for tomorrow</p>
                    <p className="text-xs text-muted-foreground mt-1">20 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 bg-beauty-primary/20 rounded-full p-2">
                    <UserCheck className="h-4 w-4 text-beauty-primary" />
                  </div>
                  <div>
                    <p className="font-medium">New Client Created</p>
                    <p className="text-sm text-muted-foreground">Rachel Green was added as a new client</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 bg-beauty-primary/20 rounded-full p-2">
                    <CreditCard className="h-4 w-4 text-beauty-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Received</p>
                    <p className="text-sm text-muted-foreground">Monica Geller paid $120 for Facial treatment</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <UserCheck className="h-5 w-5 mb-2" />
                  <span>Add Client</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Calendar className="h-5 w-5 mb-2" />
                  <span>Book Appointment</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <CreditCard className="h-5 w-5 mb-2" />
                  <span>Record Payment</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <ChartBar className="h-5 w-5 mb-2" />
                  <span>View Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
