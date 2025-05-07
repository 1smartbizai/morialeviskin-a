
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BrandSettingsStepProps {
  data: any;
  updateData: (data: any) => void;
}

const BrandSettingsStep = ({ data, updateData }: BrandSettingsStepProps) => {
  const [previewText, setPreviewText] = useState("נצלי את הכוח של Bellevo לניהול העסק שלך");
  
  // Default color values if not set
  const brandSettings = {
    backgroundColor: data.backgroundColor || "#FFFFFF",
    headingTextColor: data.headingTextColor || "#1A1F2C",
    bodyTextColor: data.bodyTextColor || "#333333",
    actionTextColor: data.actionTextColor || "#FFFFFF",
    buttonBgColor1: data.buttonBgColor1 || "#6A0DAD",
    buttonBgColor2: data.buttonBgColor2 || "#8B5CF6",
    buttonTextColor1: data.buttonTextColor1 || "#FFFFFF",
    buttonTextColor2: data.buttonTextColor2 || "#FFFFFF",
    brandTone: data.brandTone || "professional"
  };

  const handleColorChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  const handleToneChange = (tone: string) => {
    updateData({ brandTone: tone });
    
    // Update preview text based on tone
    switch(tone) {
      case "professional":
        setPreviewText("נצלי את הכוח של Bellevo לניהול העסק שלך");
        break;
      case "soft":
        setPreviewText("ברוכה הבאה לחוויה הנעימה של Bellevo");
        break;
      case "personal":
        setPreviewText("היי! אנחנו שמחים שבחרת ב-Bellevo");
        break;
      case "modern":
        setPreviewText("גלי את הדרך החדשנית לניהול העסק שלך");
        break;
      case "minimalist":
        setPreviewText("Bellevo. פשוט עובד.");
        break;
    }
  };

  return (
    <div className="space-y-8 rtl" dir="rtl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Label className="block mb-2">טון מותג</Label>
            <Select
              value={brandSettings.brandTone}
              onValueChange={handleToneChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחרי את הטון של המותג שלך" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">מקצועי</SelectItem>
                <SelectItem value="soft">רגוע</SelectItem>
                <SelectItem value="personal">אישי</SelectItem>
                <SelectItem value="modern">מודרני</SelectItem>
                <SelectItem value="minimalist">מינימליסטי</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              הטון יקבע את השפה והאווירה של האפליקציה שלך
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="backgroundColor">רקע כללי</Label>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: brandSettings.backgroundColor }}
                />
                <Input
                  id="backgroundColor"
                  type="color"
                  value={brandSettings.backgroundColor}
                  onChange={(e) => handleColorChange("backgroundColor", e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="headingTextColor">צבע כותרות</Label>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: brandSettings.headingTextColor }}
                />
                <Input
                  id="headingTextColor"
                  type="color"
                  value={brandSettings.headingTextColor}
                  onChange={(e) => handleColorChange("headingTextColor", e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bodyTextColor">צבע טקסט</Label>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: brandSettings.bodyTextColor }}
                />
                <Input
                  id="bodyTextColor"
                  type="color"
                  value={brandSettings.bodyTextColor}
                  onChange={(e) => handleColorChange("bodyTextColor", e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="actionTextColor">צבע טקסט לפעולות</Label>
              <div className="flex items-center gap-2 mt-1">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: brandSettings.actionTextColor }}
                />
                <Input
                  id="actionTextColor"
                  type="color"
                  value={brandSettings.actionTextColor}
                  onChange={(e) => handleColorChange("actionTextColor", e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label className="block mb-2">צבעי כפתורים</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buttonBgColor1" className="text-xs">כפתור ראשי - רקע</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: brandSettings.buttonBgColor1 }}
                  />
                  <Input
                    id="buttonBgColor1"
                    type="color"
                    value={brandSettings.buttonBgColor1}
                    onChange={(e) => handleColorChange("buttonBgColor1", e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="buttonTextColor1" className="text-xs">כפתור ראשי - טקסט</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: brandSettings.buttonTextColor1 }}
                  />
                  <Input
                    id="buttonTextColor1"
                    type="color"
                    value={brandSettings.buttonTextColor1}
                    onChange={(e) => handleColorChange("buttonTextColor1", e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="buttonBgColor2" className="text-xs">כפתור משני - רקע</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: brandSettings.buttonBgColor2 }}
                  />
                  <Input
                    id="buttonBgColor2"
                    type="color"
                    value={brandSettings.buttonBgColor2}
                    onChange={(e) => handleColorChange("buttonBgColor2", e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="buttonTextColor2" className="text-xs">כפתור משני - טקסט</Label>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: brandSettings.buttonTextColor2 }}
                  />
                  <Input
                    id="buttonTextColor2"
                    type="color"
                    value={brandSettings.buttonTextColor2}
                    onChange={(e) => handleColorChange("buttonTextColor2", e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Live Preview Panel */}
        <div className="bg-muted/30 rounded-lg">
          <div className="p-4">
            <h3 className="font-medium text-center mb-2">תצוגה מקדימה בזמן אמת</h3>
            <div className="mt-4">
              <div 
                className="rounded-lg overflow-hidden border shadow-md"
                style={{ backgroundColor: brandSettings.backgroundColor }}
              >
                <div className="p-4">
                  <div className="flex items-center space-x-4 justify-center">
                    {data.logoUrl && (
                      <img src={data.logoUrl} alt="לוגו" className="w-16 h-16 object-contain rounded" />
                    )}
                  </div>
                  
                  <h1 
                    className="text-xl font-bold text-center mt-4"
                    style={{ color: brandSettings.headingTextColor }}
                  >
                    {data.businessName || "העסק שלך"}
                  </h1>
                  
                  <p 
                    className="text-center my-4" 
                    style={{ color: brandSettings.bodyTextColor }}
                  >
                    {previewText}
                  </p>
                  
                  <div className="flex justify-center space-x-4 mt-6">
                    <button 
                      className="px-4 py-2 rounded"
                      style={{ 
                        backgroundColor: brandSettings.buttonBgColor1,
                        color: brandSettings.buttonTextColor1
                      }}
                    >
                      קביעת תור
                    </button>
                    
                    <button 
                      className="px-4 py-2 rounded border"
                      style={{ 
                        backgroundColor: brandSettings.buttonBgColor2,
                        color: brandSettings.buttonTextColor2
                      }}
                    >
                      פרטים נוספים
                    </button>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <small style={{ color: brandSettings.bodyTextColor }}>
                      מופעל ע״י Bellevo
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandSettingsStep;
