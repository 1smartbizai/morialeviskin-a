
export interface FeedbackSurvey {
  id: string;
  client_id: string;
  business_owner_id: string;
  overall_satisfaction: number;
  staff_friendliness: number;
  treatment_effectiveness: number;
  additional_comments?: string;
  created_at: string;
}

export interface FeedbackDismissal {
  id: string;
  client_id: string;
  created_at: string;
}
