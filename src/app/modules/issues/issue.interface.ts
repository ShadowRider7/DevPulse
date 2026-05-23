export interface IIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
  reporter_id?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface IIssueFilters {
  sort?: string;
  type?: string;
  status?: string;
}
