"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Lead {
  id: string;
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
  id: number;
  username: string;
  role: "admin" | "sales";
}

export default function SalesDashboard() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof Lead | "created_at">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const statuses = [
    "All",
    "Not Contacted",
    "Not Available",
    "Call Back",
    "First Call",
    "Follow up",
    "Waiting for proposal",
    "Proposal approved",
    "Done Deal",
  ];

  // 🧩 Helper: fetch with token header
  const fetchWithAuth = async (url: string, options?: RequestInit) => {
    const token = localStorage.getItem("token");
    const headers = {
      ...(options?.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
    };
    const res = await fetch(url, { ...options, headers });
    return res;
  };

  // 🧠 Fetch user + leads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setError("Unauthorized — please log in again.");
      setLoading(false);
      return;
    }

    let parsedUser: User;
    try {
      parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch {
      setError("Invalid user data in localStorage.");
      setLoading(false);
      return;
    }

    if (!parsedUser?.id || !parsedUser?.role) {
      setError("Unauthorized — please log in again.");
      setLoading(false);
      return;
    }

    const fetchLeads = async () => {
      try {
        const res = await fetchWithAuth(
          `/api/lead?role=${encodeURIComponent(parsedUser.role)}&user_id=${encodeURIComponent(
            parsedUser.id
          )}`
        );

        if (!res.ok) throw new Error(await res.text());
        const json = (await res.json()) as any;

        const leadsArray: Lead[] = Array.isArray(json?.data?.data)
          ? json.data.data
          : Array.isArray(json?.data)
          ? json.data
          : Array.isArray(json)
          ? json
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

  // 🔍 Filter + Sort + Search
  const filteredLeads = useMemo(() => {
    let result = [...leads];
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.business_name?.toLowerCase().includes(lower) ||
          lead.name?.toLowerCase().includes(lower) ||
          lead.phone?.toLowerCase().includes(lower)
      );
    }
    if (filterStatus !== "All") {
      result = result.filter((lead) => lead.status === filterStatus);
    }
    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (!aVal || !bVal) return 0;
      return sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return result;
  }, [leads, searchTerm, sortKey, sortOrder, filterStatus]);

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/login");
  };

  // 🔄 Update lead status
  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetchWithAuth("/api/lead", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      if (!res.ok) throw new Error(await res.text());
      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
      );
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  };

  // ⬇️ Sorting toggle
  const toggleSort = (key: keyof Lead | "created_at") => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // 📄 Navigate to lead detail page
  const openLeadDetails = (leadId: string) => {
    router.push(`/leads/${leadId}`);
  };

  if (loading) return <p className="p-4 text-gray-200">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen p-8 text-gray-100" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap');`}
      </style>

      {/* Header */}
      <div className="flex justify-between items-center mb-10 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-5xl font-bold text-[#fee3d8]"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            N
          </Link>
          {user && (
            <span className="text-xl text-gray-200 font-medium">
              Hi there, <span className="text-[#fee3d8] font-semibold">{user.username}</span> 👋
            </span>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
        >
          Logout
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Sales Dashboard</h1>
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or phone..."
            className="px-4 py-2 rounded bg-purple-700 text-white placeholder-gray-300 border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-300 w-72"
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
        </div>
      </div>

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <p className="text-center text-gray-300">No leads found.</p>
      ) : (
        <table className="w-full border border-purple-500 text-left rounded-lg overflow-hidden">
          <thead className="bg-purple-600">
            <tr>
              {[
                { key: "business_name", label: "Business" },
                { key: "name", label: "Name" },
                { key: "phone", label: "Phone" },
                { key: "government", label: "Gov" },
                { key: "budget", label: "Budget" },
                { key: "has_website", label: "Website" },
                { key: "status", label: "Status" },
              ].map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => toggleSort(key as keyof Lead)}
                  className="px-4 py-2 border border-purple-500 cursor-pointer hover:bg-purple-500"
                >
                  {label}
                  {sortKey === key && (sortOrder === "asc" ? " ▲" : " ▼")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead, idx) => (
              <tr
                key={lead.id}
                onClick={() => openLeadDetails(lead.id)}
                className={`cursor-pointer transition ${
                  idx % 2 === 0
                    ? "bg-purple-700 hover:bg-purple-600"
                    : "bg-purple-600 hover:bg-purple-500"
                }`}
              >
                <td className="px-4 py-2 border border-purple-500">{lead.business_name}</td>
                <td className="px-4 py-2 border border-purple-500">{lead.name || "-"}</td>
                <td className="px-4 py-2 border border-purple-500">{lead.phone || "-"}</td>
                <td className="px-4 py-2 border border-purple-500">{lead.government || "-"}</td>
                <td className="px-4 py-2 border border-purple-500">{lead.budget ?? "-"}</td>
                <td className="px-4 py-2 border border-purple-500">
                  {lead.has_website ? "✅" : "❌"}
                </td>
                <td
                  className="px-4 py-2 border border-purple-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <select
                    value={
                      lead.status
                        ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1)
                        : "Not Contacted"
                    }
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="bg-purple-800 text-white rounded px-2 py-1 border border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  >
                    {statuses
                      .filter((s) => s !== "All")
                      .map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
