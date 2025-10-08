export interface Env {
  DB: D1Database;
}

export interface User {
  id: number;
  username: string;
  password: string;
  role: "admin" | "sales";
}

export interface Lead {
  id?: number;
  lead_id: string;
  business_name: string;
  name?: string;
  email?: string;
  phone?: string;
  government?: string;
  budget?: number;
  has_website?: boolean;
  message?: string;
  created_at?: string;
  assigned_to?: number; // user.id of salesperson
}
