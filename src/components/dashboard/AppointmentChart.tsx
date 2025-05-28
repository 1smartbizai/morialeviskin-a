
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Calendar, TrendingUp } from "lucide-react";

const AppointmentChart = () => {
  const data = [
    { day: 'א', appointments: 4, trend: 8 },
    { day: 'ב', appointments: 6, trend: 12 },
    { day: 'ג', appointments: 8, trend: 16 },
    { day: 'ד', appointments: 5, trend: 10 },
    { day: 'ה', appointments: 9, trend: 18 },
    { day: 'ו', appointments: 7, trend: 14 },
    { day: 'ש', appointments: 3, trend: 6 },
  ];

  return (
    <Card className="hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white to-blue-50/30 group overflow-hidden">
      <CardHeader className="bg-gradient-to-l from-blue-50 to-purple-50 pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">תורים השבוע</h3>
            <p className="text-sm text-gray-600">התפלגות יומית</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="appointmentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  direction: 'rtl'
                }}
                labelStyle={{ color: '#1f2937', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="appointments"
                stroke="#6366f1"
                strokeWidth={3}
                fill="url(#appointmentGradient)"
                dot={{ fill: '#6366f1', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#6366f1', strokeWidth: 2, fill: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-4 bg-gradient-to-l from-blue-50 to-purple-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">עלייה של</span>
            <span className="font-bold text-green-600">12%</span>
            <span className="text-gray-600">מהשבוע הקודם</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentChart;
