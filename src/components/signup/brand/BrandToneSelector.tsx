
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface BrandToneSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const BrandToneSelector = ({ value, onChange }: BrandToneSelectorProps) => {
  return (
    <div>
      <Label className="block mb-2">טון מותג</Label>
      <Select
        value={value}
        onValueChange={onChange}
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
  );
};

export default BrandToneSelector;
