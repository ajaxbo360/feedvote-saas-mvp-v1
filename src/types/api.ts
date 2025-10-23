export interface FeedbackSubmission {
  project_id: string;
  title: string;
  description: string;
  tags?: string[];
  attachment_url?: string;
}

export interface FeedbackItem extends FeedbackSubmission {
  id: string;
  votes: number;
  created_at: string;
  updated_at: string;
}

export interface FeedbackVote {
  project_id: string;
  feedback_id: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface VoteResponse {
  feedback_id: string;
  votes: number;
}

export interface FileUploadResponse {
  url: string;
}
