
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SkinQuestion } from "@/types/skincare";

interface CurrentQuestionProps {
  question: SkinQuestion;
  onSubmit: (answer: string) => Promise<void>;
  className?: string;
}

export default function CurrentQuestion({ question, onSubmit, className }: CurrentQuestionProps) {
  const [answer, setAnswer] = useState<string>("");
  const [scaleValue, setScaleValue] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    let finalAnswer = answer;
    if (question.questionType === 'scale') {
      finalAnswer = scaleValue.toString();
    }
    
    if (finalAnswer.trim() === "") return;
    
    await onSubmit(finalAnswer);
    setAnswer("");
    setScaleValue(5);
    setIsSubmitting(false);
  };
  
  return (
    <Card className={`overflow-hidden ${className || ""}`}>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-medium text-beauty-dark">{question.question}</h3>
          
          {question.questionType === 'multiple_choice' && question.options && (
            <RadioGroup 
              value={answer} 
              onValueChange={setAnswer}
              className="space-y-2 mt-4"
            >
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value={option} id={`option-${option}`} />
                  <Label htmlFor={`option-${option}`} className="mr-2">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {question.questionType === 'scale' && (
            <div className="space-y-4 mt-4">
              <Slider 
                min={1} 
                max={10} 
                step={1} 
                value={[scaleValue]} 
                onValueChange={(values) => setScaleValue(values[0])}
              />
              <div className="flex justify-between text-sm">
                <span>מינימלי</span>
                <span className="font-bold">{scaleValue}</span>
                <span>מקסימלי</span>
              </div>
            </div>
          )}
          
          {question.questionType === 'text' && (
            <Input 
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="הקלד/י את תשובתך כאן..."
              className="mt-4"
            />
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/20 p-4">
        <Button 
          onClick={handleSubmit}
          disabled={
            isSubmitting || 
            (question.questionType !== 'scale' && answer.trim() === "")
          }
          className="w-full"
        >
          {isSubmitting ? "שולח..." : "שלח תשובה"}
        </Button>
      </CardFooter>
    </Card>
  );
}
