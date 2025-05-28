
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  ChartBar, 
  UserCheck, 
  Settings, 
  CreditCard,
  BellRing,
  MessageSquare,
  Lightbulb,
  Sparkles,
  User,
  LogOut,
  Building,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBusinessOnboarding } from "@/hooks/useBusinessOnboarding";
import { supabase } from "@/integrations/supabase/client";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { businessData } = useBusinessOnboarding();
  
  const navigationItems = [
    { name: "דשבורד ראשי", path: "/admin", icon: ChartBar, color: "text-blue-600" },
    { name: "לקוחות", path: "/admin/clients", icon: UserCheck, color: "text-green-600" },
    { name: "תורים", path: "/admin/appointments", icon: Calendar, color: "text-purple-600" },
    { name: "לוח שנה", path: "/admin/calendar", icon: Calendar, color: "text-indigo-600" },
    { name: "תשלומים", path: "/admin/payments", icon: CreditCard, color: "text-orange-600" },
    { name: "ניהול העסק", path: "/admin/business-management", icon: Sparkles, color: "text-pink-600" },
    { name: "דוחות ותחזיות", path: "/admin/insights", icon: ChartBar, color: "text-teal-600" },
    { name: "תובנות AI", path: "/admin/ai-insights", icon: Lightbulb, color: "text-yellow-600" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/admin/login");
      toast({
        title: "התנתקת בהצלחה",
        description: "נתראה בקרוב!"
      });
    } catch (error) {
      toast({
        title: "שגיאה בהתנתקות",
        description: "אנא נסה שוב",
        variant: "destructive"
      });
    }
  };

  const handleNotificationClick = () => {
    toast({
      title: "🔔 התראות",
      description: "אין התראות חדשות - הכל מעודכן!"
    });
  };

  // Use business colors if available, otherwise fallback to defaults
  const primaryColor = businessData?.primary_color || "#6A0DAD";
  const accentColor = businessData?.accent_color || "#5AA9E6";
  const businessName = businessData?.business_name || "GlowUp Suite";
  const ownerName = businessData?.first_name || "Admin";

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-beauty-neutral overflow-hidden" dir="rtl">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white shadow-xl z-30 fixed inset-y-0 right-0 transform transition-all duration-300 ease-in-out border-l border-gray-200",
          "backdrop-blur-lg bg-white/95",
          isMobile ? (sidebarOpen ? "translate-x-0 w-72" : "translate-x-full") : "translate-x-0 w-72"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header with close button for mobile */}
          {isMobile && (
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">תפריט ניווט</h2>
              <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Branding */}
          <div className="px-6 py-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              {businessData?.logo_url && (
                <div className="relative">
                  <img 
                    src={businessData.logo_url} 
                    alt={businessName}
                    className="h-12 w-12 rounded-full object-cover shadow-md ring-2 ring-white"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-bold bg-gradient-to-l from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {businessName}
                </h2>
                <p className="text-sm text-gray-500">מערכת ניהול מתקדמת</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 pt-6 pb-4 overflow-y-auto">
            <div className="px-3 space-y-2">
              {navigationItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={cn(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300",
                    "hover:scale-105 hover:shadow-md relative overflow-hidden",
                    location.pathname === item.path
                      ? "text-white shadow-lg transform scale-105"
                      : "text-gray-700 hover:bg-gradient-to-l hover:from-purple-50 hover:to-pink-50 hover:text-purple-700"
                  )}
                  style={location.pathname === item.path ? { 
                    background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` 
                  } : {}}
                >
                  <item.icon className={cn(
                    "ml-3 h-5 w-5 transition-transform duration-300",
                    location.pathname === item.path ? "text-white" : item.color,
                    "group-hover:scale-110"
                  )} />
                  <span className="transition-all duration-300">
                    {item.name}
                  </span>
                  {location.pathname === item.path && (
                    <div className="absolute inset-0 bg-gradient-to-l from-white/20 to-transparent rounded-xl" />
                  )}
                </Link>
              ))}
            </div>
          </nav>
          
          {/* Settings Link */}
          <div className="p-4 border-t border-gray-100">
            <Link
              to="/admin/business-settings"
              onClick={() => isMobile && setSidebarOpen(false)}
              className="group flex items-center px-4 py-3 text-sm font-medium rounded-xl text-gray-700 hover:bg-gradient-to-l hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 transition-all duration-300 hover:scale-105"
            >
              <Settings className="ml-3 h-5 w-5 text-blue-600 transition-transform duration-300 group-hover:rotate-45" />
              הגדרות העסק
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isMobile ? (sidebarOpen ? "mr-72" : "mr-0") : "mr-72"
      )}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm z-20 border-b border-gray-100">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar}
                  className="hover:bg-purple-50 hover:text-purple-600 transition-colors duration-300"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {navigationItems.find(item => item.path === location.pathname)?.name || "דשבורד"}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('he-IL', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNotificationClick}
                className="relative hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 hover:scale-110"
              >
                <BellRing className="h-5 w-5" />
                <span className="absolute -top-1 -left-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
              </Button>

              {/* Messages */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/admin/messages')}
                className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 hover:scale-110"
              >
                <MessageSquare className="h-5 w-5" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-3 hover:bg-purple-50 transition-all duration-300 hover:scale-105 px-3 py-2 h-auto rounded-xl"
                  >
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-800">{ownerName}</div>
                      <div className="text-xs text-gray-500">{businessName}</div>
                    </div>
                    <div 
                      className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {ownerName[0]?.toUpperCase() || 'A'}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-lg border-gray-200">
                  <DropdownMenuLabel className="text-right">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{ownerName}</p>
                      <p className="text-xs text-gray-500">{businessName}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => navigate('/admin/business-settings')}
                    className="flex items-center gap-2 cursor-pointer hover:bg-purple-50"
                  >
                    <Building className="h-4 w-4" />
                    הגדרות העסק
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/admin/settings')}
                    className="flex items-center gap-2 cursor-pointer hover:bg-blue-50"
                  >
                    <User className="h-4 w-4" />
                    פרופיל אישי
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 cursor-pointer hover:bg-red-50 text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    התנתק
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-beauty-neutral p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;
