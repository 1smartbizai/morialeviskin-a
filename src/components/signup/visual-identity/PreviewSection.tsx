
import { Card, CardContent } from "@/components/ui/card";

interface PreviewSectionProps {
  logoUrl: string | undefined;
  businessName: string;
  primaryColor: string;
  accentColor: string;
}

const PreviewSection = ({ logoUrl, businessName, primaryColor, accentColor }: PreviewSectionProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="h-8" style={{ backgroundColor: primaryColor }}></div>
      <CardContent className="pt-6">
        <div className="flex items-center">
          {logoUrl && (
            <div 
              className="ml-4 w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border"
              style={{ borderColor: accentColor }}
            >
              <img 
                src={logoUrl} 
                alt="תצוגה מקדימה של הלוגו" 
                className="w-10 h-10 object-contain" 
              />
            </div>
          )}
          <div>
            <h3 className="font-medium">{businessName || "שם העסק שלך"}</h3>
            <p className="text-sm text-muted-foreground">תצוגה מקדימה של המותג שלך</p>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <div 
            className="h-8 w-8 rounded-full border"
            style={{ backgroundColor: primaryColor }}
            aria-label="צבע ראשי"
          ></div>
          <div 
            className="h-8 w-8 rounded-full border"
            style={{ backgroundColor: accentColor }}
            aria-label="צבע משני"
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewSection;
