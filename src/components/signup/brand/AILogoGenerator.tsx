
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, Loader } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AILogoGeneratorProps {
  onLogoGenerated: (logoUrl: string) => void;
}

const AILogoGenerator = ({ onLogoGenerated }: AILogoGeneratorProps) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // For now, this is a mockup function that simulates AI generation
  // In a real implementation, this would call an API endpoint
  const generateLogo = async () => {
    if (!prompt.trim()) {
      toast({
        title: "נא להזין תיאור ללוגו",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsGenerating(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo, we'll use a placeholder image
      // In production, this would be replaced with actual AI generation
      const mockGeneratedLogoUrl = `https://source.unsplash.com/random/512x512/?logo,${encodeURIComponent(prompt)}`;
      
      onLogoGenerated(mockGeneratedLogoUrl);
      
      toast({
        title: "הלוגו נוצר בהצלחה!",
        description: "תוכלי לערוך אותו בכל עת בהגדרות העסק"
      });
    } catch (error) {
      console.error("Error generating logo:", error);
      toast({
        title: "שגיאה ביצירת הלוגו",
        description: "אנא נסי שוב מאוחר יותר",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="logoPrompt" className="block mb-2">תארי את הלוגו שתרצי</Label>
        <Input
          id="logoPrompt"
          placeholder="לדוגמה: לוגו מודרני לסלון יופי עם פרחים וצבעים רכים"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-2"
        />
        <p className="text-xs text-muted-foreground mb-4">
          תארי בפירוט את הלוגו שתרצי ליצור. ככל שהתיאור יהיה מפורט יותר, כך התוצאה תהיה טובה יותר.
        </p>
      </div>

      <div className="flex justify-center">
        <Button 
          onClick={generateLogo} 
          disabled={isGenerating || !prompt.trim()}
          className="min-w-[200px]"
        >
          {isGenerating ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              מייצר לוגו...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              ליצור לוגו AI
            </>
          )}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          הלוגו שייווצר יהיה בגודל 512x512 פיקסלים ובמבנה PNG שקוף
        </p>
      </div>

      {isGenerating && (
        <div className="mt-6 text-center p-8 border-2 border-dashed rounded-lg">
          <Loader className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
          <p>מייצר את הלוגו המושלם עבורך...</p>
          <p className="text-sm text-muted-foreground mt-1">זה עשוי לקחת מספר שניות</p>
        </div>
      )}
    </div>
  );
};

export default AILogoGenerator;
