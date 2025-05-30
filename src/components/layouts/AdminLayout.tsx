import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  BarChart3,
  Settings,
  CreditCard,
  MessageSquare,
  Award,
  Brain,
  Home,
  Menu,
  Sparkles,
  Lock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { FeatureGate, PlanBadge } from "@/components/plan-gating";
import { usePlanPermissions } from "@/hooks/usePlanPermissions";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();
  const { isFeatureLocked, getFeatureRequiredPlan } = usePlanPermissions();

  const navigation = [
    { name: "דשבורד", href: "/admin", icon: Home },
    { name: "לוח שנה", href: "/admin/calendar", icon: Calendar },
    { name: "לקוחות", href: "/admin/clients", icon: Users, feature: "unlimited_clients" as const },
    { name: "תורים", href: "/admin/appointments", icon: Calendar },
    { name: "תשלומים", href: "/admin/payments", icon: CreditCard },
    { name: "הודעות", href: "/admin/messages", icon: MessageSquare, feature: "sms_messaging" as const },
    { name: "נאמנות", href: "/admin/loyalty", icon: Award, feature: "loyalty_program" as const },
    { name: "דוחות", href: "/admin/analytics", icon: BarChart3, feature: "advanced_analytics" as const },
    { name: "תובנות AI", href: "/admin/insights", icon: Brain, feature: "ai_insights" as const },
    { name: "הגדרות", href: "/admin/business-settings", icon: Settings }
  ];

  const NavigationItems = () => (
    <nav className="flex flex-col space-y-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        const locked = item.feature && isFeatureLocked(item.feature);
        const requiredPlan = item.feature && getFeatureRequiredPlan(item.feature);
        
        return (
          <div key={item.name} className="relative">
            <Link
              to={locked ? "#" : item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : locked
                  ? "text-muted-foreground hover:bg-muted cursor-not-allowed opacity-60"
                  : "text-foreground hover:bg-muted"
              }`}
              onClick={(e) => {
                if (locked) {
                  e.preventDefault();
                }
                setSidebarOpen(false);
              }}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
              {locked && <Lock className="h-3 w-3 mr-auto" />}
            </Link>
            {locked && requiredPlan && (
              <div className="absolute -top-1 -left-1">
                <PlanBadge plan={requiredPlan} size="sm" />
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="md:hidden fixed top-4 right-4 z-50"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold">Bellevo</h2>
            </div>
            <div className="flex-1 p-4">
              <NavigationItems />
            </div>
            <div className="p-4 border-t">
              <Button
                variant="outline"
                onClick={signOut}
                className="w-full"
              >
                התנתק
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-card border-l">
          <div className="flex items-center h-16 px-6 border-b">
            <h1 className="text-xl font-bold bg-gradient-to-l from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Bellevo
            </h1>
          </div>
          <div className="flex-1 p-4">
            <NavigationItems />
          </div>
          <div className="p-4 border-t">
            <Button
              variant="outline"
              onClick={signOut}
              className="w-full"
            >
              התנתק
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pr-64">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
