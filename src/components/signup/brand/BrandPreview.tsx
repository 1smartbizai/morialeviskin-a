
import { useSignup } from "@/contexts/SignupContext";
import { getDefaultLogoPath } from "@/utils/signup/helpers";
import { DEFAULT_LOGOS } from "@/utils/signup/types";

interface BrandPreviewProps {
  previewText: string;
}

const BrandPreview = ({ previewText }: BrandPreviewProps) => {
  const { signupData } = useSignup();
  
  const {
    backgroundColor,
    headingTextColor,
    bodyTextColor,
    buttonBgColor1,
    buttonBgColor2,
    buttonTextColor1,
    buttonTextColor2,
    businessName,
    usesDefaultLogo,
    defaultLogoId,
    logoUrl
  } = signupData;
  
  // Determine which logo to display
  const displayLogo = usesDefaultLogo 
    ? defaultLogoId !== "default5" ? getDefaultLogoPath(defaultLogoId) : null
    : logoUrl;

  return (
    <div className="bg-muted/30 rounded-lg">
      <div className="p-4">
        <h3 className="font-medium text-center mb-2">תצוגה מקדימה בזמן אמת</h3>
        <div className="mt-4">
          <div 
            className="rounded-lg overflow-hidden border shadow-md"
            style={{ backgroundColor }}
          >
            <div className="p-4">
              <div className="flex items-center space-x-4 justify-center">
                {displayLogo && (
                  <img src={displayLogo} alt="לוגו" className="w-16 h-16 object-contain rounded" />
                )}
              </div>
              
              <h1 
                className="text-xl font-bold text-center mt-4"
                style={{ color: headingTextColor }}
              >
                {businessName || "העסק שלך"}
              </h1>
              
              <p 
                className="text-center my-4" 
                style={{ color: bodyTextColor }}
              >
                {previewText}
              </p>
              
              <div className="flex justify-center space-x-4 mt-6">
                <button 
                  className="px-4 py-2 rounded"
                  style={{ 
                    backgroundColor: buttonBgColor1,
                    color: buttonTextColor1
                  }}
                >
                  קביעת תור
                </button>
                
                <button 
                  className="px-4 py-2 rounded border"
                  style={{ 
                    backgroundColor: buttonBgColor2,
                    color: buttonTextColor2
                  }}
                >
                  פרטים נוספים
                </button>
              </div>
              
              <div className="mt-8 text-center">
                <small style={{ color: bodyTextColor }}>
                  מופעל ע״י Bellevo
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandPreview;
