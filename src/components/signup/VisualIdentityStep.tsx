
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Upload } from "lucide-react";

interface VisualIdentityStepProps {
  data: any;
  updateData: (data: any) => void;
}

const VisualIdentityStep = ({ data, updateData }: VisualIdentityStepProps) => {
  const [logoPreview, setLogoPreview] = useState<string | null>(data.logoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateData({ logo: file });
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (field: "primaryColor" | "accentColor", value: string) => {
    updateData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="block mb-2">Business Logo</Label>
        <Card className="cursor-pointer relative overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            {logoPreview ? (
              <div className="w-full max-w-[200px]">
                <AspectRatio ratio={1/1}>
                  <img 
                    src={logoPreview} 
                    alt="Logo Preview" 
                    className="rounded-full object-cover w-full h-full"
                  />
                </AspectRatio>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change Logo
                </Button>
              </div>
            ) : (
              <div 
                className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted-foreground/20 rounded-lg"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  Drag & drop your logo here
                </p>
                <p className="text-xs text-muted-foreground">
                  or click to browse files
                </p>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleLogoUpload}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primaryColor">Primary Color</Label>
          <div className="flex items-center space-x-2">
            <div 
              className="w-10 h-10 rounded-full border"
              style={{ backgroundColor: data.primaryColor }}
            ></div>
            <Input
              id="primaryColor"
              type="color"
              value={data.primaryColor}
              onChange={(e) => handleColorChange("primaryColor", e.target.value)}
              className="w-full h-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Main color for your brand, used in buttons and highlights
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accentColor">Accent Color</Label>
          <div className="flex items-center space-x-2">
            <div 
              className="w-10 h-10 rounded-full border"
              style={{ backgroundColor: data.accentColor }}
            ></div>
            <Input
              id="accentColor"
              type="color"
              value={data.accentColor}
              onChange={(e) => handleColorChange("accentColor", e.target.value)}
              className="w-full h-10"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Secondary color used for backgrounds and subtle elements
          </p>
        </div>
      </div>

      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Brand Preview</h3>
        
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            {logoPreview && (
              <img src={logoPreview} alt="Logo" className="w-10 h-10 rounded-full object-cover" />
            )}
            <div>
              <div className="font-medium">{data.businessName || "Your Business"}</div>
              <div className="text-sm text-muted-foreground">Beauty & Wellness</div>
            </div>
          </div>
          
          <div className="flex space-x-2 my-2">
            <Button style={{ backgroundColor: data.primaryColor }}>Primary Button</Button>
            <Button variant="outline" style={{ borderColor: data.primaryColor, color: data.primaryColor }}>
              Secondary
            </Button>
          </div>
          
          <div 
            className="p-4 rounded-lg" 
            style={{ backgroundColor: data.accentColor + '20' }} // Using 20 for opacity (12.5%)
          >
            <p className="text-sm">This is how accent colors will appear in your client interface.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualIdentityStep;
