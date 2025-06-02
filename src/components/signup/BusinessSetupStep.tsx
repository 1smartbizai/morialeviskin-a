
import { useState } from "react";
import { useSignup } from "@/contexts/SignupContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { 
  Sparkles, 
  Building2, 
  MapPin, 
  Globe, 
  Instagram,
  Facebook,
  Phone,
  Mail,
  Star,
  CheckCircle2
} from "lucide-react";

const BusinessSetupStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completedFields, setCompletedFields] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'businessName':
        if (!value.trim()) {
          newErrors[name] = 'שם המותג הוא שדה חובה';
        } else if (value.length < 2) {
          newErrors[name] = 'שם המותג צריך להכיל לפחות 2 תווים';
        } else if (value.length > 50) {
          newErrors[name] = 'שם המותג לא יכול להכיל יותר מ-50 תווים';
        } else {
          delete newErrors[name];
          setCompletedFields(prev => ({ ...prev, [name]: true }));
        }
        break;
        
      case 'businessDescription':
        if (!value.trim()) {
          newErrors[name] = 'תיאור המותג הוא שדה חובה';
        } else if (value.length < 10) {
          newErrors[name] = 'תיאור המותג צריך להכיל לפחות 10 תווים';
        } else if (value.length > 500) {
          newErrors[name] = 'תיאור המותג לא יכול להכיל יותר מ-500 תווים';
        } else {
          delete newErrors[name];
          setCompletedFields(prev => ({ ...prev, [name]: true }));
        }
        break;
        
      case 'businessAddress':
        if (!value.trim()) {
          newErrors[name] = 'כתובת המקום הוא שדה חובה';
        } else if (value.length < 5) {
          newErrors[name] = 'כתובת המקום צריכה להכיל לפחות 5 תווים';
        } else {
          delete newErrors[name];
          setCompletedFields(prev => ({ ...prev, [name]: true }));
        }
        break;
        
      case 'businessCity':
        if (!value.trim()) {
          newErrors[name] = 'עיר המקום הוא שדה חובה';
        } else if (value.length < 2) {
          newErrors[name] = 'שם העיר צריך להכיל לפחות 2 תווים';
        } else {
          delete newErrors[name];
          setCompletedFields(prev => ({ ...prev, [name]: true }));
        }
        break;
        
      case 'businessPhone':
        const phoneRegex = /^0[2-9]\d{1,2}-?\d{7}$/;
        if (!value.trim()) {
          newErrors[name] = 'מספר טלפון המקום הוא שדה חובה';
        } else if (!phoneRegex.test(value.replace(/-/g, ''))) {
          newErrors[name] = 'מספר טלפון לא תקין (פורמט: 0X-XXXXXXX)';
        } else {
          delete newErrors[name];
          setCompletedFields(prev => ({ ...prev, [name]: true }));
        }
        break;
        
      case 'businessEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors[name] = 'כתובת דוא״ל המקום הוא שדה חובה';
        } else if (!emailRegex.test(value)) {
          newErrors[name] = 'כתובת דוא״ל לא תקינה';
        } else {
          delete newErrors[name];
          setCompletedFields(prev => ({ ...prev, [name]: true }));
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    updateSignupData({ [field]: value });
    validateField(field, value);
  };

  const requiredFields = [
    'businessName', 
    'businessDescription', 
    'businessAddress', 
    'businessCity', 
    'businessPhone', 
    'businessEmail'
  ];
  
  const completedRequiredFields = requiredFields.filter(field => completedFields[field]).length;
  const progressPercentage = (completedRequiredFields / requiredFields.length) * 100;

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header with Progress */}
      <Card className="bg-gradient-to-l from-purple-50 to-pink-50 border-primary/30">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-purple-600 rounded-full">
              <Building2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 animate-pulse" />
            בואי נקים את המותג שלך, {signupData.firstName}! 
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            כל המידע שתזיני כאן חיוני לבניית זהות המותג שלך ולהצלחת העסק
          </p>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>התקדמות: {completedRequiredFields}/{requiredFields.length}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Brand Information */}
        <Card className="relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              פרטי מותג בסיסיים
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Name */}
            <div className="space-y-2">
              <Label htmlFor="businessName" className="flex items-center gap-2">
                שם המותג בעברית
                <Badge variant="destructive" className="text-xs">חובה</Badge>
                {completedFields.businessName && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </Label>
              <Input
                id="businessName"
                value={signupData.businessName || ''}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                placeholder="למשל: סטודיו יופי רחל"
                className={errors.businessName ? 'border-red-500' : completedFields.businessName ? 'border-green-500' : ''}
              />
              <p className="text-xs text-muted-foreground">
                זה השם שיופיע ללקוחות שלך באפליקציה ובכל התקשורת
              </p>
              {errors.businessName && (
                <p className="text-red-500 text-sm">{errors.businessName}</p>
              )}
            </div>

            {/* Business Description */}
            <div className="space-y-2">
              <Label htmlFor="businessDescription" className="flex items-center gap-2">
                תיאור המותג
                <Badge variant="destructive" className="text-xs">חובה</Badge>
                {completedFields.businessDescription && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </Label>
              <Textarea
                id="businessDescription"
                value={signupData.businessDescription || ''}
                onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                placeholder="תארי את העסק שלך, את השירותים שאת נותנת ומה הופך אותך למיוחדת..."
                rows={4}
                className={errors.businessDescription ? 'border-red-500' : completedFields.businessDescription ? 'border-green-500' : ''}
              />
              <p className="text-xs text-muted-foreground">
                תיאור זה יעזור ללקוחות להבין מה המותג שלך מציע ומדוע לבחור בך
              </p>
              {errors.businessDescription && (
                <p className="text-red-500 text-sm">{errors.businessDescription}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-500" />
              פרטי יצירת קשר
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Phone */}
            <div className="space-y-2">
              <Label htmlFor="businessPhone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                מספר טלפון המקום
                <Badge variant="destructive" className="text-xs">חובה</Badge>
                {completedFields.businessPhone && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </Label>
              <Input
                id="businessPhone"
                value={signupData.businessPhone || ''}
                onChange={(e) => handleInputChange('businessPhone', e.target.value)}
                placeholder="03-1234567"
                className={errors.businessPhone ? 'border-red-500' : completedFields.businessPhone ? 'border-green-500' : ''}
              />
              <p className="text-xs text-muted-foreground">
                מספר הטלפון הראשי שלקוחות יוכלו להתקשר אליו לתיאום פגישות
              </p>
              {errors.businessPhone && (
                <p className="text-red-500 text-sm">{errors.businessPhone}</p>
              )}
            </div>

            {/* Business Email */}
            <div className="space-y-2">
              <Label htmlFor="businessEmail" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                כתובת דוא״ל המקום
                <Badge variant="destructive" className="text-xs">חובה</Badge>
                {completedFields.businessEmail && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </Label>
              <Input
                id="businessEmail"
                type="email"
                value={signupData.businessEmail || ''}
                onChange={(e) => handleInputChange('businessEmail', e.target.value)}
                placeholder="info@studio-rachel.co.il"
                className={errors.businessEmail ? 'border-red-500' : completedFields.businessEmail ? 'border-green-500' : ''}
              />
              <p className="text-xs text-muted-foreground">
                כתובת דוא״ל רשמית לתקשורת עם לקוחות ולקבלת הודעות מהמערכת
              </p>
              {errors.businessEmail && (
                <p className="text-red-500 text-sm">{errors.businessEmail}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              מיקום המקום
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Address */}
            <div className="space-y-2">
              <Label htmlFor="businessAddress" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                כתובת המקום
                <Badge variant="destructive" className="text-xs">חובה</Badge>
                {completedFields.businessAddress && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </Label>
              <Input
                id="businessAddress"
                value={signupData.businessAddress || ''}
                onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                placeholder="רחוב הרצל 25"
                className={errors.businessAddress ? 'border-red-500' : completedFields.businessAddress ? 'border-green-500' : ''}
              />
              <p className="text-xs text-muted-foreground">
                הכתובת המדויקת שבה נמצא המקום שלך - חשוב לניווט הלקוחות
              </p>
              {errors.businessAddress && (
                <p className="text-red-500 text-sm">{errors.businessAddress}</p>
              )}
            </div>

            {/* Business City */}
            <div className="space-y-2">
              <Label htmlFor="businessCity" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                עיר המקום
                <Badge variant="destructive" className="text-xs">חובה</Badge>
                {completedFields.businessCity && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              </Label>
              <Input
                id="businessCity"
                value={signupData.businessCity || ''}
                onChange={(e) => handleInputChange('businessCity', e.target.value)}
                placeholder="תל אביב"
                className={errors.businessCity ? 'border-red-500' : completedFields.businessCity ? 'border-green-500' : ''}
              />
              <p className="text-xs text-muted-foreground">
                העיר שבה נמצא המקום שלך - יעזור ללקוחות למצוא אותך
              </p>
              {errors.businessCity && (
                <p className="text-red-500 text-sm">{errors.businessCity}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Media (Optional) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-500" />
              נוכחות דיגיטלית
              <Badge variant="secondary" className="text-xs">אופציונלי</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Instagram */}
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4 text-pink-500" />
                אינסטגרם
              </Label>
              <Input
                id="instagram"
                value={signupData.instagram || ''}
                onChange={(e) => updateSignupData({ instagram: e.target.value })}
                placeholder="@studio_rachel"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                שם המשתמש שלך באינסטגרם (ללא @)
              </p>
            </div>

            {/* Facebook */}
            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-blue-600" />
                פייסבוק
              </Label>
              <Input
                id="facebook"
                value={signupData.facebook || ''}
                onChange={(e) => updateSignupData({ facebook: e.target.value })}
                placeholder="Studio.Rachel.Beauty"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                שם העמוד שלך בפייסבוק
              </p>
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-600" />
                אתר אינטרנט
              </Label>
              <Input
                id="website"
                value={signupData.website || ''}
                onChange={(e) => updateSignupData({ website: e.target.value })}
                placeholder="www.studio-rachel.co.il"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                כתובת האתר שלך (אם יש)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Encouraging Message */}
      <Card className="bg-gradient-to-l from-green-50 to-emerald-50 border-green-300">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            מעולה! את בדרך הנכונה 🎯
          </h3>
          <p className="text-green-700">
            {signupData.firstName}, המידע שאת מזינה כאן הוא הבסיס לבניית זהות המותג שלך.
            <br />
            ככל שהמידע יהיה מפורט ומדויק יותר, כך הלקוחות שלך יחוו חוויה טובה יותר.
          </p>
          
          {completedRequiredFields === requiredFields.length && (
            <div className="mt-4 p-4 bg-green-100 rounded-lg">
              <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-800 font-semibold">
                כל הכבוד! השלמת את כל השדות החובה 🎉
              </p>
              <p className="text-green-700 text-sm mt-1">
                עכשיו אפשר לעבור לשלב הבא - עיצוב זהות המותג שלך
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessSetupStep;
