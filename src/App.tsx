
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminClients from "./pages/admin/Clients";
import AdminAppointments from "./pages/admin/Appointments";
import AdminPayments from "./pages/admin/Payments";
import AdminInsights from "./pages/admin/Insights";
import ClientPortal from "./pages/client/Portal";
import ClientAppointments from "./pages/client/Appointments";
import ClientTreatments from "./pages/client/Treatments";
import ClientRewards from "./pages/client/Rewards";
import ClientPayments from "./pages/client/Payments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/clients" element={<AdminClients />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/insights" element={<AdminInsights />} />
          
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
  </QueryClientProvider>
);

export default App;
