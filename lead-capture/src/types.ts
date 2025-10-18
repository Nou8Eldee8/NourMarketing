/* ========================================================================
   🧱 ENVIRONMENT BINDINGS
   ======================================================================== */
export interface Env {
  DB: D1Database;
  OPS_DB: D1Database; // optional secondary DB (for OPS team)
  JWT_SECRET: string;
}

/* ========================================================================
   🧍 USER TYPE
   ======================================================================== */
export interface User {
  id: number;
  username: string;
  role: string; // e.g. "admin" | "sales" | "manager"
}

/* ========================================================================
   📋 LEAD TYPE
   ======================================================================== */
export interface Lead {
  id: string; // UUID or random string
  business_name: string;
  name: string;
  email: string;
  phone: string;
  government: string;
  budget: string;
  has_website: number; // 0 or 1
  message: string;
  assigned_to: number;
  status: "First Call" | "Follow up" | "Closed" | "Lost" | string;
  created_at?: string;
}

/* ========================================================================
   🗒 NOTE TYPE
   ======================================================================== */
export interface Note {
  id?: number;
  lead_id: string;
  content: string;
  created_at?: string;
}

/* ========================================================================
   🧾 CLIENT TYPE
   ======================================================================== */
export interface Client {
  id?: number;
  name: string;
  industry?: string;
  start_date?: string;
  notes?: string;
  status?: string;
  videos_in_contract?: number;
  posts_in_contract?: number;
  created_at?: string;
}

/* ========================================================================
   📢 POST TYPE
   ======================================================================== */
export interface Post {
  id?: number;
  client_id: number;
  caption: string;
  platform: string; // e.g. "Instagram" | "Facebook"
  status: string;   // e.g. "Draft" | "Scheduled" | "Posted"
  created_at?: string;
}

/* ========================================================================
   🔐 AUTH RETURN TYPE
   ======================================================================== */
export interface AuthResult {
  authorized: boolean;
  user?: User;
  response?: Response; // returned if unauthorized
}
