
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSignup } from "@/contexts/SignupContext";
import ColorPicker from "./brand/ColorPicker";

const VisualIdentityStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleColorChange = (field: string, value: string) => {
    updateSignupData({ [field]: value });
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateSignupData({ logo: file });
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = function(event) {
        if (event.target?.result) {
          const previewUrl = event.target.result as string;
          // Note: this is just for the preview, actual URL comes after upload
          updateSignupData({ logoUrl: previewUrl });
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const selectLogoFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Upload Section */}
        <div>
          <Label className="block mb-2">לוגו העסק</Label>
          <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {signupData.logoUrl ? (
              <div className="relative">
                <img 
                  src={signupData.logoUrl} 
                  alt="Logo preview" 
                  className="mx-auto h-32 w-32 object-contain" 
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={selectLogoFile}
                >
                  החלף לוגו
                </Button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-4 cursor-pointer"
                onClick={selectLogoFile}
              >
                <div className="border border-gray-300 rounded-full p-3 mb-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                    <line x1="16" y1="5" x2="22" y2="5"></line>
                    <line x1="19" y1="2" x2="19" y2="8"></line>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                  </svg>
                </div>
                <Label className="cursor-pointer">לחצי להעלאת לוגו</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  מומלץ בגודל 512x512 פיקסלים
                </p>
              </div>
            )}
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>
        </div>
        
        {/* Color Scheme Section */}
        <div>
          <Label className="block mb-2">צבעי מותג ראשיים</Label>
          <div className="space-y-4">
            <ColorPicker 
              id="primaryColor"
              label="צבע ראשי"
              value={signupData.primaryColor}
              onChange={(value) => handleColorChange("primaryColor", value)}
            />
            
            <ColorPicker 
              id="accentColor"
              label="צבע משני"
              value={signupData.accentColor}
              onChange={(value) => handleColorChange("accentColor", value)}
            />
          </div>
        </div>
      </div>
      
      {/* Preview Section */}
      <Card className="overflow-hidden">
        <div className="h-8" style={{ backgroundColor: signupData.primaryColor }}></div>
        <CardContent className="pt-6">
          <div className="flex items-center">
            {signupData.logoUrl && (
              <div 
                className="mr-4 w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border"
                style={{ borderColor: signupData.accentColor }}
              >
                <img 
                  src={signupData.logoUrl} 
                  alt="Logo preview" 
                  className="w-10 h-10 object-contain" 
                />
              </div>
            )}
            <div>
              <h3 className="font-medium">{signupData.businessName || "שם העסק שלך"}</h3>
              <p className="text-sm text-muted-foreground">תצוגה מקדימה של המותג שלך</p>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <div 
              className="h-8 w-8 rounded-full border"
              style={{ backgroundColor: signupData.primaryColor }}
            ></div>
            <div 
              className="h-8 w-8 rounded-full border"
              style={{ backgroundColor: signupData.accentColor }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualIdentityStep;
