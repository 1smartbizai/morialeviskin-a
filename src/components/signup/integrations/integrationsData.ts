
import { 
  Calendar, 
  Mail, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Phone
} from "lucide-react";
import { IntegrationItem } from "./types";

export const getIntegrationsList = (integrations: any): IntegrationItem[] => [
  {
    id: 'googleCalendar',
    name: 'יומן Google',
    description: 'סנכרון אוטומטי של תורים עם יומן Google שלך - חסוך זמן ומנעי טעויות',
    icon: Calendar,
    feature: 'google_calendar_sync' as const,
    enabled: integrations.googleCalendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    connectUrl: '#',
    category: 'חיוני'
  },
  {
    id: 'email',
    name: 'אימייל מרקטינג',
    description: 'שליחת מיילים אוטומטיים, ניוזלטרים ותזכורות ללקוחות - הגדלת המכירות',
    icon: Mail,
    feature: 'email_automation' as const,
    enabled: integrations.email,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    connectUrl: '#',
    category: 'שיווק'
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'תקשורת מהירה ונוחה עם הלקוחות דרך WhatsApp - הגדלת שביעות הרצון',
    icon: MessageCircle,
    feature: 'whatsapp_integration' as const,
    enabled: integrations.whatsapp,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    connectUrl: '#',
    category: 'תקשורת'
  },
  {
    id: 'sms',
    name: 'הודעות SMS',
    description: 'שליחת תזכורות והודעות חשובות דרך SMS - הפחתת אי הגעות',
    icon: Phone,
    feature: 'sms_messaging' as const,
    enabled: integrations.sms,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    connectUrl: '#',
    category: 'תזכורות'
  },
  {
    id: 'instagram',
    name: 'אינסטגרם Business',
    description: 'חיבור לחשבון העסק באינסטגרם לשיתוף תוכן וניהול הודעות',
    icon: Instagram,
    feature: 'social_media_integration' as const,
    enabled: integrations.instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    connectUrl: '#',
    category: 'רשתות חברתיות'
  },
  {
    id: 'facebook',
    name: 'פייסבוק Business',
    description: 'ניהול עמוד העסק בפייסבוק וקבלת הודעות - הרחבת החשיפה',
    icon: Facebook,
    feature: 'social_media_integration' as const,
    enabled: integrations.facebook,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    connectUrl: '#',
    category: 'רשתות חברתיות'
  }
];
