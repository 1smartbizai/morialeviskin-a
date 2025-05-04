
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-beauty-accent to-beauty-neutral">
      <header className="beauty-container py-4 md:py-6">
        <div className="flex justify-between items-center">
          <div className="text-beauty-dark">
            <h1 className="text-2xl md:text-3xl font-bold">GlowUp Hub</h1>
            <p className="text-sm text-muted-foreground">Beauty Business Management</p>
          </div>
          <div className="flex space-x-2">
            <Button asChild variant="ghost">
              <Link to="/admin">Admin Login</Link>
            </Button>
            <Button asChild>
              <Link to="/client">Client Login</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center beauty-container py-10">
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-beauty-dark mb-4 animate-fade-in">
            Elevate Your Beauty Business
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            The all-in-one platform for independent beauty professionals to manage appointments, clients, and grow their business
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Button asChild size="lg" className="bg-beauty-primary hover:bg-opacity-90">
              <Link to="/admin">Business Owner Login</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-beauty-primary text-beauty-dark">
              <Link to="/client">Client Login</Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
          <Card className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <CardTitle className="text-beauty-dark flex items-center gap-2">
                <Calendar className="h-5 w-5 text-beauty-primary" />
                Simplified Scheduling
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Easy appointment management for your beauty business, with automated reminders and online booking.
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle className="text-beauty-dark flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-beauty-primary" />
                Client Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Build lasting relationships with detailed client profiles, preferences, and treatment history.
              </p>
            </CardContent>
          </Card>
          
          <Card className="animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle className="text-beauty-dark flex items-center gap-2">
                <ChartBar className="h-5 w-5 text-beauty-primary" />
                Business Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Make data-driven decisions with analytics on appointments, revenue, and client retention.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="bg-beauty-dark text-white py-8">
        <div className="beauty-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">GlowUp Hub</h2>
              <p className="text-sm text-gray-300">Empowering beauty professionals</p>
            </div>
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
              <Link to="#" className="text-sm text-gray-300 hover:text-white">Contact Us</Link>
              <Link to="#" className="text-sm text-gray-300 hover:text-white">Privacy Policy</Link>
              <Link to="#" className="text-sm text-gray-300 hover:text-white">Terms of Service</Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
            &copy; 2025 GlowUp Hub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
