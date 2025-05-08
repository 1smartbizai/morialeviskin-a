
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignup } from "@/contexts/SignupContext";

// Create the validation schema with Hebrew error messages
const phoneRegex = /^0\d{8,9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "השם חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם המשפחה חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה").refine((val) => emailRegex.test(val), {
    message: "כתובת האימייל אינה בפורמט תקין",
  }),
  password: z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים"),
  phone: z.string().refine((val) => phoneRegex.test(val), {
    message: "מספר טלפון לא תקין - יש להזין מספר ישראלי תקין (מתחיל ב-0 ומכיל 9-10 ספרות)",
  }),
  businessName: z.string().min(2, "שם העסק חייב להכיל לפחות 2 תווים"),
});

const PersonalInfoStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: signupData.firstName || "",
      lastName: signupData.lastName || "",
      email: signupData.email || "",
      password: signupData.password || "",
      phone: signupData.phone || "",
      businessName: signupData.businessName || "",
    },
    mode: "onChange", // Enable real-time validation
  });

  // Track form validity for the parent component
  const isValid = form.formState.isValid;
  const isDirty = form.formState.isDirty;
  
  // Update SignupContext with form validity
  useEffect(() => {
    updateSignupData({ isPersonalInfoValid: isValid && isDirty });
  }, [isValid, isDirty, updateSignupData]);

  // Update global state when form values change
  const handleFormChange = (field: string, value: string) => {
    updateSignupData({ [field]: value });
  };

  return (
    <Form {...form}>
      <form className="space-y-6" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שם פרטי *</FormLabel>
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
                <FormLabel>שם משפחה *</FormLabel>
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
              <FormLabel>שם העסק *</FormLabel>
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
              <FormLabel>דוא״ל *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="your@email.com" 
                  type="email"
                  dir="ltr"
                  className="text-left"
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
              <FormLabel>סיסמה *</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field} 
                    placeholder="בחרי סיסמה (לפחות 8 תווים)" 
                    type={passwordVisible ? "text" : "password"}
                    dir="ltr"
                    className="text-left"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange("password", e.target.value);
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 px-3 flex items-center text-sm"
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
              <FormLabel>מספר טלפון *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="הכניסי מספר טלפון ישראלי (מתחיל ב-0)"
                  dir="ltr"
                  className="text-left"
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
        
        <div className="text-sm text-muted-foreground">
          * שדות חובה
        </div>
      </form>
    </Form>
  );
};

export default PersonalInfoStep;
