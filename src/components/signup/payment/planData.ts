
export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  description: string;
  isFree?: boolean;
  isPopular?: boolean;
  priceLabel?: string;
  trialDays?: number;
  recommended?: boolean;
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: "תכנית הניסיון",
    price: 0,
    description: "מתאימה למי שרוצה להכיר את המערכת",
    isFree: true,
    trialDays: 14,
    features: [
      "עד 50 לקוחות",
      "ניהול תורים בסיסי",
      "דוחות פשוטים",
      "תמיכה בצ'אט",
      "14 ימי ניסיון חינם"
    ]
  },
  {
    id: "pro",
    name: "Pro",
    price: 149,
    description: "המסלול המומלץ לעסקים מקצועיים",
    isPopular: true,
    recommended: true,
    priceLabel: "₪149/חודש",
    features: [
      "לקוחות ללא הגבלה",
      "ניהול תורים מתקדם",
      "הודעות SMS",
      "דוחות מתקדמים",
      "סנכרון יומן Google",
      "תוכנית נאמנות",
      "תמיכה טלפונית"
    ]
  },
  {
    id: "gold",
    name: "Gold",
    price: 249,
    description: "פתרון מלא עם אוטומציות ומיתוג",
    priceLabel: "₪249/חודש",
    features: [
      "כל התכונות של Pro",
      "מיתוג מותאם אישית",
      "אוטומציות אימייל",
      "תובנות AI",
      "דוחות מותאמים",
      "אינטגרציית רשתות חברתיות",
      "מנהל חשבון ייעודי"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    price: 399,
    description: "פתרון מלא לעסקים גדולים ורשתות",
    priceLabel: "₪399/חודש",
    features: [
      "כל התכונות של Gold",
      "צוות מרובה",
      "אינטגרציית WhatsApp",
      "גישה ל-API",
      "גיבויים מתקדמים",
      "אבטחה מתקדמת",
      "תמיכה 24/7"
    ]
  }
];
