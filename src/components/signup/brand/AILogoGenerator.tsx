
import { useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AILogoGeneratorProps {
  onLogoGenerated: (logoUrl: string) => void;
}

const AILogoGenerator = ({ onLogoGenerated }: AILogoGeneratorProps) => {
  const { signupData } = useSignup();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);

  const generateLogo = async () => {
    if (!prompt.trim()) {
      toast({
        title: "נא להזין הנחיה",
        description: "אנא הזיני תיאור של הלוגו שתרצי ליצור",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real implementation, this would call an AI logo generation API
      // For this demo, we'll simulate the API call with a timeout
      setTimeout(() => {
        const mockLogoUrl = `/logos/${['salon-logo.png', 'cosmetics-logo.png', 'spa-logo.png', 'nails-logo.png'][Math.floor(Math.random() * 4)]}`;
        setGeneratedLogos([mockLogoUrl]);
        setIsGenerating(false);
      }, 2000);
    } catch (error) {
      console.error("Error generating logo:", error);
      toast({
        title: "שגיאה ביצירת הלוגו",
        description: "אירעה שגיאה ביצירת הלוגו. אנא נסי שנית מאוחר יותר.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };

  const selectGeneratedLogo = (logoUrl: string) => {
    onLogoGenerated(logoUrl);
    toast({
      title: "הלוגו נבחר בהצלחה",
      description: "הלוגו שנוצר באמצעות AI נבחר בהצלחה"
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="תארי את הלוגו שתרצי ליצור... לדוגמה: לוגו לסלון יופי בצבעי ורוד וזהב עם פרחים"
          className="mb-2"
          rows={3}
        />
        
        <Button
          onClick={generateLogo}
          disabled={isGenerating || !prompt.trim()}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              יוצר לוגו...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              יצירת לוגו עם AI
            </>
          )}
        </Button>
      </div>

      {isGenerating && (
        <div className="flex justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>מעבד את הבקשה שלך...</p>
            <p className="text-sm text-muted-foreground">זה עשוי לקחת מספר שניות</p>
          </div>
        </div>
      )}

      {generatedLogos.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">לוגואים שנוצרו:</h3>
          <div className="grid grid-cols-2 gap-4">
            {generatedLogos.map((logo, index) => (
              <div 
                key={index} 
                className="border rounded-md p-2 cursor-pointer hover:bg-accent/50"
                onClick={() => selectGeneratedLogo(logo)}
              >
                <img 
                  src={logo} 
                  alt={`Generated Logo ${index + 1}`} 
                  className="w-full h-32 object-contain mb-2" 
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectGeneratedLogo(logo);
                  }}
                >
                  בחר לוגו זה
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AILogoGenerator;
