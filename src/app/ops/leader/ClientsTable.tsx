"use client";

import { useEffect, useState } from "react";
import AddClientModal from "./AddClientModal";

interface Client {
  id: number;
  name: string;
  industry?: string;
  status?: string;
  videos_in_contract: number;
  posts_in_contract: number;
  videos_published: number;
  posts_published: number;
}

interface ApiResponse {
  success: boolean;
  clients?: Client[];
  error?: string;
}

export default function ClientsTable() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Fetch clients
  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/clients`);
        const json = (await res.json()) as ApiResponse;

        if (!json.success) throw new Error(json.error || "Failed to fetch clients");
        setClients(json.clients || []);
      } catch (err) {
        console.error("Error fetching clients:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading clients...</p>;
  }

  return (
    <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl mt-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Clients</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          + Add Client
        </button>
      </div>

      <table className="w-full table-auto border-collapse text-left text-white">
        <thead>
          <tr className="text-gray-200 border-b border-white/20">
            <th className="px-4 py-2">Brand Name</th>
            <th className="px-4 py-2">Industry</th>
            <th className="px-4 py-2 text-center">Videos</th>
            <th className="px-4 py-2 text-center">Posts</th>
            <th className="px-4 py-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {clients.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center text-gray-400 py-6">
                No clients found.
              </td>
            </tr>
          ) : (
            clients.map((c) => (
              <tr
                key={c.id}
                className="border-b border-white/10 hover:bg-white/5 transition cursor-pointer"
                onClick={() => window.location.assign(`/ops/clients/${c.id}`)}
              >
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3">{c.industry || "—"}</td>
                <td className="px-4 py-3 text-center">
                  {c.videos_published}/{c.videos_in_contract}
                </td>
                <td className="px-4 py-3 text-center">
                  {c.posts_published}/{c.posts_in_contract}
                </td>
                <td className="px-4 py-3 text-center">{c.status || "Active"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <AddClientModal
          onClose={() => setShowModal(false)}
          onClientAdded={() => window.location.reload()}
        />
      )}
    </div>
  );
}
