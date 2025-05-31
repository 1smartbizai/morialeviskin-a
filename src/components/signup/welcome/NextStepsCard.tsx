
import { Card, CardContent } from "@/components/ui/card";

const NextStepsCard = () => {
  return (
    <Card className="bg-blue-50 border-blue-200 w-full max-w-md">
      <CardContent className="p-6 text-center">
        <h3 className="font-semibold text-blue-900 mb-2">
          מוכנה להתחיל?
        </h3>
        <p className="text-sm text-blue-800 mb-4">
          נעביר אותך למערכת הניהול שלך, שם תוכלי להוסיף את הטיפולים הראשונים ולהתחיל לקבל לקוחות
        </p>
      </CardContent>
    </Card>
  );
};

export default NextStepsCard;
