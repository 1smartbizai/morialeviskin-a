
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSignup } from "@/contexts/SignupContext";
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { CalendarClock, Mail, Globe, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DayConfig {
  active: boolean;
  start: string;
  end: string;
}

interface WorkingHoursData {
  [key: string]: DayConfig;
}

const daysHebrew: { [key: string]: string } = {
  sunday: 'ראשון',
  monday: 'שני',
  tuesday: 'שלישי',
  wednesday: 'רביעי',
  thursday: 'חמישי',
  friday: 'שישי',
  saturday: 'שבת'
};

const WorkingHoursStep = () => {
  const { signupData, updateSignupData } = useSignup();
  const { firstName } = signupData;
  const [activeTab, setActiveTab] = useState('hours');
  
  const handleDayToggle = (day: string) => {
    const updatedHours = { ...signupData.workingHours };
    updatedHours[day] = {
      ...updatedHours[day],
      active: !updatedHours[day].active
    };
    
    updateSignupData({
      workingHours: updatedHours
    });
  };

  const handleHoursChange = (day: string, field: 'start' | 'end', value: string) => {
    const updatedHours = { ...signupData.workingHours };
    updatedHours[day] = {
      ...updatedHours[day],
      [field]: value
    };
    
    updateSignupData({
      workingHours: updatedHours
    });
  };

  const handleToggleIntegration = (integration: 'emailIntegration' | 'socialMediaIntegration' | 'whatsappIntegration') => {
    updateSignupData({
      [integration]: !signupData[integration]
    });
  };

  const handleGoogleCalendarToggle = () => {
    updateSignupData({
      googleCalendarConnected: !signupData.googleCalendarConnected
    });
  };

  const connectToGoogle = () => {
    // This would be implemented to connect to Google Calendar
    // For now, we'll just simulate a connection
    setTimeout(() => {
      updateSignupData({
        googleCalendarConnected: true
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-medium">
          {firstName ? `${firstName}, ` : ''}הגדירי את שעות הפעילות והאינטגרציות
        </h3>
        <p className="text-muted-foreground mt-2">
          הגדרות אלו יעזרו לנו להתאים את המערכת לצרכי העסק שלך
        </p>
      </div>
      
      <Tabs defaultValue="hours" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="hours" className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4" />
            שעות פעילות
          </TabsTrigger>
          <TabsTrigger value="connections" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            חיבורים ואינטגרציות
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>שעות פעילות העסק</CardTitle>
              <CardDescription>הגדירי את השעות בהן העסק שלך פתוח לקביעת תורים</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(signupData.workingHours).map(([day, config]) => (
                  <div key={day} className="flex flex-wrap items-center gap-4 py-2 border-b last:border-0">
                    <div className="w-24 flex-none">
                      <Label className="text-base font-medium">{daysHebrew[day]}</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch 
                        checked={config.active} 
                        onCheckedChange={() => handleDayToggle(day)}
                        id={`${day}-active`}
                      />
                      <Label htmlFor={`${day}-active`} className={config.active ? "" : "text-muted-foreground"}>
                        {config.active ? "פתוח" : "סגור"}
                      </Label>
                    </div>
                    
                    {config.active && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <div>
                          <Select
                            value={config.start}
                            onValueChange={(value) => handleHoursChange(day, 'start', value)}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="שעת פתיחה" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {Array.from({ length: 24 }).map((_, hour) => (
                                  <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                    {`${hour.toString().padStart(2, '0')}:00`}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <span className="text-muted-foreground mx-1">עד</span>
                        
                        <div>
                          <Select
                            value={config.end}
                            onValueChange={(value) => handleHoursChange(day, 'end', value)}
                          >
                            <SelectTrigger className="w-[100px]">
                              <SelectValue placeholder="שעת סגירה" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {Array.from({ length: 24 }).map((_, hour) => (
                                  <SelectItem key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                    {`${hour.toString().padStart(2, '0')}:00`}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>חיבור ליומן Google</CardTitle>
              <CardDescription>סנכרני את יומן התורים עם יומן Google שלך</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={signupData.googleCalendarConnected} 
                    onCheckedChange={handleGoogleCalendarToggle}
                    id="google-calendar"
                  />
                  <Label htmlFor="google-calendar">
                    סנכרון דו-כיווני עם יומן Google
                  </Label>
                </div>
                
                {!signupData.googleCalendarConnected && (
                  <Button variant="outline" className="flex items-center gap-2" onClick={connectToGoogle}>
                    <svg width="18" height="18" viewBox="0 0 18 18">
                      <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.86-1.6 2.43v2h2.6c1.52-1.4 2.4-3.45 2.4-5.88 0-.54-.04-1.06-.12-1.55z"></path>
                      <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2c-.71.48-1.63.77-2.7.77-2.08 0-3.85-1.4-4.5-3.3H1.9v2.07C3.18 14.93 5.88 17 8.98 17z"></path>
                      <path fill="#FBBC05" d="M4.48 10.52c-.14-.43-.22-.88-.22-1.34s.08-.91.22-1.34V5.77H1.9C1.36 6.8 1.03 7.95 1.03 9.18s.33 2.38.87 3.4l2.58-2.06z"></path>
                      <path fill="#EA4335" d="M8.98 4.52c1.17 0 2.23.4 3.06 1.2l2.3-2.3C12.96 2.06 11.15 1.27 8.98 1.27 5.88 1.27 3.18 3.34 1.9 6.26l2.58 2c.65-1.9 2.42-3.3 4.5-3.3z"></path>
                    </svg>
                    התחבר עם חשבון Google
                  </Button>
                )}
                
                {signupData.googleCalendarConnected && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>מחובר בהצלחה</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="connections" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>חיבור לאימייל</CardTitle>
              <CardDescription>הגדר שליחת אימיילים ללקוחות מחשבון האימייל העסקי שלך</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={signupData.emailIntegration} 
                    onCheckedChange={() => handleToggleIntegration('emailIntegration')}
                    id="email-integration"
                  />
                  <Label htmlFor="email-integration">
                    שליחת אימיילים בשם העסק
                  </Label>
                </div>
                
                {signupData.emailIntegration && (
                  <div className="w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <Input 
                        placeholder="כתובת האימייל העסקית שלך"
                        type="email"
                        className="w-full md:w-[300px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>חיבור לרשתות חברתיות</CardTitle>
              <CardDescription>חבר את חשבונות הרשתות החברתיות של העסק שלך</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={signupData.socialMediaIntegration} 
                    onCheckedChange={() => handleToggleIntegration('socialMediaIntegration')}
                    id="social-integration"
                  />
                  <Label htmlFor="social-integration">
                    חיבור לרשתות חברתיות
                  </Label>
                </div>
                
                {signupData.socialMediaIntegration && (
                  <div className="space-y-3 w-full">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#1877F2]" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
                      </svg>
                      <Input 
                        placeholder="כתובת עמוד הפייסבוק"
                        className="w-full md:w-[300px]"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#C13584]" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.04.059-.977.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.88-.344 1.857-.048 1.053-.059 1.37-.059 4.04 0 2.67.01 2.987.059 4.04.045.977.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.88.3 1.857.344 1.054.048 1.37.059 4.04.059 2.67 0 2.987-.01 4.04-.059.977-.045 1.504-.207 1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.88.344-1.857.048-1.053.059-1.37.059-4.04 0-2.67-.01-2.987-.059-4.04-.045-.977-.207-1.504-.344-1.857a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.88-.3-1.857-.344-1.053-.048-1.37-.059-4.04-.059zm0 3.064A5.139 5.139 0 0 1 17.134 12a5.139 5.139 0 0 1-10.268 0A5.139 5.139 0 0 1 12 6.866zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zM18.538 6.661a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/>
                      </svg>
                      <Input 
                        placeholder="שם משתמש באינסטגרם"
                        className="w-full md:w-[300px]"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>חיבור לוואטסאפ</CardTitle>
              <CardDescription>חבר את מספר הוואטסאפ העסקי שלך</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={signupData.whatsappIntegration} 
                    onCheckedChange={() => handleToggleIntegration('whatsappIntegration')}
                    id="whatsapp-integration"
                  />
                  <Label htmlFor="whatsapp-integration">
                    שליחת הודעות וואטסאפ
                  </Label>
                </div>
                
                {signupData.whatsappIntegration && (
                  <div className="w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-[#25D366]" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <Input 
                        placeholder="מספר הוואטסאפ העסקי שלך"
                        className="w-full md:w-[300px]"
                        type="tel"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkingHoursStep;
