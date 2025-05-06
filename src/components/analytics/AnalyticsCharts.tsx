
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface ChartData {
  revenueOverTime: Array<{
    name: string;
    revenue: number;
  }>;
  clientsBySegment: Array<{
    name: string;
    value: number;
  }>;
  treatmentPopularity: Array<{
    name: string;
    count: number;
  }>;
}

interface AnalyticsChartsProps {
  data?: ChartData;
  isLoading: boolean;
}

export const AnalyticsCharts = ({ data, isLoading }: AnalyticsChartsProps) => {
  const brandedColors = {
    primary: "#9b87f5",
    secondary: "#7E69AB",
    tertiary: "#6E59A5",
    quaternary: "#D6BCFA",
    accent1: "#FEC6A1",
    accent2: "#FFDEE2",
    accent3: "#D3E4FD",
  };
  
  const pieColors = [
    brandedColors.primary,
    brandedColors.secondary,
    brandedColors.tertiary,
    brandedColors.quaternary,
    brandedColors.accent1,
    brandedColors.accent2,
    brandedColors.accent3,
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Use mock data if real data is not available
  const mockRevenueData = data?.revenueOverTime || [
    { name: "ינואר", revenue: 1200 },
    { name: "פברואר", revenue: 1800 },
    { name: "מרץ", revenue: 2200 },
    { name: "אפריל", revenue: 2600 },
    { name: "מאי", revenue: 3200 },
    { name: "יוני", revenue: 3800 },
  ];
  
  const mockClientSegmentData = data?.clientsBySegment || [
    { name: "חדשים", value: 45 },
    { name: "חוזרים", value: 32 },
    { name: "VIP", value: 28 },
    { name: "לא פעילים", value: 19 },
  ];
  
  const mockTreatmentPopularity = data?.treatmentPopularity || [
    { name: "טיפולי פנים", count: 45 },
    { name: "טיפולי שיער", count: 32 },
    { name: "טיפולי ציפורניים", count: 28 },
    { name: "עיסויים", count: 19 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-medium">הכנסות לאורך זמן</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="line">
            <TabsList className="mb-4">
              <TabsTrigger value="line">גרף קו</TabsTrigger>
              <TabsTrigger value="bar">גרף עמודות</TabsTrigger>
            </TabsList>
            
            <TabsContent value="line">
              <ChartContainer 
                config={{ 
                  revenue: { color: brandedColors.primary }
                }}
                className="h-[300px]"
              >
                <LineChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={{ r: 4 }} 
                  />
                </LineChart>
              </ChartContainer>
            </TabsContent>
            
            <TabsContent value="bar">
              <ChartContainer
                config={{
                  revenue: { color: brandedColors.primary }
                }}
                className="h-[300px]"
              >
                <BarChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="revenue" 
                    fill="var(--color-revenue)" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg font-medium">התפלגות לקוחות וטיפולים</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="segments">
            <TabsList className="mb-4">
              <TabsTrigger value="segments">סגמנטים</TabsTrigger>
              <TabsTrigger value="treatments">טיפולים</TabsTrigger>
            </TabsList>
            
            <TabsContent value="segments">
              <div className="h-[300px] flex justify-center items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockClientSegmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockClientSegmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} לקוחות`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="treatments">
              <ChartContainer
                config={{
                  count: { color: brandedColors.secondary }
                }}
                className="h-[300px]"
              >
                <BarChart 
                  data={mockTreatmentPopularity}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="count" 
                    fill="var(--color-count)" 
                    radius={[0, 4, 4, 0]} 
                  />
                </BarChart>
              </ChartContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
