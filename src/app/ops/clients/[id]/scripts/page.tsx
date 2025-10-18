"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Header from "../../../components/header";
import { ArrowLeft } from "lucide-react";

interface Script {
  id: number;
  client_id: number;
  title: string;
  script_text?: string;
  status: "Draft" | "Completed" | "Approved" | "Shot";
  date_created: string;
  content_type?: string;
}

interface Client {
  id: number;
  name: string;
  industry?: string;
  start_date?: string;
  notes?: string;
  status?: string;
  posts_in_contract: number;
  videos_in_contract: number;
}

export default function ClientScriptsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const clientId = pathname.split("/")[3]; // /ops/clients/[id]/scripts

  const [client, setClient] = useState<Client | null>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);

  const creatorId = 5; // Replace with actual logged-in creator ID

  useEffect(() => {
    async function fetchClient() {
      try {
        const res = await apiFetch<{ success: boolean; data: Client[] }>(
          `/api/clients?id=${clientId}&creator_id=${creatorId}`
        );
        if (res.success && res.data.length > 0) setClient(res.data[0]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchClient();
  }, [clientId]);

  useEffect(() => {
    async function fetchScripts() {
      setLoading(true);
      try {
        const res = await apiFetch<{ success: boolean; scripts: Script[] }>(
          `/api/scripts?client_id=${clientId}&creator_id=${creatorId}`
        );
        if (res.success) setScripts(res.scripts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchScripts();
  }, [clientId]);

  const handleStatusChange = async (
    scriptId: number,
    newStatus: "Draft" | "Completed" | "Approved"
  ) => {
    try {
      const res = await apiFetch<{ success: boolean; error?: string }>(
        `/api/scripts`,
        {
          method: "PUT",
          body: JSON.stringify({ id: scriptId, status: newStatus }),
        }
      );

      if (res.success) {
        setScripts((prev) =>
          prev.map((s) => (s.id === scriptId ? { ...s, status: newStatus } : s))
        );
      } else {
        console.error(res.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  function isWeeklyTask(scriptIndex: number) {
    if (!client) return false;
    const totalPosts = client.posts_in_contract;
    const totalVideos = client.videos_in_contract;
    const weeklyPosts = Math.ceil(totalPosts / 4);
    const weeklyVideos = Math.ceil(totalVideos / 4);

    const approvedScripts = scripts.filter((s) => s.status === "Approved");
    return (
      scriptIndex < weeklyPosts + weeklyVideos &&
      approvedScripts.length < weeklyPosts + weeklyVideos
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="p-6 max-w-5xl mx-auto mt-24">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-200 hover:text-white hover:bg-white/10 px-3 py-1 rounded"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {client && (
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-lg p-6 mb-10">
            <h1 className="text-3xl font-semibold mb-4">{client.name}</h1>
            <div className="space-y-2 text-sm text-gray-300">
              {client.industry && (
                <p>
                  <strong>Industry:</strong> {client.industry}
                </p>
              )}
              {client.status && (
                <p>
                  <strong>Status:</strong> {client.status}
                </p>
              )}
              {client.start_date && (
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(client.start_date).toLocaleDateString()}
                </p>
              )}
              <p>
                <strong>Videos in Contract:</strong> {client.videos_in_contract}
              </p>
              <p>
                <strong>Posts in Contract:</strong> {client.posts_in_contract}
              </p>
              {client.notes && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-gray-300 whitespace-pre-line">
                    <strong>Note:</strong> {client.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => router.push(`/ops/clients/${clientId}/scripts/new`)}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded mb-4"
        >
          Add Script
        </button>

        {loading ? (
          <div className="text-gray-400">Loading scripts...</div>
        ) : scripts.length === 0 ? (
          <div className="text-gray-400">No scripts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border border-white/20 rounded-lg">
              <thead className="bg-white/10 text-gray-200">
                <tr>
                  <th className="px-4 py-2 border-b border-white/20 text-left">Title</th>
                  <th className="px-4 py-2 border-b border-white/20 text-left">Status</th>
                  <th className="px-4 py-2 border-b border-white/20 text-left">Weekly Task</th>
                  <th className="px-4 py-2 border-b border-white/20 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scripts.map((s, idx) => (
                  <tr
                    key={s.id}
                    className={`hover:bg-white/10 cursor-pointer ${
                      isWeeklyTask(idx) ? "bg-yellow-500/20" : ""
                    }`}
                  >
                    <td className="px-4 py-3 border-b border-white/20">{s.title}</td>
                    <td className="px-4 py-3 border-b border-white/20">
                      {["Draft", "Completed", "Approved"].includes(s.status) ? (
                        <select
                          value={s.status}
                          onChange={(e) =>
                            handleStatusChange(
                              s.id,
                              e.target.value as "Draft" | "Completed" | "Approved"
                            )
                          }
                          className="bg-gray-800 text-white p-1 rounded border border-gray-600"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Completed">Completed</option>
                          <option value="Approved">Approved</option>
                        </select>
                      ) : (
                        s.status
                      )}
                    </td>
                    <td className="px-4 py-3 border-b border-white/20">
                      {isWeeklyTask(idx) ? "✅ Weekly Task" : ""}
                    </td>
                    <td className="px-4 py-3 border-b border-white/20 flex gap-2">
                      <button
                        onClick={() =>
                          router.push(`/ops/clients/${clientId}/scripts/${s.id}`)
                        }
                        className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!confirm("Delete this script?")) return;
                          await apiFetch(`/api/scripts`, {
                            method: "DELETE",
                            body: JSON.stringify({ id: s.id }),
                          });
                          setScripts(scripts.filter((x) => x.id !== s.id));
                        }}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                      >
                        Delete
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
