// src/types.ts

export interface Env {
  DB: D1Database;
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
