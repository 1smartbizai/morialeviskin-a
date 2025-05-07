
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import UserNameFields from "./form-fields/UserNameFields";
import ContactFields from "./form-fields/ContactFields";
import { usePersonalDetails } from "./hooks/usePersonalDetails";

const PersonalDetailsTab = () => {
  const { form, isLoading, onSubmit } = usePersonalDetails();

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserNameFields control={form.control} />
            <ContactFields control={form.control} />
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !form.formState.isDirty}
            >
              {isLoading ? "מעדכן..." : "שמור שינויים"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PersonalDetailsTab;
