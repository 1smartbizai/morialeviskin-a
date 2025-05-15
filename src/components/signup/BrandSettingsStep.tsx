
import { useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { 
  BrandToneSelector,
  BrandColorSettings,
  BrandPreview 
} from "./brand-settings";

const BrandSettingsStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const [previewText, setPreviewText] = useState("נצלי את הכוח של Bellevo לניהול העסק שלך");
  
  const handleColorChange = (field: string, value: string) => {
    updateSignupData({ [field]: value });
  };

  const handleToneChange = (tone: string) => {
    updateSignupData({ brandTone: tone });
    
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
          <BrandToneSelector 
            value={signupData.brandTone} 
            onChange={handleToneChange} 
          />
          
          <BrandColorSettings onChange={handleColorChange} />
        </div>
        
        {/* Live Preview Panel */}
        <BrandPreview previewText={previewText} />
      </div>
    </div>
  );
};

export default BrandSettingsStep;
