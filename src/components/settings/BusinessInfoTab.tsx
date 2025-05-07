
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  business_name: z.string().min(2, { message: "שם העסק חייב להכיל לפחות 2 תווים" }),
  first_name: z.string().min(2, { message: "שם פרטי חייב להכיל לפחות 2 תווים" }),
  last_name: z.string().min(2, { message: "שם משפחה חייב להכיל לפחות 2 תווים" }),
  phone: z.string().min(9, { message: "מספר טלפון חייב להכיל לפחות 9 ספרות" }),
  address: z.string().optional(),
  city: z.string().optional(),
  email: z.string().email({ message: "אנא הכניסו כתובת אימייל תקינה" }).optional(),
  tax_id: z.string().optional(),
});

type BusinessInfoFormValues = z.infer<typeof formSchema>;

interface BusinessInfoTabProps {
  businessOwner: any;
}

const BusinessInfoTab = ({ businessOwner }: BusinessInfoTabProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      business_name: businessOwner?.business_name || "",
      first_name: businessOwner?.first_name || "",
      last_name: businessOwner?.last_name || "",
      phone: businessOwner?.phone || "",
      address: businessOwner?.address || "",
      city: businessOwner?.city || "",
      email: businessOwner?.email || "",
      tax_id: businessOwner?.tax_id || "",
    },
  });

  const onSubmit = async (values: BusinessInfoFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("business_owners")
        .update(values)
        .eq("id", businessOwner.id);

      if (error) throw error;

      toast.success("פרטי העסק עודכנו בהצלחה");
    } catch (error) {
      console.error("Error updating business info:", error);
      toast.error("שגיאה בעדכון פרטי העסק");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>פרטי העסק</CardTitle>
        <CardDescription>עדכן את פרטי העסק שלך כפי שיופיעו במסמכים ובתקשורת עם הלקוחות</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="business_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם העסק</FormLabel>
                    <FormControl>
                      <Input placeholder="שם העסק" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם פרטי</FormLabel>
                      <FormControl>
                        <Input placeholder="שם פרטי" {...field} />
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
                        <Input placeholder="שם משפחה" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>טלפון</FormLabel>
                    <FormControl>
                      <Input placeholder="טלפון" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>אימייל</FormLabel>
                    <FormControl>
                      <Input placeholder="אימייל" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>כתובת</FormLabel>
                    <FormControl>
                      <Input placeholder="כתובת" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>עיר</FormLabel>
                    <FormControl>
                      <Input placeholder="עיר" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tax_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מספר עוסק / ח.פ.</FormLabel>
                    <FormControl>
                      <Input placeholder="מספר עוסק / ח.פ." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "שומר..." : "שמור שינויים"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default BusinessInfoTab;
