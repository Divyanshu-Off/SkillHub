export interface Project {
  id: number;
  owner: string;
  title: string;
  description: string;
  github_url: string;
  live_url: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CreateProjectPayload {
  title: string;
  description: string;
  github_url?: string;
  live_url?: string;
}
