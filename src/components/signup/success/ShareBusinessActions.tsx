
import { Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

interface ShareBusinessActionsProps {
  businessDomain: string;
}

const ShareBusinessActions = ({ businessDomain }: ShareBusinessActionsProps) => {
  const copyToClipboard = () => {
    const fullDomain = `https://${businessDomain}`;
    navigator.clipboard.writeText(fullDomain)
      .then(() => {
        toast.success("הכתובת הועתקה ללוח", {
          position: "top-center",
        });
      })
      .catch((err) => {
        toast.error("שגיאה בהעתקת הכתובת", {
          description: "נסי להעתיק את הכתובת בצורה ידנית",
          position: "top-center",
        });
        console.error('Failed to copy: ', err);
      });
  };

  const shareOnWhatsapp = () => {
    const message = encodeURIComponent(`היי! הצטרפי לאפליקציה החדשה שלי לניהול תורים והזמנות: https://${businessDomain}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  return (
    <div className="space-y-4 mb-8">
      <h4 className="font-medium">שתפי את האפליקציה שלך עם הלקוחות</h4>
      
      <div className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          className="space-x-2 gap-2 flex-row-reverse" 
          onClick={copyToClipboard}
        >
          <Copy className="h-4 w-4" />
          <span>העתק קישור</span>
        </Button>
        
        <Button 
          onClick={shareOnWhatsapp}
          className="bg-[#25D366] hover:bg-[#128C7E] space-x-2 gap-2 flex-row-reverse"
        >
          <Share2 className="h-4 w-4" />
          <span>שתף בוואטסאפ</span>
        </Button>
      </div>
    </div>
  );
};

export default ShareBusinessActions;
