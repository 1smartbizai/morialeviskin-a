
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSignup } from "@/contexts/SignupContext";
import ColorPicker from "./brand/ColorPicker";
import { ImagePlus } from "lucide-react";

const VisualIdentityStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleColorChange = (field: string, value: string) => {
    updateSignupData({ [field]: value });
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("הקובץ גדול מדי. אנא בחרי קובץ בגודל עד 2MB");
        return;
      }
      
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
                  alt="תצוגה מקדימה של הלוגו" 
                  className="mx-auto h-32 w-32 object-contain" 
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={selectLogoFile}
                >
                  החלפת לוגו
                </Button>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center py-4 cursor-pointer"
                onClick={selectLogoFile}
              >
                <div className="border border-gray-300 rounded-full p-3 mb-2">
                  <ImagePlus className="h-6 w-6 text-gray-400" />
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
                className="ml-4 w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border"
                style={{ borderColor: signupData.accentColor }}
              >
                <img 
                  src={signupData.logoUrl} 
                  alt="תצוגה מקדימה של הלוגו" 
                  className="w-10 h-10 object-contain" 
                />
              </div>
            )}
            <div>
              <h3 className="font-medium">{signupData.businessName || "שם העסק שלך"}</h3>
              <p className="text-sm text-muted-foreground">תצוגה מקדימה של המותג שלך</p>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <div 
              className="h-8 w-8 rounded-full border"
              style={{ backgroundColor: signupData.primaryColor }}
              aria-label="צבע ראשי"
            ></div>
            <div 
              className="h-8 w-8 rounded-full border"
              style={{ backgroundColor: signupData.accentColor }}
              aria-label="צבע משני"
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualIdentityStep;
