"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import UsersTab from "./components/UsersTab";

// ==============================
// 🔹 Types
// ==============================
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
  assigned_to?: number | string;
  created_at?: string;
  status?: string;
}

interface User {
  id: number;
  username: string;
  role: "admin" | "sales";
}

interface LeadsResponse {
  success: boolean;
  data?: Lead[];
  error?: string;
}

interface UsersResponse {
  success: boolean;
  data: User[];
  error?: string;
}

// ==============================
// 🔹 Component
// ==============================
export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"leads" | "users">("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // ==============================
  // 🧠 Load user + fetch leads/users
  // ==============================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    try {
      const parsedUser: User = JSON.parse(storedUser);
      setUser(parsedUser);
      void Promise.all([fetchLeads(parsedUser), fetchUsers()]);
    } catch {
      localStorage.removeItem("user");
      router.push("/login");
    }
  }, [router]);

  // ==============================
  // 📦 Fetch Leads
  // ==============================
  async function fetchLeads(currentUser: User): Promise<void> {
    try {
      const data = await apiFetch<LeadsResponse>(
        `/api/lead?role=${currentUser.role}&user_id=${currentUser.id}`
      );

      setLeads(data.data ?? []);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  // ==============================
  // 👥 Fetch Users
  // ==============================
  async function fetchUsers(): Promise<void> {
    try {
      const data = await apiFetch<UsersResponse>(`/api/users`);
      setUsers(data.data || []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
    }
  }

  // ==============================
  // 🔄 Update Lead Status
  // ==============================
  const handleStatusChange = async (leadId: string, newStatus: string): Promise<void> => {
    try {
      await apiFetch(`/api/lead`, {
        method: "PUT",
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  // ==============================
  // 🧩 Get Username from ID
  // ==============================
  const getAssignedUsername = (assignedTo?: number | string): string => {
    if (!assignedTo) return "-";
    const found = users.find((u) => u.id === Number(assignedTo));
    return found ? found.username : `#${assignedTo}`;
  };

  // ==============================
  // 🔍 Filter + Search
  // ==============================
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (lead) =>
          lead.business_name?.toLowerCase().includes(lower) ||
          lead.name?.toLowerCase().includes(lower) ||
          lead.phone?.includes(lower)
      );
    }

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

  // ==============================
  // 🧱 Render
  // ==============================
  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!user) return null;

  return (
    <div
      style={{ fontFamily: "'Cairo', sans-serif" }}
      className="p-8 max-w-full overflow-x-auto text-gray-100 min-h-screen"
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

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        <button
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/20">
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-6 py-3 font-semibold transition ${activeTab === "leads"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-gray-200"
            }`}
        >
          Leads
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-6 py-3 font-semibold transition ${activeTab === "users"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-gray-200"
            }`}
        >
          Team Members
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "leads" ? (
        <div>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
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
                    <th key={label} className="px-4 py-2 border border-purple-500 text-gray-100">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead, idx) => (
                  <tr
                    key={lead.id}
                    className={`cursor-pointer ${idx % 2 === 0
                        ? "bg-purple-700 hover:bg-purple-600"
                        : "bg-purple-600 hover:bg-purple-500"
                      }`}
                    onClick={() => router.push(`/leads/${lead.id}`)}
                  >
                    <td className="px-4 py-2 border border-purple-500">{lead.business_name}</td>
                    <td className="px-4 py-2 border border-purple-500">{lead.name || "-"}</td>
                    <td className="px-4 py-2 border border-purple-500">{lead.phone || "-"}</td>
                    <td className="px-4 py-2 border border-purple-500">
                      {getAssignedUsername(lead.assigned_to)}
                    </td>
                    <td className="px-4 py-2 border border-purple-500">{lead.budget ?? "-"}</td>
                    <td className="px-4 py-2 border border-purple-500">
                      {lead.has_website ? "✅" : "❌"}
                    </td>
                    <td className="px-4 py-2 border border-purple-500">
                      <select
                        value={lead.status || "Not Contacted"}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(lead.id, e.target.value);
                        }}
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
                    <td className="px-4 py-2 border border-purple-500">{lead.created_at || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <UsersTab />
      )}
    </div>
  );
}
