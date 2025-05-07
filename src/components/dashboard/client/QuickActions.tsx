
import { Button } from "@/components/ui/button";
import { Award, Calendar, BookOpen, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-beauty-dark">פעולות מהירות</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center text-beauty-dark hover:bg-beauty-accent/20"
          onClick={() => navigate("/client/book")}
        >
          <Calendar className="h-7 w-7 mb-2 text-beauty-primary" />
          <span>קביעת תור</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center text-beauty-dark hover:bg-beauty-accent/20"
          onClick={() => navigate("/client/treatments")}
        >
          <BookOpen className="h-7 w-7 mb-2 text-beauty-primary" />
          <span>טיפולים</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center text-beauty-dark hover:bg-beauty-accent/20"
          onClick={() => navigate("/client/treatment-history")}
        >
          <FileText className="h-7 w-7 mb-2 text-beauty-primary" />
          <span>היסטורית טיפולים</span>
        </Button>
        <Button
          variant="outline"
          className="h-auto py-6 flex flex-col items-center text-beauty-dark hover:bg-beauty-accent/20"
          onClick={() => navigate("/client/rewards")}
        >
          <Award className="h-7 w-7 mb-2 text-beauty-primary" />
          <span>הטבות</span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
