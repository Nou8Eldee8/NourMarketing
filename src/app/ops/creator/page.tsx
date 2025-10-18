"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Header from "../components/header";

interface Client {
  id: number;
  name: string;
  status: string;
  posts_in_contract?: number;
  videos_in_contract?: number;
  weeklyHighlight?: boolean; // new property
  approvedPosts?: number; // approved scripts count
  approvedVideos?: number; // optional if you want to track videos separately
}

interface ApiResponse<T> {
  success: boolean;
  data: T[];
  [key: string]: any;
}

export default function ContentCreatorDashboard() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const CREATOR_ID = 5; // replace with logged-in user id dynamically if available

  useEffect(() => {
    async function fetchClients() {
      try {
        // Get only clients assigned to this creator
        const res = await apiFetch<ApiResponse<Client>>(`/api/clients?creator_id=${CREATOR_ID}`);
        const activeClients = res.data.filter((c) => c.status === "Active");

        // Calculate weekly highlights and approved scripts
        const clientsWithHighlights = await Promise.all(
          activeClients.map(async (c) => {
            // fetch scripts for this client
            const scriptsRes = await apiFetch<ApiResponse<any>>(`/api/scripts?client_id=${c.id}`);
            const scripts = scriptsRes.data || [];

            // Count approved scripts
            const approvedScripts = scripts.filter((s: any) => s.status === "Approved");

            // Weekly calculation
            const totalWeeks = 4; // you can adjust
            const postsPerWeek = (c.posts_in_contract ?? 0) / totalWeeks;
            const videosPerWeek = (c.videos_in_contract ?? 0) / totalWeeks;

            const weekDone = approvedScripts.length >= postsPerWeek; // simple: compare approved scripts vs week quota
            const weeklyHighlight = !weekDone;

            return {
              ...c,
              approvedPosts: approvedScripts.length,
              weeklyHighlight,
            };
          })
        );

        setClients(clientsWithHighlights);
      } catch (err) {
        console.error("Error fetching clients:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="p-6 max-w-5xl mx-auto mt-[128px]"> {/* pushed below header */}
        <h1 className="text-3xl font-bold mb-6">Active Clients</h1>

        {loading ? (
          <div className="text-gray-400">Loading clients...</div>
        ) : clients.length === 0 ? (
          <div className="text-gray-400">No active clients found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-white/20 rounded-lg">
              <thead className="bg-white/10 text-gray-200">
                <tr>
                  <th className="px-4 py-2 border-b border-white/20 text-left">Name</th>
                  <th className="px-4 py-2 border-b border-white/20 text-left">Posts (Approved / Total)</th>
                  <th className="px-4 py-2 border-b border-white/20 text-left">Videos (Approved / Total)</th>
                  <th className="px-4 py-2 border-b border-white/20 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className={`hover:bg-white/10 cursor-pointer ${client.weeklyHighlight ? "bg-yellow-500/20" : ""}`}
                  >
                    <td className="px-4 py-3 border-b border-white/20">{client.name}</td>
                    <td className="px-4 py-3 border-b border-white/20">
                      {client.approvedPosts ?? 0} / {client.posts_in_contract ?? 0}
                    </td>
                    <td className="px-4 py-3 border-b border-white/20">
                      {client.approvedPosts ?? 0} / {client.videos_in_contract ?? 0}
                    </td>
                    <td className="px-4 py-3 border-b border-white/20">
                      <button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md"
                        onClick={() => router.push(`/ops/clients/${client.id}/scripts`)}
                      >
                        View Scripts
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
