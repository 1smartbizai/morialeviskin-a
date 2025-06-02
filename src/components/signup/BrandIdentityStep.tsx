
import { useRef, useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { 
  Palette, 
  ImagePlus, 
  Sparkles, 
  Eye, 
  Wand2,
  CheckCircle2,
  Type
} from "lucide-react";
import DefaultLogoSelector from "./brand/DefaultLogoSelector";
import AILogoGenerator from "./brand/AILogoGenerator";
import { BrandToneSelector, BrandColorSettings } from "./brand-settings";

const BrandIdentityStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const [activeLogoTab, setActiveLogoTab] = useState<string>(signupData.usesDefaultLogo ? "default" : "custom");
  const [previewText, setPreviewText] = useState("בואי נצור יחד את המותג המושלם שלך");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleColorChange = (field: string, value: string) => {
    updateSignupData({ [field]: value });
    
    // Apply the color changes immediately to preview
    const root = document.documentElement;
    if (field === 'primaryColor') {
      root.style.setProperty('--preview-primary', value);
    } else if (field === 'accentColor') {
      root.style.setProperty('--preview-accent', value);
    }
  };
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "הקובץ גדול מדי",
          description: "אנא בחרי קובץ בגודל עד 2MB",
          variant: "destructive"
        });
        return;
      }
      
      // Switch to custom logo mode
      updateSignupData({ 
        logo: file,
        usesDefaultLogo: false,
        defaultLogoId: undefined
      });
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = function(event) {
        if (event.target?.result) {
          const previewUrl = event.target.result as string;
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

  const handleLogoTabChange = (value: string) => {
    setActiveLogoTab(value);
    
    // Update the logo mode based on tab selection
    if (value === "default") {
      updateSignupData({ 
        usesDefaultLogo: true,
        logo: undefined,
        defaultLogoId: signupData.defaultLogoId || "default1"
      });
    } else if (value === "custom") {
      // Only switch to custom if we actually have a logo file
      if (signupData.logo || signupData.logoUrl) {
        updateSignupData({ usesDefaultLogo: false });
      }
    }
  };

  const handleAILogoGenerated = (logoUrl: string) => {
    updateSignupData({
      logoUrl: logoUrl,
      usesDefaultLogo: false,
      defaultLogoId: undefined
    });
    setActiveLogoTab("custom");
  };

  const handleToneChange = (tone: string) => {
    updateSignupData({ brandTone: tone });
    
    // Update preview text based on tone
    switch(tone) {
      case "professional":
        setPreviewText("הפלטפורמה המתקדמת לניהול העסק שלך");
        break;
      case "soft":
        setPreviewText("ברוכה הבאה לחוויה הנעימה שלנו");
        break;
      case "personal":
        setPreviewText("היי! אנחנו כאן בשבילך בכל צעד");
        break;
      case "modern":
        setPreviewText("גלי את העתיד של ניהול העסק");
        break;
      case "minimalist":
        setPreviewText("פשוט. יעיל. מושלם.");
        break;
      default:
        setPreviewText("בואי נצור יחד את המותג המושלם שלך");
    }
  };

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <Card className="bg-gradient-to-l from-purple-50 to-pink-50 border-primary/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-purple-600 rounded-full">
              <Palette className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 animate-pulse" />
            בואי נעצב את הזהות הוויזואלית של המותג שלך!
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            הזהות הוויזואלית והטון של המותג ישפיעו על איך הלקוחות שלך יחוו את השירות
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Logo and Colors */}
        <div className="space-y-6">
          {/* Logo Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImagePlus className="h-5 w-5 text-blue-500" />
                בחירת לוגו
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeLogoTab} onValueChange={handleLogoTabChange}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="default">לוגו מוכן</TabsTrigger>
                  <TabsTrigger value="custom">העלאה מותאמת</TabsTrigger>
                  <TabsTrigger value="ai">
                    <Wand2 className="h-4 w-4 ml-1" />
                    יצירת AI
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="default" className="space-y-4">
                  <DefaultLogoSelector />
                  <p className="text-sm text-muted-foreground">
                    בחרי מתוך הלוגואים המוכנים שלנו - ניתן לשנות בכל עת
                  </p>
                </TabsContent>
                
                <TabsContent value="custom" className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {signupData.logoUrl ? (
                      <div className="space-y-4">
                        <img 
                          src={signupData.logoUrl} 
                          alt="תצוגה מקדימה של הלוגו" 
                          className="mx-auto h-32 w-32 object-contain" 
                        />
                        <Button
                          variant="outline"
                          onClick={selectLogoFile}
                          className="w-full"
                        >
                          החלפת לוגו
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col items-center justify-center py-8 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={selectLogoFile}
                      >
                        <div className="border border-gray-300 rounded-full p-4 mb-4">
                          <ImagePlus className="h-8 w-8 text-gray-400" />
                        </div>
                        <Label className="cursor-pointer text-lg font-medium">
                          לחצי להעלאת הלוגו שלך
                        </Label>
                        <p className="text-sm text-muted-foreground mt-2">
                          מומלץ בגודל 512x512 פיקסלים (עד 2MB)
                        </p>
                      </div>
                    )}
                  </div>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </TabsContent>
                
                <TabsContent value="ai" className="space-y-4">
                  <AILogoGenerator onLogoGenerated={handleAILogoGenerated} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Color Scheme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-pink-500" />
                פלטת צבעים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BrandColorSettings onChange={handleColorChange} />
              <p className="text-sm text-muted-foreground mt-4">
                הצבעים שתבחרי יחולו על כל האפליקציה - כפתורים, כותרות ואלמנטים עיצוביים
              </p>
            </CardContent>
          </Card>

          {/* Brand Tone */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5 text-green-500" />
                טון המותג
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="block mb-4">הטון יקבע את השפה והאווירה של המותג שלך</Label>
              <BrandToneSelector 
                value={signupData.brandTone} 
                onChange={handleToneChange} 
              />
              <p className="text-sm text-muted-foreground mt-4">
                הטון שתבחרי ישפיע על איך ההודעות והתוכן יוצגו ללקוחות שלך
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Live Preview */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-500" />
                תצוגה מקדימה
                <Badge variant="secondary" className="text-xs">
                  עדכון בזמן אמת
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mobile Preview Frame */}
              <div className="mx-auto w-80 h-96 bg-gray-100 rounded-3xl p-4 shadow-lg">
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-inner">
                  {/* Header Bar */}
                  <div 
                    className="h-16 flex items-center justify-between px-4"
                    style={{ backgroundColor: signupData.primaryColor }}
                  >
                    {signupData.logoUrl && (
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white p-1">
                        <img 
                          src={signupData.logoUrl} 
                          alt="לוגו" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                    )}
                    <h3 className="text-white font-bold text-lg">
                      {signupData.businessName || "המותג שלך"}
                    </h3>
                    <div className="w-10 h-10"></div>
                  </div>
                  
                  {/* Content Area */}
                  <div className="p-6 space-y-4">
                    <div 
                      className="text-center text-lg font-semibold"
                      style={{ color: signupData.primaryColor }}
                    >
                      שלום {signupData.firstName}! 👋
                    </div>
                    
                    <div className="text-center text-gray-600">
                      {previewText}
                    </div>
                    
                    {/* Sample Button */}
                    <button 
                      className="w-full py-3 rounded-lg text-white font-medium transition-all hover:opacity-90"
                      style={{ 
                        background: `linear-gradient(135deg, ${signupData.primaryColor}, ${signupData.accentColor})` 
                      }}
                    >
                      קביעת תור
                    </button>
                    
                    {/* Sample Card */}
                    <div className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: signupData.accentColor }}
                        ></div>
                        <span className="font-medium">הטיפול הבא שלך</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        יום ראשון, 15:30
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Preview Description */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-center text-gray-600">
                  כך המותג שלך ייראה באפליקציה ללקוחות שלך
                </p>
                <div className="flex justify-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: signupData.primaryColor }}
                    ></div>
                    <span className="text-xs">צבע ראשי</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: signupData.accentColor }}
                    ></div>
                    <span className="text-xs">צבע משני</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Completion Status */}
      <Card className="bg-gradient-to-l from-green-50 to-emerald-50 border-green-300">
        <CardContent className="p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            מדהים! הזהות הוויזואלית של המותג שלך מעוצבת בטעם מושלם 🎨
          </h3>
          <p className="text-green-700">
            {signupData.firstName}, כל שינוי שעשית נשמר אוטומטית וכבר מיושם בתצוגה המקדימה.
            <br />
            הלקוחות שלך יחוו חוויה עיצובית עקבית ומותאמת למותג שלך.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandIdentityStep;
