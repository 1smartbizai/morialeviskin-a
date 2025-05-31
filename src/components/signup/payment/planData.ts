
export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    priceLabel: 'חינם',
    isFree: true,
    trialDays: 14,
    isPopular: false,
    description: 'מתחילות - עד 50 לקוחות',
    features: [
      'עד 50 לקוחות',
      'ניהול תורים בסיסי',
      'ניהול תשלומים',
      'תמיכה בצ\'אט',
      'מגבלה של 14 ימי עסקים'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 149,
    priceLabel: '₪149/חודש',
    isFree: false,
    isPopular: true,
    description: 'מקצועי - כל הכלים הבסיסיים',
    features: [
      'לקוחות ללא הגבלה',
      'ניהול תורים מתקדם',
      'אנליטיקה מתקדמת',
      'הודעות SMS',
      'סנכרון יומן Google',
      'תוכנית נאמנות',
      'תמיכה טלפונית'
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 249,
    priceLabel: '₪249/חודש',
    isFree: false,
    isPopular: false,
    description: 'זהב - אוטומציות ומיתוג',
    features: [
      'כל הפונקציות של Pro',
      'מיתוג מותאם אישית',
      'אוטומציות אימייל מתקדמות',
      'תובנות AI',
      'דוחות מותאמים',
      'רשתות חברתיות',
      'תמיכה עדיפות'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 399,
    priceLabel: '₪399/חודש',
    isFree: false,
    isPopular: false,
    description: 'פרמיום - פתרון מלא לעסקים גדולים',
    features: [
      'כל הפונקציות של Gold',
      'ניהול צוות מרובה',
      'אינטגרציית WhatsApp',
      'גישה ל-API',
      'תמיכה ייעודית',
      'אפשרויות התאמה מלאות'
    ]
  }
];
