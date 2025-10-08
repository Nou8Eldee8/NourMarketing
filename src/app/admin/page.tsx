"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

      // Drill down into nested data (API returns data.data)
      const leadsArray: Lead[] = Array.isArray(json.data?.data) ? json.data.data : [];
      setLeads(leadsArray);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // Render states
  if (loading) return <p className="text-center mt-8">Loading leads...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!user) return null;

  return (
    <div className="p-8 max-w-full overflow-x-auto">
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

      {leads.length === 0 ? (
        <p className="text-center text-gray-500">No leads found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300 text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 border border-gray-300">Lead ID</th>
              <th className="px-4 py-2 border border-gray-300">Business Name</th>
              <th className="px-4 py-2 border border-gray-300">Name</th>
              <th className="px-4 py-2 border border-gray-300">Phone</th>
              <th className="px-4 py-2 border border-gray-300">Assigned To</th>
              <th className="px-4 py-2 border border-gray-300">Budget</th>
              <th className="px-4 py-2 border border-gray-300">Has Website</th>
              <th className="px-4 py-2 border border-gray-300">Created At</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => (
              <tr key={lead.id ?? idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-4 py-2 border border-gray-300">{lead.lead_id ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-300">{lead.business_name}</td>
                <td className="px-4 py-2 border border-gray-300">{lead.name ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-300">{lead.phone ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-300">{lead.assigned_to ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-300">{lead.budget ?? "-"}</td>
                <td className="px-4 py-2 border border-gray-300">{lead.has_website ? "Yes" : "No"}</td>
                <td className="px-4 py-2 border border-gray-300">{lead.created_at ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
