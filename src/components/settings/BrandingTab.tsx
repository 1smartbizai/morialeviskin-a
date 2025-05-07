
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { initStorage } from "@/utils/initStorage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandingTabProps {
  businessOwner: any;
}

interface ColorPreset {
  name: string;
  primary: string;
  accent: string;
}

const colorPresets: ColorPreset[] = [
  { name: "סגול מלכותי", primary: "#6A0DAD", accent: "#5AA9E6" },
  { name: "ורוד רך", primary: "#F2C4DE", accent: "#F7E3EE" },
  { name: "טורקיז מרענן", primary: "#43B0F1", accent: "#BBE6E4" },
  { name: "מנטה", primary: "#4CD5C5", accent: "#AEF1DE" },
  { name: "אפרסק", primary: "#FFADAD", accent: "#FFD6A5" },
  { name: "לבנדר", primary: "#9B87F5", accent: "#D6BCFA" }
];

const BrandingTab = ({ businessOwner }: BrandingTabProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>(businessOwner?.logo_url || "");
  const [primaryColor, setPrimaryColor] = useState<string>(businessOwner?.primary_color || "#6A0DAD");
  const [accentColor, setAccentColor] = useState<string>(businessOwner?.accent_color || "#5AA9E6");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      // Create a temporary URL for preview
      setLogoUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleColorPresetSelect = (preset: ColorPreset) => {
    setPrimaryColor(preset.primary);
    setAccentColor(preset.accent);
  };

  const uploadLogo = async () => {
    if (!logoFile) return logoUrl;

    try {
      // Ensure the storage bucket exists
      await initStorage();

      const fileExt = logoFile.name.split('.').pop();
      const fileName = `logo-${Date.now()}.${fileExt}`;
      const filePath = `business/${businessOwner.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('logos')
        .upload(filePath, logoFile);

      if (error) throw error;

      // Get the public URL for the uploaded file
      const { data: urlData } = supabase.storage.from('logos').getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      throw error;
    }
  };

  const saveChanges = async () => {
    setIsLoading(true);
    try {
      let updatedLogoUrl = logoUrl;

      if (logoFile) {
        updatedLogoUrl = await uploadLogo();
      }

      const { error } = await supabase
        .from('business_owners')
        .update({
          logo_url: updatedLogoUrl,
          primary_color: primaryColor,
          accent_color: accentColor
        })
        .eq('id', businessOwner.id);

      if (error) throw error;

      toast.success('הגדרות מיתוג נשמרו בהצלחה');
    } catch (error) {
      console.error('Error saving branding settings:', error);
      toast.error('שגיאה בשמירת הגדרות המיתוג');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>לוגו העסק</CardTitle>
          <CardDescription>העלה את הלוגו של העסק שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-40 h-40 rounded-lg bg-gray-100 flex justify-center items-center overflow-hidden border-2 border-dashed border-gray-300">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Preview" className="w-full h-full object-contain" />
              ) : (
                <span className="text-gray-500">אין לוגו</span>
              )}
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              בחר לוגו
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>צבעי המותג</CardTitle>
          <CardDescription>התאם את הצבעים של העסק שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="custom" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="presets">ערכות מוכנות</TabsTrigger>
              <TabsTrigger value="custom">התאמה אישית</TabsTrigger>
            </TabsList>
            <TabsContent value="presets">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {colorPresets.map((preset, index) => (
                  <div 
                    key={index} 
                    className="border rounded-md p-4 cursor-pointer transition-all hover:shadow-md"
                    onClick={() => handleColorPresetSelect(preset)}
                  >
                    <div className="flex gap-2 mb-2">
                      <div 
                        className="w-8 h-8 rounded-full" 
                        style={{ backgroundColor: preset.primary }} 
                      />
                      <div 
                        className="w-8 h-8 rounded-full" 
                        style={{ backgroundColor: preset.accent }} 
                      />
                    </div>
                    <p className="text-sm">{preset.name}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="custom">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">צבע ראשי</Label>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div
                        className="w-10 h-10 rounded-full border"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <Input
                        id="primary-color"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                      />
                      <Input
                        type="text"
                        value={primaryColor.toUpperCase()}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-24 font-mono"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accent-color">צבע משני</Label>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div
                        className="w-10 h-10 rounded-full border"
                        style={{ backgroundColor: accentColor }}
                      />
                      <Input
                        id="accent-color"
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                      />
                      <Input
                        type="text"
                        value={accentColor.toUpperCase()}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-24 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardContent className="pt-4">
          <h3 className="font-medium mb-4">תצוגה מקדימה</h3>
          <div className="border rounded-lg p-6 space-y-4">
            <h4 className="text-lg font-semibold" style={{ color: primaryColor }}>
              הדגמה של כותרת בצבע הראשי
            </h4>
            <p className="text-sm text-gray-600">
              זוהי הדגמה של טקסט רגיל שיופיע בממשק המשתמש שלך.
            </p>
            <div 
              className="rounded-md px-4 py-2 text-white flex justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              כפתור ראשי
            </div>
            <div 
              className="rounded-md px-4 py-2 flex justify-center border"
              style={{ borderColor: primaryColor, color: primaryColor }}
            >
              כפתור משני
            </div>
            <div
              className="rounded-md p-4"
              style={{ backgroundColor: accentColor, color: "#333" }}
            >
              קטע בצבע משני
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveChanges} disabled={isLoading}>
            {isLoading ? "שומר..." : "שמור שינויים"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BrandingTab;
