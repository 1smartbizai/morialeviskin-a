
import { Phone, CalendarDays } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { PersonalDetailsFormValues } from "../types";

interface ContactFieldsProps {
  control: Control<PersonalDetailsFormValues>;
}

const ContactFields = ({ control }: ContactFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>טלפון נייד</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input {...field} placeholder="05xxxxxxxx" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
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
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default ContactFields;
