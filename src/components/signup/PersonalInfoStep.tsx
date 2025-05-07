
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignup } from "@/contexts/SignupContext";

// Create the validation schema
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "השם חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם המשפחה חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  password: z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים"),
  phone: z.string().min(9, "מספר טלפון לא תקין"),
  businessName: z.string().min(2, "שם העסק חייב להכיל לפחות 2 תווים"),
});

const PersonalInfoStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: signupData.firstName,
      lastName: signupData.lastName,
      email: signupData.email,
      password: signupData.password,
      phone: signupData.phone,
      businessName: signupData.businessName,
    },
  });

  // Update global state when form values change
  const handleFormChange = (field: string, value: string) => {
    updateSignupData({ [field]: value });
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שם פרטי</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="הכניסי את שמך הפרטי"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange("firstName", e.target.value);
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
                <FormLabel>שם משפחה</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="הכניסי את שם המשפחה שלך"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange("lastName", e.target.value);
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
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>שם העסק</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="הכניסי את שם העסק שלך"
                  onChange={(e) => {
                    field.onChange(e);
                    handleFormChange("businessName", e.target.value);
                  }}
                />
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
                <Input 
                  {...field} 
                  placeholder="your@email.com" 
                  type="email"
                  onChange={(e) => {
                    field.onChange(e);
                    handleFormChange("email", e.target.value);
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
              <FormLabel>סיסמה</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field} 
                    placeholder="בחרי סיסמה (לפחות 8 תווים)" 
                    type={passwordVisible ? "text" : "password"}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange("password", e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-sm"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? "הסתר" : "הצג"}
                  </button>
                </div>
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
              <FormLabel>מספר טלפון</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="הכניסי מספר טלפון"
                  dir="ltr"
                  className="text-right"
                  onChange={(e) => {
                    field.onChange(e);
                    handleFormChange("phone", e.target.value);
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
