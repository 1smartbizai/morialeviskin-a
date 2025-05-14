import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientLayout from "@/components/layouts/ClientLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useFeedbackSurvey } from "@/hooks/useFeedbackSurvey";

const FeedbackSurvey: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isEligibleForSurvey, 
    submitSurvey, 
    dismissSurvey, 
    isSubmitting,
    hasSubmittedRecently
  } = useFeedbackSurvey();
  
  const [submitted, setSubmitted] = useState(false);
  
  const form = useForm({
    defaultValues: {
      overallSatisfaction: "",
      staffFriendliness: "",
      treatmentEffectiveness: "",
      additionalComments: "",
    },
  });

  useEffect(() => {
    // If the client isn't eligible or has submitted recently, redirect to dashboard
    if (!isEligibleForSurvey || hasSubmittedRecently) {
      navigate("/client/dashboard");
    }
  }, [isEligibleForSurvey, hasSubmittedRecently, navigate]);

  const onSubmit = async (data: any) => {
    try {
      await submitSurvey(data);
      setSubmitted(true);
      toast({
        title: "תודה על המשוב!",
        description: "המשוב שלך התקבל בהצלחה",
      });
      // Redirect after short delay
      setTimeout(() => {
        navigate("/client/dashboard");
      }, 2000);
    } catch (error) {
      toast({
        title: "שגיאה בשליחת המשוב",
        description: "אנא נסי שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  };

  const handleDismiss = async () => {
    await dismissSurvey();
    toast({
      title: "משוב נדחה",
      description: "המשוב נדחה בהצלחה",
    });
    navigate("/client/dashboard");
  };

  const emojiRatings = [
    { value: "5", label: "😍", description: "מצוין" },
    { value: "4", label: "🙂", description: "טוב" },
    { value: "3", label: "😐", description: "סביר" },
    { value: "2", label: "🙁", description: "לא טוב" },
    { value: "1", label: "😞", description: "גרוע" },
  ];

  if (submitted) {
    return (
      <ClientLayout>
        <Card className="p-6 text-center">
          <div className="text-5xl mb-4">🙏</div>
          <h2 className="text-xl font-medium mb-2">תודה על המשוב!</h2>
          <p>המשוב שלך יעזור לנו להשתפר ולהעניק לך חווית שירות טובה יותר.</p>
        </Card>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-beauty-dark">משוב על השירות</h1>
          <Button variant="ghost" size="icon" onClick={handleDismiss}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <Card className="p-4">
          <div className="text-center mb-6">
            <p className="text-beauty-dark">נשמח לשמוע את דעתך על השירות שלנו!</p>
            <p className="text-sm text-gray-500 mt-1">
              המשוב שלך יעזור לנו להשתפר ולהתאים את השירות לצרכים שלך
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="overallSatisfaction"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-beauty-dark font-medium">מה דעתך על השירות שקיבלת באופן כללי?</FormLabel>
                    
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      className="flex justify-between"
                    >
                      {emojiRatings.map((rating) => (
                        <FormItem key={rating.value} className="flex flex-col items-center space-y-1">
                          <FormControl>
                            <RadioGroupItem value={rating.value} className="sr-only" />
                          </FormControl>
                          <div className="cursor-pointer text-center" onClick={() => field.onChange(rating.value)}>
                            <div className={`text-3xl transition-transform ${field.value === rating.value ? 'transform scale-125' : ''}`}>
                              {rating.label}
                            </div>
                            <div className="text-xs mt-1">{rating.description}</div>
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <FormField
                control={form.control}
                name="staffFriendliness"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-beauty-dark font-medium">איך היית מדרגת את יחס הצוות?</FormLabel>
                    
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      className="flex justify-between"
                    >
                      {emojiRatings.map((rating) => (
                        <FormItem key={rating.value} className="flex flex-col items-center space-y-1">
                          <FormControl>
                            <RadioGroupItem value={rating.value} className="sr-only" />
                          </FormControl>
                          <div className="cursor-pointer text-center" onClick={() => field.onChange(rating.value)}>
                            <div className={`text-3xl transition-transform ${field.value === rating.value ? 'transform scale-125' : ''}`}>
                              {rating.label}
                            </div>
                            <div className="text-xs mt-1">{rating.description}</div>
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <FormField
                control={form.control}
                name="treatmentEffectiveness"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-beauty-dark font-medium">עד כמה הטיפולים עזרו לך להשיג את המטרות שלך?</FormLabel>
                    
                    <RadioGroup 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      className="flex justify-between"
                    >
                      {emojiRatings.map((rating) => (
                        <FormItem key={rating.value} className="flex flex-col items-center space-y-1">
                          <FormControl>
                            <RadioGroupItem value={rating.value} className="sr-only" />
                          </FormControl>
                          <div className="cursor-pointer text-center" onClick={() => field.onChange(rating.value)}>
                            <div className={`text-3xl transition-transform ${field.value === rating.value ? 'transform scale-125' : ''}`}>
                              {rating.label}
                            </div>
                            <div className="text-xs mt-1">{rating.description}</div>
                          </div>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormItem>
                )}
              />
              
              <Separator />
              
              <FormField
                control={form.control}
                name="additionalComments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-beauty-dark font-medium">הערות נוספות (אופציונלי)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="שתפי אותנו במחשבות נוספות..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "שולח..." : "שלח משוב"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </ClientLayout>
  );
};

export default FeedbackSurvey;
