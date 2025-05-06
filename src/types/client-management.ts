
export interface EmotionalLog {
  id: string;
  user_id: string;
  client_id: string;
  content: string;
  tags: string[];
  sentiment?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface RiskAssessment {
  id: string;
  user_id: string;
  client_id: string;
  risk_score: number;
  reasons: string[];
  suggested_actions: string[];
  status: string;
  last_action_date?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export interface AutomatedAction {
  id: string;
  user_id: string;
  client_id: string;
  source_type: 'emotional_log' | 'risk_assessment';
  source_id: string;
  action_type: 'message' | 'reminder' | 'task' | 'email';
  status: 'pending' | 'completed' | 'failed';
  content?: string;
  scheduled_for?: string;
  executed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  photo_url?: string;
  status?: string;
}

export interface EmotionalLogFormValues {
  client_id: string;
  content: string;
  tags: string[];
  sentiment?: string;
}

export interface RiskAssessmentFormValues {
  client_id: string;
  risk_score: number;
  reasons: string[];
  suggested_actions: string[];
  status?: string;
}

export interface AutomatedActionFormValues {
  client_id: string;
  source_type: 'emotional_log' | 'risk_assessment';
  source_id: string;
  action_type: 'message' | 'reminder' | 'task' | 'email';
  content?: string;
  scheduled_for?: string;
}
