
export interface SkinQuestion {
  id: string;
  question: string;
  questionType: 'multiple_choice' | 'scale' | 'text';
  options?: string[];
  order: number;
  isActive: boolean;
}

export interface SkinAnswer {
  id: string;
  questionId: string;
  clientId: string;
  answer: string;
  answeredAt: Date;
}

export interface SkinAttribute {
  category: string;
  attribute: string;
  value: string;
  confidence: number; // 0-100 scale representing how confident we are about this attribute
  updatedAt: Date;
}

export interface SkinProfile {
  clientId: string;
  attributes: SkinAttribute[];
  lastQuestionDate?: Date;
  answeredQuestions: SkinAnswer[];
}

export interface SkinProductSuggestion {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  reason: string;
}

export interface SkinTreatmentSuggestion {
  id: string;
  name: string;
  description: string;
  reason: string;
}
