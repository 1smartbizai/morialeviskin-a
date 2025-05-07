
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeCardProps {
  firstName: string | undefined;
}

const WelcomeCard = ({ firstName }: WelcomeCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-l from-beauty-primary/70 to-beauty-primary text-white p-6">
        <h1 className="text-2xl font-bold mb-1">
          שלום {firstName}
        </h1>
        <p className="text-white/90">ברוכה הבאה חזרה לאזור האישי שלך</p>
      </div>
    </Card>
  );
};

export default WelcomeCard;
