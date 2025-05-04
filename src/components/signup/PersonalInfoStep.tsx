
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface PersonalInfoStepProps {
  data: any;
  updateData: (data: any) => void;
}

const formSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
});

const PersonalInfoStep = ({ data, updateData }: PersonalInfoStepProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      password: data.password || "",
      phone: data.phone || "",
      businessName: data.businessName || "",
    },
  });

  // Form automatically updates parent state on every change
  const handleFieldChange = (field: string, value: string) => {
    updateData({ [field]: value });
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your first name" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("firstName", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your last name" 
                    {...field} 
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange("lastName", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange("email", e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Create a password" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange("password", e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange("phone", e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your business name" 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleFieldChange("businessName", e.target.value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default PersonalInfoStep;
