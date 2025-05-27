
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Calendar, 
  ChartBar, 
  UserCheck, 
  Settings, 
  CreditCard,
  BellRing,
  MessageSquare,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBusinessOnboarding } from "@/hooks/useBusinessOnboarding";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { businessData } = useBusinessOnboarding();
  
  const navigationItems = [
    { name: "Dashboard", path: "/admin", icon: ChartBar },
    { name: "Clients", path: "/admin/clients", icon: UserCheck },
    { name: "Appointments", path: "/admin/appointments", icon: Calendar },
    { name: "Calendar", path: "/admin/calendar", icon: Calendar },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Business Management", path: "/admin/business-management", icon: Sparkles },
    { name: "Insights", path: "/admin/insights", icon: ChartBar },
    { name: "AI Insights", path: "/admin/ai-insights", icon: Lightbulb },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNotificationClick = () => {
    toast({
      title: "אין התראות חדשות",
      description: "הכל מעודכן!"
    });
  };

  // Use business colors if available, otherwise fallback to defaults
  const primaryColor = businessData?.primary_color || "#6A0DAD";
  const accentColor = businessData?.accent_color || "#5AA9E6";
  const businessName = businessData?.business_name || "GlowUp Suite";

  return (
    <div className="flex h-screen bg-beauty-neutral overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white shadow-lg z-20 fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out",
          isMobile ? (sidebarOpen ? "translate-x-0 w-64" : "-translate-x-full") : "translate-x-0 w-64"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Branding */}
          <div className="px-4 py-6 border-b border-beauty-accent">
            <div className="flex items-center gap-3">
              {businessData?.logo_url && (
                <img 
                  src={businessData.logo_url} 
                  alt={businessName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-medium" style={{ color: primaryColor }}>
                  {businessName}
                </h2>
                <p className="text-sm text-gray-500">מערכת ניהול</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="px-2 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "group flex items-center px-3 py-3 text-sm font-medium rounded-md",
                    location.pathname === item.path
                      ? "text-white"
                      : "text-beauty-dark hover:bg-beauty-accent"
                  )}
                  style={location.pathname === item.path ? { backgroundColor: primaryColor } : {}}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
          
          {/* Settings */}
          <div className="p-4 border-t border-beauty-accent">
            <Link
              to="/admin/settings"
              className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-beauty-dark hover:bg-beauty-accent"
            >
              <Settings className="mr-3 h-5 w-5" />
              הגדרות
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        isMobile ? (sidebarOpen ? "ml-64" : "ml-0") : "ml-64"
      )}>
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="mr-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-beauty-dark">
                {navigationItems.find(item => item.path === location.pathname)?.name || "Admin"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNotificationClick}
              >
                <BellRing className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => toast({
                  title: "הודעות",
                  description: "אין הודעות חדשות"
                })}
              >
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {businessData?.first_name?.[0] || 'A'}
              </Button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-beauty-neutral p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
