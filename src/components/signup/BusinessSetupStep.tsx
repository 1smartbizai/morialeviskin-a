
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSignup } from "@/contexts/SignupContext";
import { Building2, Globe, MapPin, Phone, Mail } from "lucide-react";

const businessSetupSchema = z.object({
  businessNameHe: z.string().min(2, "שם העסק בעברית חייב להכיל לפחות 2 תווים"),
  businessNameEn: z.string().min(2, "שם העסק באנגלית חייב להכיל לפחות 2 תווים"),
  businessDomain: z.string().min(3, "דומיין העסק חייב להכיל לפחות 3 תווים").regex(/^[a-zA-Z0-9-]+$/, "דומיין יכול להכיל רק אותיות באנגלית, מספרים ומקפים"),
  businessDescription: z.string().optional(),
  businessAddress: z.string().optional(),
  businessCity: z.string().optional(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().email("כתובת אימייל לא תקינה").optional().or(z.literal("")),
});

type FormValues = z.infer<typeof businessSetupSchema>;

const BusinessSetupStep = () => {
  const { signupData, updateSignupData } = useSignup();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(businessSetupSchema),
    defaultValues: {
      businessNameHe: signupData.businessName || "",
      businessNameEn: "",
      businessDomain: "",
      businessDescription: "",
      businessAddress: "",
      businessCity: "",
      businessPhone: signupData.phone || "",
      businessEmail: signupData.email || "",
    },
    mode: "onChange",
  });

  // Generate English domain suggestion when Hebrew name changes
  useEffect(() => {
    const hebrewName = form.watch("businessNameHe");
    if (hebrewName && !form.getValues("businessDomain")) {
      // Simple transliteration for common Hebrew letters
      const transliterationMap: { [key: string]: string } = {
        'א': 'a', 'ב': 'b', 'ג': 'g', 'ד': 'd', 'ה': 'h', 'ו': 'v', 'ז': 'z',
        'ח': 'ch', 'ט': 't', 'י': 'y', 'כ': 'k', 'ך': 'k', 'ל': 'l', 'מ': 'm',
        'ם': 'm', 'ן': 'n', 'נ': 'n', 'ס': 's', 'ע': 'a', 'פ': 'p', 'ף': 'p',
        'צ': 'tz', 'ץ': 'tz', 'ק': 'k', 'ר': 'r', 'ש': 'sh', 'ת': 't'
      };
      
      let suggestion = hebrewName
        .split('')
        .map(char => transliterationMap[char] || char)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      if (suggestion) {
        form.setValue("businessDomain", suggestion);
      }
    }
  }, [form.watch("businessNameHe")]);

  // Update context when form values change
  const handleFormChange = (field: string, value: string) => {
    updateSignupData({ [field]: value });
  };

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold text-primary">
          בואי נגדיר את העסק שלך
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          הפרטים האלה יעזרו ללקוחות שלך למצוא אותך ויצרו את הזהות הדיגיטלית של העסק
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6 max-w-3xl mx-auto">
          {/* Business Names */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="businessNameHe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    שם העסק בעברית *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="הכניסי את שם העסק שלך בעברית"
                      className="h-12 text-base"
                      onChange={(e) => {
                        field.onChange(e);
                        handleFormChange("businessNameHe", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessNameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    שם העסק באנגלית *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Enter your business name in English"
                      className="h-12 text-base"
                      dir="ltr"
                      onChange={(e) => {
                        field.onChange(e);
                        handleFormChange("businessNameEn", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Business Domain */}
          <FormField
            control={form.control}
            name="businessDomain"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  דומיין העסק *
                </FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Input 
                      {...field} 
                      placeholder="business-name"
                      className="h-12 text-base rounded-l-none"
                      dir="ltr"
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                        field.onChange(value);
                        handleFormChange("businessDomain", value);
                      }}
                    />
                    <div className="bg-muted px-4 h-12 flex items-center rounded-r-md border border-l-0 border-input text-sm text-muted-foreground">
                      .bellevo.app
                    </div>
                  </div>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  הדומיין יהיה הכתובת הייחודית של העסק שלך ב-Bellevo
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Business Description */}
          <FormField
            control={form.control}
            name="businessDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">תיאור העסק</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    placeholder="ספרי בקצרה על העסק שלך, השירותים שאת מציעה והמומחיות שלך..."
                    className="min-h-24 text-base resize-none"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFormChange("businessDescription", e.target.value);
                    }}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  התיאור יופיע בפרופיל העסק ויעזור ללקוחות להכיר אותך
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
              <Phone className="h-5 w-5" />
              פרטי יצירת קשר
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="businessPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      טלפון העסק
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="מספר הטלפון של העסק"
                        className="h-12 text-base"
                        dir="ltr"
                        onChange={(e) => {
                          field.onChange(e);
                          handleFormChange("businessPhone", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      אימייל העסק
                    </FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="contact@business.com"
                        type="email"
                        className="h-12 text-base"
                        dir="ltr"
                        onChange={(e) => {
                          field.onChange(e);
                          handleFormChange("businessEmail", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Business Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="businessAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    כתובת העסק
                  </FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="רחוב ומספר בית"
                      className="h-12 text-base"
                      onChange={(e) => {
                        field.onChange(e);
                        handleFormChange("businessAddress", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessCity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">עיר</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="שם העיר"
                      className="h-12 text-base"
                      onChange={(e) => {
                        field.onChange(e);
                        handleFormChange("businessCity", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            * שדות חובה
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BusinessSetupStep;
