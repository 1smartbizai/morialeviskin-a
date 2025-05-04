
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User, CalendarDays, Heart } from "lucide-react";

const personalInfoSchema = z.object({
  first_name: z.string().min(2, "שם פרטי נדרש"),
  last_name: z.string().min(2, "שם משפחה נדרש"),
  birthdate: z.string().optional(),
  skin_goals: z.string().optional(),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

interface PersonalInfoStepProps {
  onSubmit: (data: PersonalInfoFormValues) => void;
  initialData?: {
    first_name: string;
    last_name: string;
    birthdate: string;
    skin_goals: string;
    photo_url?: string;
  };
}

const PersonalInfoStep = ({ onSubmit, initialData }: PersonalInfoStepProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      first_name: initialData?.first_name || "",
      last_name: initialData?.last_name || "",
      birthdate: initialData?.birthdate || "",
      skin_goals: initialData?.skin_goals || "",
    },
  });

  const handleSubmit = async (values: PersonalInfoFormValues) => {
    setIsLoading(true);
    try {
      onSubmit(values);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "שגיאה",
        description: "לא ניתן לשמור את הפרטים, נסו שוב",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="text-center mb-6">
          <p className="text-muted-foreground">ספרו לנו קצת על עצמכם</p>
        </div>

        <div className="grid grid-cols-1 gap-4" dir="rtl">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שם פרטי</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input {...field} placeholder="הזינו שם פרטי" autoComplete="given-name" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שם משפחה</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input {...field} placeholder="הזינו שם משפחה" autoComplete="family-name" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>תאריך לידה</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...field}
                      type="date"
                      placeholder="בחרו תאריך"
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skin_goals"
            render={({ field }) => (
              <FormItem>
                <FormLabel>מטרות טיפוח העור שלך</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Heart className="mr-2 h-4 w-4 text-muted-foreground align-top mt-2" />
                    <Textarea
                      {...field}
                      placeholder="ספרו לנו מה הייתם רוצים לשפר בעור שלכם"
                      className="resize-none h-24"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? "שומר..." : "המשך"}
        </Button>
      </form>
    </Form>
  );
};

export default PersonalInfoStep;
