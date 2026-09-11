export interface PathStep {
  id: number;
  path: number;
  title: string;
  description: string;
  resource_url: string;
  order: number;
  created_at: string;
  is_completed: boolean;
}

export interface LearningPath {
  id: number;
  owner: string;
  title: string;
  description: string;
  category: string;
  steps: PathStep[];
  total_steps: number;
  completed_steps: number;
  created_at: string;
  updated_at: string;
}

export interface CreateLearningPathPayload {
  title: string;
  description: string;
  category: string;
}

export interface CreatePathStepPayload {
  path: number;
  title: string;
  description: string;
  resource_url?: string;
  order: number;
}
