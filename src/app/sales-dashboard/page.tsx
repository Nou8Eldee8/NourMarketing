"use client";

import { useEffect, useState } from "react";

interface Lead {
  id: string;
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
  id: number;
  username: string;
  role: "admin" | "sales";
}

export default function SalesDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("Unauthorized — please log in again.");
      setLoading(false);
      return;
    }

    let user: User;
    try {
      user = JSON.parse(storedUser);
    } catch {
      setError("Invalid user data in localStorage.");
      setLoading(false);
      return;
    }

    if (!user?.id || !user?.role) {
      setError("Unauthorized — please log in again.");
      setLoading(false);
      return;
    }

    const fetchLeads = async () => {
      try {
        const res = await fetch(
          `/api/lead?role=${encodeURIComponent(user.role)}&user_id=${encodeURIComponent(
            user.id
          )}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch leads: ${text}`);
        }

        const json = (await res.json()) as unknown;

        // Unwrap nested data: json.data.data
        const leadsArray: Lead[] =
          typeof json === "object" &&
          json !== null &&
          "data" in json &&
          typeof (json as any).data === "object" &&
          (json as any).data !== null &&
          "data" in (json as any).data &&
          Array.isArray((json as any).data.data)
            ? (json as any).data.data
            : [];

        setLeads(leadsArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Dashboard</h1>

      {leads.length === 0 ? (
        <p className="text-gray-500">No leads assigned to you yet.</p>
      ) : (
        <table className="w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2">Business</th>
              <th className="p-2">Name</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Government</th>
              <th className="p-2">Budget</th>
              <th className="p-2">Website</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t hover:bg-gray-50">
                <td className="p-2">{lead.business_name}</td>
                <td className="p-2">{lead.name || "-"}</td>
                <td className="p-2">{lead.phone || "-"}</td>
                <td className="p-2">{lead.government || "-"}</td>
                <td className="p-2">{lead.budget ?? "-"}</td>
                <td className="p-2">{lead.has_website ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
