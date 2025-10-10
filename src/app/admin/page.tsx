"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Lead {
  id: string;
  lead_id?: string;
  business_name: string;
  name?: string;
  email?: string;
  phone?: string;
  government?: string;
  budget?: number | string;
  has_website?: boolean;
  message?: string;
  assigned_to?: string;
  created_at?: string;
  status?: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statuses = [
    "All",
    "Not Contacted",
    "First Call",
    "Follow up",
    "Waiting for proposal",
    "Proposal approved",
    "Done Deal",
  ];

  // 🧠 Load user + fetch leads
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

  async function fetchLeads(currentUser: User) {
    try {
      const res = await fetch(`/api/lead?role=${currentUser.role}&user_id=${currentUser.id}`);
      const json = (await res.json()) as ApiResponse;

      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch leads");

      const leadsArray: Lead[] = Array.isArray(json.data?.data) ? json.data.data : [];
      setLeads(leadsArray);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // 🔄 Update status
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/lead", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      if (!res.ok) throw new Error(await res.text());

      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  // 🔍 Search + Filter + Sort
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    // Search by name, phone, or business
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.business_name?.toLowerCase().includes(lower) ||
          lead.name?.toLowerCase().includes(lower) ||
          lead.phone?.includes(lower)
      );
    }

    // Filter by status
    if (filterStatus !== "All") {
      result = result.filter((lead) => {
        const status = lead.status?.toLowerCase().trim();
        const filter = filterStatus.toLowerCase().trim();
        return (
          status === filter ||
          (status === "uncontacted" && filter === "not contacted") ||
          (status === "not contacted" && filter === "uncontacted")
        );
      });
    }

    return result;
  }, [leads, searchTerm, filterStatus]);

  if (loading) return <p className="text-center mt-8">Loading leads...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!user) return null;

  return (
    <div
      style={{ fontFamily: "'Cairo', sans-serif" }}
      className="p-8 max-w-full overflow-x-auto text-gray-100"
    >
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap');`}
      </style>

      {/* Logo */}
      <div className="flex justify-center mb-16">
        <Link
          href="/"
          className="text-6xl font-bold text-[#fee3d8]"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          N
        </Link>
      </div>

      {/* Header + Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 w-72 rounded-lg border border-purple-600 bg-purple-700 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-purple-700 text-white border border-purple-500 rounded px-3 py-2"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

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
      </div>

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <p className="text-center text-gray-300">No leads found.</p>
      ) : (
        <table className="w-full table-auto border-collapse border border-purple-600 text-left rounded-lg overflow-hidden">
          <thead className="bg-purple-600">
            <tr>
              {[
                "Business Name",
                "Name",
                "Phone",
                "Assigned To",
                "Budget",
                "Website",
                "Status",
                "Created At",
              ].map((label) => (
                <th
                  key={label}
                  className="px-4 py-2 border border-purple-500 text-gray-100"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
 <tbody>
  {filteredLeads.map((lead, idx) => (
    <tr
      key={lead.id}
      className={`cursor-pointer ${
        idx % 2 === 0
          ? "bg-purple-700 hover:bg-purple-600"
          : "bg-purple-600 hover:bg-purple-500"
      }`}
      onClick={() => router.push(`/leads/${lead.id}`)}
    >
      <td className="px-4 py-2 border border-purple-500">{lead.business_name}</td>
      <td className="px-4 py-2 border border-purple-500">{lead.name || "-"}</td>
      <td className="px-4 py-2 border border-purple-500">{lead.phone || "-"}</td>
      <td className="px-4 py-2 border border-purple-500">{lead.assigned_to || "-"}</td>
      <td className="px-4 py-2 border border-purple-500">{lead.budget ?? "-"}</td>
      <td className="px-4 py-2 border border-purple-500">
        {lead.has_website ? "✅" : "❌"}
      </td>
      <td className="px-4 py-2 border border-purple-500">
        <select
          value={lead.status || "Not Contacted"}
          onChange={(e) => {
            e.stopPropagation(); // Prevent row click
            handleStatusChange(lead.id, e.target.value);
          }}
          className="bg-purple-800 text-white rounded px-2 py-1 border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
        >
          {statuses.filter((s) => s !== "All").map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </td>
      <td className="px-4 py-2 border border-purple-500">{lead.created_at || "-"}</td>
    </tr>
  ))}
</tbody>

        </table>
      )}
    </div>
  );
}
