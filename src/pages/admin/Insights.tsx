
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, TrendingUp } from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend 
} from "recharts";

// Mock data for insights
const revenueData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1800 },
  { name: "Mar", total: 2200 },
  { name: "Apr", total: 2600 },
  { name: "May", total: 3200 },
  { name: "Jun", total: 3800 },
];

const clientsByServiceData = [
  { name: "Facials", total: 45 },
  { name: "Hair", total: 32 },
  { name: "Nails", total: 28 },
  { name: "Massage", total: 19 },
];

const AdminInsights = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-beauty-dark">Business Insights</h1>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Last 30 Days
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,245.00</div>
              <div className="text-xs flex items-center text-green-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Clients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <div className="text-xs flex items-center text-green-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.3% from last month
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <div className="text-xs flex items-center text-green-500 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.1% from last month
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Revenue Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F672A5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F672A5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="total" 
                    stroke="#F672A5" 
                    fillOpacity={1} 
                    fill="url(#colorTotal)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Clients by Service Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={clientsByServiceData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Bar dataKey="total" fill="#F672A5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Business Growth Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-1">Increase Booking Rate</h3>
                <p className="text-sm text-muted-foreground">Send automated reminders to clients who haven't booked in the last 30 days.</p>
                <Button className="mt-3 bg-beauty-primary" size="sm">Create Campaign</Button>
              </div>
              <div className="p-4 bg-muted rounded-md">
                <h3 className="font-medium mb-1">Popular Service Upsell</h3>
                <p className="text-sm text-muted-foreground">Clients who book facials are likely to add on eye treatments. Consider a bundle offer.</p>
                <Button className="mt-3 bg-beauty-primary" size="sm">Create Bundle</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminInsights;
