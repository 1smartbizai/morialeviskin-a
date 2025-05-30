
import { SignupData } from "@/contexts/SignupContext";

// Define available subscription plans
export type PlanType = 'starter' | 'pro' | 'gold' | 'premium';

// Define feature categories
export type FeatureCategory = 'clients' | 'messaging' | 'analytics' | 'branding' | 'integrations' | 'automation';

// Define specific features
export type FeatureName = 
  | 'unlimited_clients'
  | 'advanced_analytics' 
  | 'custom_branding'
  | 'sms_messaging'
  | 'email_automation'
  | 'whatsapp_integration'
  | 'google_calendar_sync'
  | 'ai_insights'
  | 'loyalty_program'
  | 'custom_reports'
  | 'multi_staff'
  | 'api_access';

// Feature definitions with plan requirements
export const FEATURE_PERMISSIONS: Record<FeatureName, {
  requiredPlan: PlanType;
  category: FeatureCategory;
  name: string;
  description: string;
}> = {
  unlimited_clients: {
    requiredPlan: 'pro',
    category: 'clients',
    name: 'לקוחות ללא הגבלה',
    description: 'נהל מעל 50 לקוחות'
  },
  advanced_analytics: {
    requiredPlan: 'pro',
    category: 'analytics', 
    name: 'אנליטיקה מתקדמת',
    description: 'דוחות מפורטים ותובנות עסקיות'
  },
  custom_branding: {
    requiredPlan: 'gold',
    category: 'branding',
    name: 'מיתוג מותאם',
    description: 'לוגו וצבעים מותאמים אישית'
  },
  sms_messaging: {
    requiredPlan: 'pro',
    category: 'messaging',
    name: 'הודעות SMS',
    description: 'שליחת הודעות SMS ללקוחות'
  },
  email_automation: {
    requiredPlan: 'gold',
    category: 'automation',
    name: 'אוטומציות אימייל',
    description: 'הודעות אוטומטיות מתקדמות'
  },
  whatsapp_integration: {
    requiredPlan: 'premium',
    category: 'integrations',
    name: 'אינטגרציית WhatsApp',
    description: 'תקשורת דרך WhatsApp Business'
  },
  google_calendar_sync: {
    requiredPlan: 'pro',
    category: 'integrations',
    name: 'סנכרון יומן Google',
    description: 'סנכרון דו-כיווני עם יומן Google'
  },
  ai_insights: {
    requiredPlan: 'gold',
    category: 'analytics',
    name: 'תובנות AI',
    description: 'המלצות חכמות מבוססות בינה מלאכותית'
  },
  loyalty_program: {
    requiredPlan: 'pro',
    category: 'clients',
    name: 'תוכנית נאמנות',
    description: 'ניקוד ופרסים ללקוחות'
  },
  custom_reports: {
    requiredPlan: 'gold',
    category: 'analytics',
    name: 'דוחות מותאמים',
    description: 'יצירת דוחות בהתאמה אישית'
  },
  multi_staff: {
    requiredPlan: 'premium',
    category: 'clients',
    name: 'צוות מרובה',
    description: 'ניהול מספר עובדים'
  },
  api_access: {
    requiredPlan: 'premium',
    category: 'integrations',
    name: 'גישה ל-API',
    description: 'חיבור למערכות חיצוניות'
  }
};

// Plan hierarchy for upgrade paths
export const PLAN_HIERARCHY: Record<PlanType, number> = {
  starter: 1,
  pro: 2,
  gold: 3,
  premium: 4
};

// Plan display information
export const PLAN_INFO: Record<PlanType, {
  name: string;
  color: string;
  icon: string;
  price: number;
  description: string;
}> = {
  starter: {
    name: 'Starter',
    color: '#10B981',
    icon: '🌱',
    price: 0,
    description: 'מתחילות - עד 50 לקוחות'
  },
  pro: {
    name: 'Pro',
    color: '#6366F1',
    icon: '⭐',
    price: 149,
    description: 'מקצועי - כל הכלים הבסיסיים'
  },
  gold: {
    name: 'Gold',
    color: '#F59E0B',
    icon: '👑',
    price: 249,
    description: 'זהב - אוטומציות ומיתוג'
  },
  premium: {
    name: 'Premium',
    color: '#8B5CF6',
    icon: '💎',
    price: 399,
    description: 'פרמיום - פתרון מלא לעסקים גדולים'
  }
};

// Get user's current plan from signup data or business owner data
export function getCurrentPlan(subscriptionLevel?: string): PlanType {
  if (!subscriptionLevel) return 'starter';
  
  const planMap: Record<string, PlanType> = {
    'starter': 'starter',
    'pro': 'pro', 
    'gold': 'gold',
    'premium': 'premium'
  };
  
  return planMap[subscriptionLevel] || 'starter';
}

// Check if user has access to a feature
export function hasFeatureAccess(userPlan: PlanType, feature: FeatureName): boolean {
  const requiredPlan = FEATURE_PERMISSIONS[feature].requiredPlan;
  return PLAN_HIERARCHY[userPlan] >= PLAN_HIERARCHY[requiredPlan];
}

// Get required plan for upgrade
export function getRequiredPlan(feature: FeatureName): PlanType {
  return FEATURE_PERMISSIONS[feature].requiredPlan;
}

// Get all features available in a plan
export function getPlanFeatures(plan: PlanType): FeatureName[] {
  return Object.entries(FEATURE_PERMISSIONS)
    .filter(([_, config]) => PLAN_HIERARCHY[plan] >= PLAN_HIERARCHY[config.requiredPlan])
    .map(([feature, _]) => feature as FeatureName);
}

// Get upgrade suggestions for locked features
export function getUpgradePath(currentPlan: PlanType, targetFeature: FeatureName): PlanType | null {
  const requiredPlan = FEATURE_PERMISSIONS[targetFeature].requiredPlan;
  
  if (PLAN_HIERARCHY[currentPlan] >= PLAN_HIERARCHY[requiredPlan]) {
    return null; // Already has access
  }
  
  return requiredPlan;
}
