
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignup } from "@/contexts/SignupContext";
import { CheckCircle2, XCircle, Eye, EyeOff, Home, Upload, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { checkEmailExists, checkPhoneExists } from "@/utils/signup/authUtils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Create the validation schema with Hebrew error messages
const phoneRegex = /^0\d{8,9}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Password must be at least 8 characters and contain both letters and numbers
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "השם חייב להכיל לפחות 2 תווים"),
  lastName: z.string().min(2, "שם המשפחה חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה").refine((val) => emailRegex.test(val), {
    message: "כתובת האימייל אינה בפורמט תקין",
  }),
  password: z.string().min(8, "הסיסמה חייבת להכיל לפחות 8 תווים")
    .refine((val) => passwordRegex.test(val), {
      message: "הסיסמה חייבת להכיל לפחות אות אחת ומספר אחד",
    }),
  confirmPassword: z.string().min(1, "אימות סיסמה נדרש"),
  phone: z.string().refine((val) => phoneRegex.test(val), {
    message: "מספר טלפון לא תקין - יש להזין מספר ישראלי תקין (מתחיל ב-0 ומכיל 9-10 ספרות)",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "הסיסמאות אינן תואמות",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof personalInfoSchema>;

const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  
  // Contains letters
  if (/[A-Za-z]/.test(password)) strength += 20;
  
  // Contains numbers
  if (/\d/.test(password)) strength += 20;
  
  // Contains special characters
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  
  // Mix of uppercase and lowercase
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 10;
  
  return strength;
};

interface PersonalInfoStepProps {
  onCreateAccount?: () => void;
}

const PersonalInfoStep = ({ onCreateAccount }: PersonalInfoStepProps) => {
  const { signupData, updateSignupData } = useSignup();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailExists, setEmailExists] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: signupData.firstName || "",
      lastName: signupData.lastName || "",
      email: signupData.email || "",
      password: signupData.password || "",
      confirmPassword: signupData.password || "",
      phone: signupData.phone || "",
    },
    mode: "onChange",
  });

  // Track form validity for the parent component
  const isValid = form.formState.isValid;
  const isDirty = form.formState.isDirty;
  
  // Update SignupContext with form validity - consider account existence checks
  useEffect(() => {
    updateSignupData({ isPersonalInfoValid: isValid && isDirty && !emailExists && !phoneExists });
  }, [isValid, isDirty, emailExists, phoneExists, updateSignupData]);

  // Check for existing email with debounce
  useEffect(() => {
    const email = form.getValues("email");
    if (!email || !emailRegex.test(email)) return;

    const checkEmail = async () => {
      setIsCheckingEmail(true);
      try {
        const exists = await checkEmailExists(email);
        setEmailExists(exists);
        
        if (exists) {
          toast({
            title: "אימייל כבר רשום",
            description: "כתובת האימייל הזו כבר רשומה במערכת. נא להתחבר או לבחור כתובת אחרת.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("שגיאה בבדיקת האימייל:", error);
      } finally {
        setIsCheckingEmail(false);
      }
    };

    const timer = setTimeout(checkEmail, 800);
    return () => clearTimeout(timer);
  }, [form.watch("email")]);

  // Check for existing phone with debounce
  useEffect(() => {
    const phone = form.getValues("phone");
    if (!phone || !phoneRegex.test(phone)) return;

    const checkPhone = async () => {
      setIsCheckingPhone(true);
      try {
        const exists = await checkPhoneExists(phone);
        setPhoneExists(exists);
        
        if (exists) {
          toast({
            title: "מספר טלפון כבר רשום",
            description: "מספר הטלפון הזה כבר רשום במערכת. נא להתחבר או לבחור מספר אחר.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("שגיאה בבדיקת מספר הטלפון:", error);
      } finally {
        setIsCheckingPhone(false);
      }
    };

    const timer = setTimeout(checkPhone, 800);
    return () => clearTimeout(timer);
  }, [form.watch("phone")]);

  // Update global state when form values change
  const handleFormChange = (field: string, value: string) => {
    updateSignupData({ [field]: value });
    
    // Update password strength when password changes
    if (field === "password") {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  // Handle profile image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "הקובץ גדול מדי",
          description: "גודל התמונה חייב להיות פחות מ-5MB",
          variant: "destructive"
        });
        return;
      }
      
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      updateSignupData({ profileImage: file });
    }
  };

  // Handle returning to home page and clearing data
  const handleReturnHome = () => {
    // Clear all form data
    form.reset();
    updateSignupData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      isPersonalInfoValid: false
    });
    
    // Navigate to home
    navigate("/");
  };

  // Get strength label and color based on password strength
  const getPasswordStrengthInfo = (strength: number) => {
    if (strength === 0) return { label: "", color: "bg-gray-200" };
    if (strength < 40) return { label: "חלשה", color: "bg-red-500" };
    if (strength < 70) return { label: "בינונית", color: "bg-yellow-500" };
    return { label: "חזקה", color: "bg-green-500" };
  };

  const strengthInfo = getPasswordStrengthInfo(passwordStrength);

  const handleContinue = () => {
    if (!isValid || emailExists || phoneExists) {
      toast({
        title: "נא להשלים את כל השדות",
        description: "יש למלא את כל השדות בצורה תקינה לפני המעבר לשלב הבא. אנא בדקי שכל השדות מלאים והמייל ומספר הטלפון תקינים.",
        variant: "destructive"
      });
      return;
    }
    
    // Save form data to context
    const formData = form.getValues();
    updateSignupData({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    });
    
    if (onCreateAccount) {
      onCreateAccount();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" dir="rtl">
      {/* Header Section */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-primary">
          בואי ניצור חשבון ב-Bellevo
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          מלאי את הפרטים הבאים כדי להתחיל את המסע שלך עם Bellevo - הפלטפורמה שמכוונת לכיוון הצלחה, טכנולוגיה ושיפור תהליכים
        </p>
      </div>

      <Form {...form}>
        <form className="space-y-6 max-w-2xl mx-auto">
          {(emailExists || phoneExists) && (
            <Alert className="bg-blue-50 border-blue-200 animate-fade-in">
              <XCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                נראה שיש לך כבר משתמש במערכת.{" "}
                <Link to="/admin/login" className="text-primary font-semibold hover:underline">
                  כדאי להתחבר כאן
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {/* Profile Image Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profileImageUrl} alt="Profile" />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="profile-upload" 
                className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Upload className="w-4 h-4" />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            העלאת תמונת פרופיל (אופציונלי) - עד 5MB
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">שם פרטי *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="הכניסי את שמך הפרטי"
                      className="h-12 text-base"
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
                  <FormLabel className="text-base font-medium">שם משפחה *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="הכניסי את שם המשפחה שלך"
                      className="h-12 text-base"
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">דוא״ל *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      {...field} 
                      placeholder="your@email.com" 
                      type="email"
                      dir="ltr"
                      className={`h-12 text-base text-left ${emailExists ? 'border-red-500' : ''}`}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFormChange("email", e.target.value);
                        if (emailExists) setEmailExists(false);
                      }}
                    />
                    {isCheckingEmail && (
                      <div className="absolute inset-y-0 left-3 flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    {emailExists && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </div>
                </FormControl>
                {emailExists && <p className="text-xs text-red-500 mt-1">כתובת אימייל זו כבר רשומה במערכת</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  הכניסי כתובת אימייל תקינה שאליה יש לך גישה לצורך אימות
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">סיסמה *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        placeholder="בחרי סיסמה" 
                        type={passwordVisible ? "text" : "password"}
                        dir="ltr"
                        className="h-12 text-base text-left pr-3 pl-10"
                        onChange={(e) => {
                          field.onChange(e);
                          handleFormChange("password", e.target.value);
                          setPasswordStrength(calculatePasswordStrength(e.target.value));
                        }}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 left-0 px-3 flex items-center text-sm"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                      >
                        {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {field.value && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          {passwordRegex.test(field.value) ? 
                            <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                            <XCircle className="h-4 w-4 text-red-500" />
                          }
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <div className="mt-2">
                    <Progress value={passwordStrength} className={strengthInfo.color} />
                    {field.value && (
                      <div className="flex justify-between text-xs mt-1">
                        <span>חוזק הסיסמה: {strengthInfo.label}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    הסיסמה חייבת להכיל לפחות 8 תווים, אות אחת ומספר אחד
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">אימות סיסמה *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        {...field} 
                        placeholder="הקלידי שוב את הסיסמה" 
                        type={confirmPasswordVisible ? "text" : "password"}
                        dir="ltr"
                        className="h-12 text-base text-left pr-3 pl-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 left-0 px-3 flex items-center text-sm"
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      >
                        {confirmPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {field.value && form.getValues("password") && (
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          {field.value === form.getValues("password") ? 
                            <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                            <XCircle className="h-4 w-4 text-red-500" />
                          }
                        </div>
                      )}
                    </div>
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
                <FormLabel className="text-base font-medium">מספר טלפון *</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      {...field} 
                      placeholder="הכניסי מספר טלפון ישראלי (מתחיל ב-0)"
                      dir="ltr"
                      className={`h-12 text-base text-left ${phoneExists ? 'border-red-500' : ''}`}
                      onChange={(e) => {
                        field.onChange(e);
                        handleFormChange("phone", e.target.value);
                        if (phoneExists) setPhoneExists(false);
                      }}
                    />
                    {isCheckingPhone && (
                      <div className="absolute inset-y-0 left-3 flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                      </div>
                    )}
                    {phoneExists && (
                      <div className="absolute inset-y-0 right-3 flex items-center">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </div>
                </FormControl>
                {phoneExists && <p className="text-xs text-red-500 mt-1">מספר טלפון זה כבר רשום במערכת</p>}
                <p className="text-xs text-muted-foreground mt-1">
                  הכניסי מספר טלפון ישראלי תקין (לדוגמה: 0501234567) לצורך אימות במהלך ההרשמה
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="text-sm text-muted-foreground">
            * שדות חובה
          </div>
        </form>
      </Form>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button 
          variant="outline" 
          className="flex items-center gap-2 hover-scale"
          onClick={handleReturnHome}
        >
          <Home className="h-4 w-4" />
          חזרה לעמוד הבית
        </Button>

        <Button 
          onClick={handleContinue}
          disabled={!isValid || emailExists || phoneExists}
          className="px-8 py-3 text-lg font-semibold hover-scale"
          size="lg"
        >
          המשך לבחירת מסלול
        </Button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
