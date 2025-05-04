
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Calendar, UserCheck, CreditCard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface ClientLayoutProps {
  children: React.ReactNode;
  businessName?: string;
  clientName?: string;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ 
  children, 
  businessName = "GlowUp Salon", 
  clientName = "Sarah"
}) => {
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const navigationItems = [
    { name: "Home", path: "/client", icon: UserCheck },
    { name: "Treatments", path: "/client/treatments", icon: Settings },
    { name: "Appointments", path: "/client/appointments", icon: Calendar },
    { name: "Rewards", path: "/client/rewards", icon: Settings },
    { name: "Payments", path: "/client/payments", icon: CreditCard },
  ];

  const toggleNav = () => {
    setNavOpen(!navOpen);
  };

  return (
    <div className="min-h-screen bg-beauty-neutral">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleNav}
                className="mr-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            )}
            <div>
              <h1 className="text-xl font-medium text-beauty-dark">{businessName}</h1>
              <p className="text-sm text-gray-500">Welcome, {clientName}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full bg-beauty-primary text-white"
          >
            {clientName.charAt(0)}
          </Button>
        </div>
        
        {/* Navigation for desktop */}
        {!isMobile && (
          <nav className="px-4 pb-3">
            <div className="flex space-x-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-md",
                    location.pathname === item.path
                      ? "text-white bg-beauty-primary"
                      : "text-beauty-dark hover:bg-beauty-accent"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Mobile Navigation Menu */}
      {isMobile && (
        <div className={cn(
          "fixed inset-0 bg-gray-900 bg-opacity-50 z-20 transition-opacity duration-300",
          navOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
          <div className={cn(
            "fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ease-in-out",
            navOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="p-4 border-b border-beauty-accent">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">{businessName}</h2>
                <Button variant="ghost" size="icon" onClick={toggleNav}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            </div>
            <nav className="p-4">
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={cn(
                      "block px-4 py-3 text-sm font-medium rounded-md",
                      location.pathname === item.path
                        ? "text-white bg-beauty-primary"
                        : "text-beauty-dark hover:bg-beauty-accent"
                    )}
                    onClick={toggleNav}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-16 pt-4 px-4">
        {children}
      </main>
    </div>
  );
};

export default ClientLayout;
