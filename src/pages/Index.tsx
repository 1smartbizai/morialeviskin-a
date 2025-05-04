
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-beauty-accent to-beauty-neutral">
      <div className="text-center px-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-beauty-dark animate-fade-in">
          GlowUp Hub Suite
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-beauty-dark/80 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          The all-in-one platform for beauty businesses
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button asChild size="lg" className="bg-beauty-primary hover:bg-opacity-90 text-lg py-6">
            <Link to="/admin">Business Portal</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-beauty-primary text-beauty-dark text-lg py-6">
            <Link to="/client">Client Portal</Link>
          </Button>
        </div>
        <p className="mt-8 text-muted-foreground animate-fade-in" style={{ animationDelay: "0.3s" }}>
          Empowering beauty professionals with smart digital tools
        </p>
      </div>
    </div>
  );
};

export default Index;
