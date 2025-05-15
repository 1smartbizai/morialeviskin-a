import { useRef, useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { Label } from "@/components/ui/label";
import BrandPreview from "./brand/BrandPreview";
import {
  LogoTabContent,
  ColorSchemeSection,
  PreviewSection
} from "./visual-identity";

const VisualIdentityStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const [activeTab, setActiveTab] = useState<string>(signupData.usesDefaultLogo ? "default" : "custom");
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update the logo mode based on tab selection
    if (value === "default") {
      updateSignupData({ 
        usesDefaultLogo: true,
        logo: undefined,
        // Keep the existing default logo or set to default1 if none
        defaultLogoId: signupData.defaultLogoId || "default1"
      });
    } else if (value === "custom") {
      // Only switch to custom if we actually have a logo file
      if (signupData.logo || signupData.logoUrl) {
        updateSignupData({ usesDefaultLogo: false });
      }
    }
    // For the AI tab, we don't change any settings until logo is generated
  };

  // Handler for when an AI logo is successfully generated
  const handleAILogoGenerated = (logoUrl: string) => {
    updateSignupData({
      logoUrl: logoUrl,
      usesDefaultLogo: false,
      defaultLogoId: undefined
    });
    
    // Switch to custom tab to show the generated logo
    setActiveTab("custom");
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Logo Selection Section */}
        <div>
          <Label className="block mb-4">לוגו העסק</Label>
          
          <LogoTabContent 
            activeTab={activeTab}
            handleTabChange={handleTabChange}
            handleLogoChange={handleLogoChange}
            selectLogoFile={selectLogoFile}
            handleAILogoGenerated={handleAILogoGenerated}
            logoUrl={signupData.logoUrl}
          />
        </div>
        
        {/* Color Scheme Section */}
        <ColorSchemeSection 
          onColorChange={handleColorChange}
          primaryColor={signupData.primaryColor}
          accentColor={signupData.accentColor}
        />
      </div>
      
      {/* Preview Section */}
      <PreviewSection 
        logoUrl={signupData.logoUrl}
        businessName={signupData.businessName}
        primaryColor={signupData.primaryColor}
        accentColor={signupData.accentColor}
      />
      
      {/* Full Brand Preview */}
      <BrandPreview previewText="דוגמה לטקסט במסך העסק שלך. כאן יופיע התוכן של האפליקציה." />
    </div>
  );
};

export default VisualIdentityStep;
