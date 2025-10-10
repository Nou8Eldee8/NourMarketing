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
  id: string;
  business_name: string;
  name: string;
  email: string;
  phone: string;
  government: string;
  budget: string; // changed from number
  has_website: boolean;
  message: string;
  assigned_to: number;
  created_at: string;
  status: "First Call" | "Follow up" | "Waiting for proposal" | "Proposal approved" | "Done Deal";
}

