"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Lead {
  id?: string;
  lead_id?: string;
  business_name: string;
  name?: string;
  email?: string;
  phone?: string;
  government?: string;
  budget?: number;
  has_website?: boolean;
  message?: string;
  assigned_to?: string;
  created_at?: string;
}

interface User {
  id: string;
  username: string;
  role: "admin" | "sales";
}

interface ApiResponse {
  success: boolean;
  data?: {
    success?: boolean;
    data?: Lead[];
  };
  error?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as User;
      setUser(parsedUser);
      fetchLeads(parsedUser);
    } catch {
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  // Fetch leads from API
  async function fetchLeads(currentUser: User) {
    try {
      const url = `/api/lead?role=${currentUser.role}&user_id=${currentUser.id}`;
      const res = await fetch(url);
      const json = (await res.json()) as ApiResponse;

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch leads");
      }

      const leadsArray: Lead[] = Array.isArray(json.data?.data) ? json.data.data : [];
      setLeads(leadsArray);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="text-center mt-8">Loading leads...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!user) return null;

  return (
    <div style={{ fontFamily: "'Cairo', sans-serif" }} className="p-8 max-w-full overflow-x-auto">
      {/* Import Cairo font */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap');`}
      </style>

      {/* Logo */}
      <div className="flex justify-center mb-16">
        <Link
          href="/"
          className="text-6xl font-bold transition text-[#fee3d8]"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          N
        </Link>
      </div>

      {/* Header and Logout */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {user.role === "admin" ? "Admin Dashboard" : "Sales Dashboard"}
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Leads Table */}
      {leads.length === 0 ? (
 <p className="text-center text-gray-200">No leads found.</p>
) : (
  <table className="w-full table-auto border-collapse border border-purple-600 text-left bg-purple-700">
    <thead className="bg-purple-600">
      <tr>
        <th className="px-4 py-2 border border-purple-500 text-gray-100">Lead ID</th>
        <th className="px-4 py-2 border border-purple-500 text-gray-100">Business Name</th>
        <th className="px-4 py-2 border border-purple-500 text-gray-100">Name</th>
        <th className="px-4 py-2 border border-purple-500 text-gray-100">Phone</th>
        <th className="px-4 py-2 border border-purple-500 text-gray-100">Assigned To</th>
        <th className="px-4 py-2 border border-purple-500 text-gray-100">Budget</th>
        <th className="px-4 py-2 border border-purple-500 text-gray-100">Has Website</th>
        <th className="px-4 py-2 border border-purple-500 text-gray-100">Created At</th>
      </tr>
    </thead>
    <tbody>
      {leads.map((lead, idx) => (
        <tr
          key={lead.id ?? idx}
          className={idx % 2 === 0 ? "bg-purple-700" : "bg-purple-600"}
        >
          <td className="px-4 py-2 border border-purple-500 text-gray-100">{lead.lead_id ?? "-"}</td>
          <td className="px-4 py-2 border border-purple-500 text-gray-100">{lead.business_name}</td>
          <td className="px-4 py-2 border border-purple-500 text-gray-100">{lead.name ?? "-"}</td>
          <td className="px-4 py-2 border border-purple-500 text-gray-100">{lead.phone ?? "-"}</td>
          <td className="px-4 py-2 border border-purple-500 text-gray-100">{lead.assigned_to ?? "-"}</td>
          <td className="px-4 py-2 border border-purple-500 text-gray-100">{lead.budget ?? "-"}</td>
          <td className="px-4 py-2 border border-purple-500 text-gray-100">{lead.has_website ? "Yes" : "No"}</td>
          <td className="px-4 py-2 border border-purple-500 text-gray-100">{lead.created_at ?? "-"}</td>
        </tr>
      ))}
    </tbody>
  </table>
      )}
    </div>
  );
}
