export interface Client {
  id: number;
  name: string;
  industry?: string;
  status: 'Active' | 'On Hold' | 'Churned' | 'Lead';
  start_date?: string;
  contract_end_date?: string;
  
  // Contract Deliverables
  videos_per_month: number;
  posts_per_month: number;
  
  // Financials
  budget: number;
  currency: string;
  
  notes?: string;
  leave_reason?: string;
  created_at: string;
}
