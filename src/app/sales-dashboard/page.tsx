"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
          `/api/lead?role=${encodeURIComponent(user.role)}&user_id=${encodeURIComponent(user.id)}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Failed to fetch leads: ${text}`);
        }

        const json = (await res.json()) as any;

        const leadsArray: Lead[] =
          Array.isArray(json?.data?.data) ? json.data.data : [];

        setLeads(leadsArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (loading) return <p className="p-4 text-gray-200">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div
      className="min-h-screen p-8 text-gray-100"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      {/* Import Cairo font */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap');`}
      </style>

      {/* Logo */}
      <div className="flex justify-center mb-16">
        <Link
          href="/"
          className="text-6xl font-bold text-[#fee3d8] transition"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          N
        </Link>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold mb-6">Sales Dashboard</h1>

      {leads.length === 0 ? (
        <p className="text-center text-gray-200">No leads assigned to you yet.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-purple-500 text-left rounded-lg overflow-hidden">
          <thead className="bg-purple-600">
            <tr>
              <th className="px-4 py-2 border border-purple-500 text-gray-100">Business</th>
              <th className="px-4 py-2 border border-purple-500 text-gray-100">Name</th>
              <th className="px-4 py-2 border border-purple-500 text-gray-100">Phone</th>
              <th className="px-4 py-2 border border-purple-500 text-gray-100">Government</th>
              <th className="px-4 py-2 border border-purple-500 text-gray-100">Budget</th>
              <th className="px-4 py-2 border border-purple-500 text-gray-100">Website</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => (
              <tr
                key={lead.id}
                className={idx % 2 === 0 ? "bg-purple-700 hover:bg-purple-600" : "bg-purple-600 hover:bg-purple-500"}
              >
                <td className="px-4 py-2 border border-purple-500">{lead.business_name}</td>
                <td className="px-4 py-2 border border-purple-500">{lead.name || "-"}</td>
                <td className="px-4 py-2 border border-purple-500">{lead.phone || "-"}</td>
                <td className="px-4 py-2 border border-purple-500">{lead.government || "-"}</td>
                <td className="px-4 py-2 border border-purple-500">{lead.budget ?? "-"}</td>
                <td className="px-4 py-2 border border-purple-500">{lead.has_website ? "✅" : "❌"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
