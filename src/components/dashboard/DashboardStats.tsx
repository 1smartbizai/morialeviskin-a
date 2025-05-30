
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, DollarSign, Star, Calendar, Clock } from "lucide-react";

interface DashboardStatsProps {
  appointmentsToday: number;
  monthlyRevenue: number;
  newClients: number;
  satisfactionRate: number;
}

const DashboardStats = ({ appointmentsToday, monthlyRevenue, newClients, satisfactionRate }: DashboardStatsProps) => {
  const stats = [
    {
      title: "תורים היום",
      value: appointmentsToday?.toString() || "0",
      change: "+2 מאתמול",
      changeType: "positive" as const,
      icon: Calendar,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      title: "הכנסות החודש",
      value: `₪${(monthlyRevenue || 0).toLocaleString()}`,
      change: "+15% מחודש קודם",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100"
    },
    {
      title: "לקוחות חדשים",
      value: (newClients || 0).toString(),
      change: "+3 השבוע",
      changeType: "positive" as const,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100"
    },
    {
      title: "דירוג שביעות רצון",
      value: (satisfactionRate || 0).toString(),
      change: "+0.2 מחודש קודם",
      changeType: "positive" as const,
      icon: Star,
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-50 to-orange-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        // Safe check to ensure stat and all its properties exist
        if (!stat || !stat.title || !stat.value || !stat.icon) {
          return null;
        }
        
        return (
          <Card 
            key={stat.title}
            className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 animate-fade-in hover:scale-105 cursor-pointer group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-0">
              <div className={`bg-gradient-to-br ${stat.bgColor} p-6 relative overflow-hidden`}>
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                  <stat.icon className="w-full h-full" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      stat.changeType === 'positive' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <TrendingUp className="h-3 w-3 inline ml-1" />
                      {stat.change}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                    <p className="text-3xl font-bold text-gray-800 group-hover:scale-105 transition-transform duration-300">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DashboardStats;
