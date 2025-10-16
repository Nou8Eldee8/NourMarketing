export interface Client {
  id: number;
  name: string;
  industry?: string;
  start_date?: string;
  notes?: string;
  status?: string;
  videos_in_contract?: number;
  posts_in_contract?: number;
  leave_reason?: string;
}
