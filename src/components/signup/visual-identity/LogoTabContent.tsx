
import { useSignup } from "@/contexts/SignupContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DefaultLogoSelector from "../brand/DefaultLogoSelector";
import AILogoGenerator from "../brand/AILogoGenerator";
import LogoSection from "./LogoSection";

interface LogoTabContentProps {
  activeTab: string;
  handleTabChange: (value: string) => void;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectLogoFile: () => void;
  handleAILogoGenerated: (logoUrl: string) => void;
  logoUrl: string | undefined;
}

const LogoTabContent = ({ 
  activeTab, 
  handleTabChange, 
  handleLogoChange,
  selectLogoFile,
  handleAILogoGenerated,
  logoUrl
}: LogoTabContentProps) => {
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="default">לוגו מוכן</TabsTrigger>
        <TabsTrigger value="custom">לוגו מותאם אישית</TabsTrigger>
        <TabsTrigger value="ai">יצירת לוגו AI</TabsTrigger>
      </TabsList>
      
      <TabsContent value="default" className="space-y-4">
        <DefaultLogoSelector />
        <p className="text-sm text-muted-foreground mt-2">
          ניתן לשנות את הלוגו בכל עת מהגדרות העסק לאחר ההרשמה
        </p>
      </TabsContent>
      
      <TabsContent value="custom">
        <LogoSection 
          logoUrl={logoUrl}
          selectLogoFile={selectLogoFile}
          handleLogoChange={handleLogoChange}
        />
      </TabsContent>
      
      <TabsContent value="ai">
        <AILogoGenerator onLogoGenerated={handleAILogoGenerated} />
      </TabsContent>
    </Tabs>
  );
};

export default LogoTabContent;
