
import { useSignup } from "@/contexts/SignupContext";
import { Label } from "@/components/ui/label";
import ColorPicker from "../brand/ColorPicker";

interface ColorSchemeSectionProps {
  onColorChange: (field: string, value: string) => void;
  primaryColor: string;
  accentColor: string;
}

const ColorSchemeSection = ({ onColorChange, primaryColor, accentColor }: ColorSchemeSectionProps) => {
  return (
    <div>
      <Label className="block mb-2">צבעי מותג ראשיים</Label>
      <div className="space-y-4">
        <ColorPicker 
          id="primaryColor"
          label="צבע ראשי"
          value={primaryColor}
          onChange={(value) => onColorChange("primaryColor", value)}
        />
        
        <ColorPicker 
          id="accentColor"
          label="צבע משני"
          value={accentColor}
          onChange={(value) => onColorChange("accentColor", value)}
        />
      </div>
    </div>
  );
};

export default ColorSchemeSection;
