
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Users, Calendar } from "lucide-react";

interface FeaturesPreviewProps {
  businessName: string;
}

const FeaturesPreview = ({ businessName }: FeaturesPreviewProps) => {
  const features = [
    {
      icon: Building2,
      title: "העסק שלך מוכן",
      description: `${businessName} זמין עכשיו ללקוחות שלך`
    },
    {
      icon: Users,
      title: "ניהול לקוחות חכם",
      description: "מערכת מתקדמת לניהול קשרי לקוחות ומעקב אחר הטיפולים"
    },
    {
      icon: Calendar,
      title: "תזמון תורים",
      description: "לקוחות יכולים לקבוע תורים בקלות והכל מסונכרן איתך"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      {features.map((feature, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FeaturesPreview;
