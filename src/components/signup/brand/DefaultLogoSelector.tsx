
import { useSignup } from "@/contexts/SignupContext";
import { DEFAULT_LOGOS } from "@/utils/signup/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

const DefaultLogoSelector = () => {
  const { signupData, updateSignupData } = useSignup();
  
  const selectDefaultLogo = (logoId: string) => {
    // If selecting "no logo" option (default5)
    const usesLogo = logoId !== "default5";
    
    updateSignupData({
      usesDefaultLogo: true,
      defaultLogoId: logoId,
      logoUrl: usesLogo ? DEFAULT_LOGOS.find(logo => logo.id === logoId)?.path : undefined
    });
  };

  return (
    <div className="space-y-4">
      <Label className="block mb-2">בחרי לוגו מוכן מראש</Label>
      
      <div className="grid grid-cols-2 gap-3">
        {DEFAULT_LOGOS.map((logo) => (
          <Card 
            key={logo.id}
            className={`cursor-pointer overflow-hidden ${
              signupData.defaultLogoId === logo.id
                ? 'ring-2 ring-primary' 
                : 'hover:bg-accent/50'
            }`}
            onClick={() => selectDefaultLogo(logo.id)}
          >
            <CardContent className="p-2 flex flex-col items-center justify-center">
              <div className="relative">
                {logo.path ? (
                  <div className="w-16 h-16 flex items-center justify-center">
                    <img 
                      src={logo.path} 
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center border border-dashed rounded-md">
                    <span className="text-muted-foreground">ללא לוגו</span>
                  </div>
                )}
                
                {signupData.defaultLogoId === logo.id && (
                  <Badge className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-center mt-2">{logo.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DefaultLogoSelector;
