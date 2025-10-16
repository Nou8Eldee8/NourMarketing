// src/types.ts
export interface Env {
  DB: D1Database;       // nour-leads
  OPS_DB: D1Database;   // nour-ops
}


export interface Lead {
  id: string;
  business_name: string;
  name: string;
  email: string;
  phone: string;
  government: string;
  budget: string;
  has_website: number;
  message: string;
  assigned_to: number;
  status: "First Call" | "Follow up" | "Closed" | "Lost" | string;
  created_at: string;
}

export interface Note {
  id: string;
  lead_id: string;
  user_id: number;
  content: string;
  created_at: string;
}
