
import { useSignup } from "@/contexts/SignupContext";
import ColorPicker from "./ColorPicker";

interface BrandColorSettingsProps {
  onChange: (field: string, value: string) => void;
}

const BrandColorSettings = ({ onChange }: BrandColorSettingsProps) => {
  const { signupData } = useSignup();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ColorPicker
          id="backgroundColor"
          label="רקע כללי"
          value={signupData.backgroundColor}
          onChange={(value) => onChange("backgroundColor", value)}
        />
        
        <ColorPicker
          id="headingTextColor"
          label="צבע כותרות"
          value={signupData.headingTextColor}
          onChange={(value) => onChange("headingTextColor", value)}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ColorPicker
          id="bodyTextColor"
          label="צבע טקסט"
          value={signupData.bodyTextColor}
          onChange={(value) => onChange("bodyTextColor", value)}
        />
        
        <ColorPicker
          id="actionTextColor"
          label="צבע טקסט לפעולות"
          value={signupData.actionTextColor}
          onChange={(value) => onChange("actionTextColor", value)}
        />
      </div>
      
      <div>
        <div className="block mb-2">צבעי כפתורים</div>
        <div className="grid grid-cols-2 gap-4">
          <ColorPicker
            id="buttonBgColor1"
            label="כפתור ראשי - רקע"
            value={signupData.buttonBgColor1}
            onChange={(value) => onChange("buttonBgColor1", value)}
            size="sm"
          />
          <ColorPicker
            id="buttonTextColor1"
            label="כפתור ראשי - טקסט"
            value={signupData.buttonTextColor1}
            onChange={(value) => onChange("buttonTextColor1", value)}
            size="sm"
          />
          <ColorPicker
            id="buttonBgColor2"
            label="כפתור משני - רקע"
            value={signupData.buttonBgColor2}
            onChange={(value) => onChange("buttonBgColor2", value)}
            size="sm"
          />
          <ColorPicker
            id="buttonTextColor2"
            label="כפתור משני - טקסט"
            value={signupData.buttonTextColor2}
            onChange={(value) => onChange("buttonTextColor2", value)}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};

export default BrandColorSettings;
