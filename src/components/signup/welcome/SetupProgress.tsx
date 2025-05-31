
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

interface SetupProgressProps {
  onComplete: () => void;
}

const SetupProgress = ({ onComplete }: SetupProgressProps) => {
  const [setupProgress, setSetupProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState("מכין את המערכת...");

  const setupTasks = [
    "יוצר את חשבון העסק...",
    "מגדיר את המותג והצבעים...",
    "מכין את לוח הזמנים...",
    "מגדיר אינטגרציות...",
    "מסיים את ההכנות...",
    "הכל מוכן! 🎉"
  ];

  useEffect(() => {
    // Simulate setup progress
    const interval = setInterval(() => {
      setSetupProgress(prev => {
        const newProgress = prev + 16.67; // 100 / 6 tasks
        const taskIndex = Math.floor(newProgress / 16.67);
        
        if (taskIndex < setupTasks.length) {
          setCurrentTask(setupTasks[taskIndex]);
        }
        
        if (newProgress >= 100) {
          onComplete();
          clearInterval(interval);
        }
        
        return Math.min(newProgress, 100);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <>
      <div className="flex justify-center mb-6">
        <div className="rounded-full bg-primary/10 p-8">
          <Sparkles className="h-16 w-16 text-primary animate-pulse" />
        </div>
      </div>
      
      <div className="space-y-4 max-w-md">
        <h2 className="text-3xl font-bold text-primary">
          בונים את העסק שלך...
        </h2>
        
        <p className="text-lg text-muted-foreground">
          אנחנו מכינים הכל בשבילך, זה ייקח רק עוד כמה רגעים
        </p>
        
        <div className="space-y-3">
          <Progress value={setupProgress} className="w-full h-3" />
          <p className="text-sm text-muted-foreground font-medium">
            {currentTask}
          </p>
        </div>
      </div>
    </>
  );
};

export default SetupProgress;
