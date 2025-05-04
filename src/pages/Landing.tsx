
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 py-6 md:px-6 md:py-8">
        <div className="beauty-container flex items-center justify-between">
          <div className="font-bold text-2xl">Bellevo</div>
          <div className="flex items-center space-x-2">
            <Link to="/client/auth">
              <Button variant="outline">כניסת לקוחות</Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline">הרשמת עסקים</Button>
            </Link>
            <Link to="/admin/login">
              <Button>כניסת בעל עסק</Button>
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="px-4 md:px-6 py-12 md:py-24 lg:py-32">
        <div className="beauty-container flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
            הפלטפורמה שמעצימה את העסק שלך
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mb-8">
            Streamline appointments, payments, and client management for your beauty business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup">
              <Button size="lg" className="beauty-button">Start Free Trial</Button>
            </Link>
            <Button size="lg" variant="outline" className="beauty-button">
              Book a Demo
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="px-4 md:px-6 py-12 md:py-24 bg-muted/50">
        <div className="beauty-container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Everything you need to run your beauty business
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature cards */}
            <div className="beauty-card p-6">
              <h3 className="text-xl font-semibold mb-3">Smart Scheduling</h3>
              <p className="text-muted-foreground">Intelligent appointment booking system that prevents double-bookings.</p>
            </div>
            
            <div className="beauty-card p-6">
              <h3 className="text-xl font-semibold mb-3">Client Management</h3>
              <p className="text-muted-foreground">Keep track of client preferences, history, and communications.</p>
            </div>
            
            <div className="beauty-card p-6">
              <h3 className="text-xl font-semibold mb-3">Payment Processing</h3>
              <p className="text-muted-foreground">Accept payments online and in-person with integrated payment solutions.</p>
            </div>
            
            <div className="beauty-card p-6">
              <h3 className="text-xl font-semibold mb-3">Marketing Tools</h3>
              <p className="text-muted-foreground">Send targeted promotions and automated reminders to clients.</p>
            </div>
            
            <div className="beauty-card p-6">
              <h3 className="text-xl font-semibold mb-3">Business Analytics</h3>
              <p className="text-muted-foreground">Gain insights into your business performance and client trends.</p>
            </div>
            
            <div className="beauty-card p-6">
              <h3 className="text-xl font-semibold mb-3">Client Portal</h3>
              <p className="text-muted-foreground">Give clients a personalized interface to book and manage appointments.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="px-4 md:px-6 py-12 md:py-24">
        <div className="beauty-container flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to grow your beauty business?
          </h2>
          <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
            Join thousands of beauty professionals who are streamlining their business with Bellevo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup">
              <Button size="lg" className="beauty-button">
                Start Your Free Trial
              </Button>
            </Link>
            <Link to="/admin/login">
              <Button size="lg" variant="outline" className="beauty-button">
                כניסת בעל עסק
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="px-4 md:px-6 py-12 bg-muted">
        <div className="beauty-container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="font-bold mb-4 md:mb-0">Bellevo</div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 text-center">
              <a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground">Contact Us</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bellevo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
