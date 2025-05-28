
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp } from "lucide-react";

const RevenueChart = () => {
  const data = [
    { month: 'ינו', revenue: 15000, target: 18000 },
    { month: 'פבר', revenue: 18000, target: 18000 },
    { month: 'מרץ', revenue: 22000, target: 20000 },
    { month: 'אפר', revenue: 19000, target: 20000 },
    { month: 'מאי', revenue: 25000, target: 22000 },
    { month: 'יונ', revenue: 28000, target: 25000 },
  ];

  return (
    <Card className="hover:shadow-xl transition-all duration-500 border-0 shadow-lg bg-gradient-to-br from-white to-green-50/30 group overflow-hidden">
      <CardHeader className="bg-gradient-to-l from-green-50 to-emerald-50 pb-4">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">הכנסות חודשיות</h3>
            <p className="text-sm text-gray-600">מגמות והשוואה ליעדים</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => `₪${(value / 1000)}K`}
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
                formatter={(value, name) => [
                  `₪${value.toLocaleString()}`, 
                  name === 'revenue' ? 'הכנסות בפועל' : 'יעד'
                ]}
              />
              <Bar 
                dataKey="target" 
                fill="#e5e7eb" 
                radius={[4, 4, 0, 0]}
                name="target"
              />
              <Bar 
                dataKey="revenue" 
                fill="url(#revenueGradient)" 
                radius={[4, 4, 0, 0]}
                name="revenue"
              />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={1}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-4 bg-gradient-to-l from-green-50 to-emerald-50 rounded-xl">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-gray-600">גידול של</span>
            <span className="font-bold text-green-600">₪3,000</span>
            <span className="text-gray-600">מהחודש הקודם</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
