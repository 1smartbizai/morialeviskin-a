
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SkinAttribute } from "@/types/skincare";
import { Droplet, Sun, Heart, SkinIcon } from "lucide-react";

interface ProfileAttributesProps {
  attributes: SkinAttribute[];
  className?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "skin_type": <SkinIcon className="w-5 h-5" />,
  "hydration": <Droplet className="w-5 h-5" />,
  "sensitivity": <Heart className="w-5 h-5" />,
  "sun_exposure": <Sun className="w-5 h-5" />
};

const CATEGORY_NAMES: Record<string, string> = {
  "skin_type": "סוג עור",
  "hydration": "רמת לחות",
  "sensitivity": "רגישות",
  "sun_exposure": "חשיפה לשמש",
  "skin_concerns": "נושאים לטיפול",
  "skin_conditions": "מצבים עוריים"
};

export default function ProfileAttributes({ attributes, className }: ProfileAttributesProps) {
  // Group attributes by category
  const groupedAttributes = attributes.reduce<Record<string, SkinAttribute[]>>((acc, attr) => {
    if (!acc[attr.category]) {
      acc[attr.category] = [];
    }
    acc[attr.category].push(attr);
    return acc;
  }, {});
  
  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-medium">פרופיל העור שלי</h3>
      </CardHeader>
      
      <CardContent className="p-4">
        {Object.keys(groupedAttributes).length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            עדיין אין לנו מספיק מידע על העור שלך.
            <br />
            ענה/י על השאלות כדי להתחיל לבנות את הפרופיל.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(groupedAttributes).map(category => (
              <div key={category} className="bg-muted/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse mb-3">
                  <div className="text-primary">
                    {CATEGORY_ICONS[category] || <SkinIcon className="w-5 h-5" />}
                  </div>
                  <h4 className="font-medium">{CATEGORY_NAMES[category] || category}</h4>
                </div>
                
                <ul className="space-y-2">
                  {groupedAttributes[category].map((attr, index) => (
                    <li key={`${attr.category}-${attr.attribute}-${index}`} className="flex items-center">
                      <span className="flex-grow">{attr.attribute}</span>
                      <span className="badge bg-primary/10 text-primary text-sm px-2 py-1 rounded">
                        {attr.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
