
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminClients from "./pages/admin/Clients";
import ClientManagement from "./pages/admin/ClientManagement";
import AdminAppointments from "./pages/admin/Appointments";
import AdminPayments from "./pages/admin/Payments";
import AdminInsights from "./pages/admin/Insights";
import AIInsightsPage from "./pages/admin/AIInsights";
import AdminLogin from "./pages/admin/Login";
import AdminCalendarView from "./pages/admin/CalendarView";
import ResetPassword from "./pages/admin/ResetPassword";
import UpdatePassword from "./pages/admin/UpdatePassword";
import ClientPortal from "./pages/client/Portal";
import ClientAppointments from "./pages/client/Appointments";
import ClientTreatments from "./pages/client/Treatments";
import ClientRewards from "./pages/client/Rewards";
import ClientPayments from "./pages/client/Payments";
import ClientAuth from "./pages/client/Auth";
import BusinessOwnerSignup from "./pages/BusinessOwnerSignup";
import BusinessManagement from "./pages/admin/BusinessManagement";
import AdminLoyalty from "./pages/admin/Loyalty";
import ClientInsights from "./pages/admin/ClientInsights";
import Analytics from "./pages/admin/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<BusinessOwnerSignup />} />
            <Route path="/client/auth" element={<ClientAuth />} />
            
            {/* Admin Auth routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/reset-password" element={<ResetPassword />} />
            <Route path="/admin/update-password" element={<UpdatePassword />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/clients" element={<AdminClients />} />
            <Route path="/admin/client-management" element={<ClientManagement />} />
            <Route path="/admin/client-insights" element={<ClientInsights />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            <Route path="/admin/calendar" element={<AdminCalendarView />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/insights" element={<AdminInsights />} />
            <Route path="/admin/ai-insights" element={<AIInsightsPage />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/business-management" element={<BusinessManagement />} />
            <Route path="/admin/loyalty" element={<AdminLoyalty />} />
            
            {/* Client routes */}
            <Route path="/client" element={<ClientPortal />} />
            <Route path="/client/appointments" element={<ClientAppointments />} />
            <Route path="/client/treatments" element={<ClientTreatments />} />
            <Route path="/client/rewards" element={<ClientRewards />} />
            <Route path="/client/payments" element={<ClientPayments />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
