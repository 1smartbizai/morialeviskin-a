export interface Treatment {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sku: string | null;
  in_stock: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface TreatmentPlan {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface TreatmentPlanTreatment {
  id: string;
  treatment_plan_id: string;
  treatment_id: string;
  display_order: number;
  created_at: string;
  treatment?: Treatment;
}

export interface TreatmentProductRecommendation {
  id: string;
  treatment_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}
