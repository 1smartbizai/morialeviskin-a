
import { User } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { PersonalDetailsFormValues } from "../types";

interface UserNameFieldsProps {
  control: Control<PersonalDetailsFormValues>;
}

const UserNameFields = ({ control }: UserNameFieldsProps) => {
  return (
    <>
      <FormField
        control={control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>שם פרטי</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input {...field} placeholder="הזן שם פרטי" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>שם משפחה</FormLabel>
            <FormControl>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input {...field} placeholder="הזן שם משפחה" />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default UserNameFields;
