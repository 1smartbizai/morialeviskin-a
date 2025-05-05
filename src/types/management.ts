

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

export interface LoyaltyRule {
  id: string;
  name: string;
  description: string | null;
  rule_type: 'visit_count' | 'spend_amount' | 'product_purchase';
  threshold: number;
  reward_type: 'points' | 'discount' | 'free_product' | 'free_service';
  reward_value: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string | null;
  point_cost: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientLoyalty {
  id: string;
  client_id: string;
  total_points: number;
  visits_count: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyTransaction {
  id: string;
  client_id: string;
  transaction_type: 'earned' | 'redeemed';
  points: number;
  source: string;
  source_id: string | null;
  description: string | null;
  created_at: string;
}

export interface RedeemedReward {
  id: string;
  client_id: string;
  loyalty_reward_id: string;
  points_used: number;
  status: 'pending' | 'redeemed' | 'expired';
  created_at: string;
  updated_at: string;
  redeemed_at: string | null;
  reward?: LoyaltyReward;
}

export interface ClientWithLoyalty {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo_url: string | null;
  loyalty?: ClientLoyalty;
}

