
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md";
}

const ColorPicker = ({ id, label, value, onChange, size = "md" }: ColorPickerProps) => {
  return (
    <div>
      <Label htmlFor={id} className={size === "sm" ? "text-xs" : ""}>{label}</Label>
      <div className="flex items-center gap-2 mt-1">
        <div 
          className={`${size === "sm" ? "w-6 h-6" : "w-8 h-8"} rounded border`}
          style={{ backgroundColor: value }}
        />
        <Input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={size === "sm" ? "h-8" : ""}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
