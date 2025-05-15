
import { useRef } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

interface LogoSectionProps {
  logoUrl: string | undefined;
  selectLogoFile: () => void;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const LogoSection = ({ logoUrl, selectLogoFile, handleLogoChange }: LogoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
      {logoUrl ? (
        <div className="relative">
          <img 
            src={logoUrl} 
            alt="תצוגה מקדימה של הלוגו" 
            className="mx-auto h-32 w-32 object-contain" 
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={selectLogoFile}
          >
            החלפת לוגו
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-4 cursor-pointer"
          onClick={selectLogoFile}
        >
          <div className="border border-gray-300 rounded-full p-3 mb-2">
            <ImagePlus className="h-6 w-6 text-gray-400" />
          </div>
          <Label className="cursor-pointer">לחצי להעלאת לוגו</Label>
          <p className="text-sm text-muted-foreground mt-1">
            מומלץ בגודל 512x512 פיקסלים
          </p>
        </div>
      )}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoChange}
      />
    </div>
  );
};

export default LogoSection;
