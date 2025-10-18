"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, ArrowLeft } from "lucide-react";
import EditClientModal from "../../components/EditClientModal";
import { Client } from "@/types/client";

interface Publish {
  id: number;
  content_type: "Video" | "Post";
  platform: string;
  publish_date?: string;
  link?: string;
}

interface ApiResponse<T> {
  success: boolean;
  client?: T;
  publishes?: T;
  data?: T; // in case the API uses "data" instead of "publishes"
  [key: string]: any;
}

export default function ClientDetailPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params?.id as string;

  const [client, setClient] = useState<Client | null>(null);
  const [publishes, setPublishes] = useState<Publish[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    async function fetchClient() {
      try {
        const [clientRes, postsRes] = await Promise.all([
          apiFetch<ApiResponse<Client>>(`/api/clients?id=${clientId}`),
          apiFetch<ApiResponse<Publish[]>>(`/api/posts?client_id=${clientId}`),
        ]);

if (clientRes.success) {
  const clientData = Array.isArray(clientRes.data)
    ? clientRes.data.find((c) => c.id === Number(clientId))
    : clientRes.data;
  setClient(clientData ?? null);
}
        // ✅ Handle both `publishes` or `data` keys
        if (postsRes.success) {
          const list = Array.isArray(postsRes.publishes)
            ? postsRes.publishes
            : Array.isArray(postsRes.data)
            ? postsRes.data
            : [];
          setPublishes(list);
        }
      } catch (err) {
        console.error("Error fetching client:", err);
      } finally {
        setLoading(false);
      }
    }

    if (clientId) fetchClient();
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-300">
        Loading client data...
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Client not found.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Blur background slightly if modal is open */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-4xl mx-auto transition-all duration-300 ${
          editing ? "blur-sm" : ""
        }`}
      >
        {/* ===== Back Button ===== */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-gray-200 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {/* ===== Client Info ===== */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-lg p-6 mb-10">
          <CardContent>
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
              {client.videos_in_contract !== undefined && (
                <p>
                  <strong>Videos in Contract:</strong>{" "}
                  {client.videos_in_contract}
                </p>
              )}
              {client.posts_in_contract !== undefined && (
                <p>
                  <strong>Posts in Contract:</strong>{" "}
                  {client.posts_in_contract}
                </p>
              )}
              {client.notes && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-sm text-gray-300 whitespace-pre-line">
                    <strong>Note:</strong> {client.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ===== Published Content ===== */}
        <h2 className="text-2xl font-semibold mb-4">Published Content</h2>

        {publishes.length === 0 ? (
          <p className="text-gray-400 text-center italic mt-6">
            No posts yet published.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishes.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-4">
                  <h3 className="font-medium text-lg">{p.content_type}</h3>
                  <p className="text-sm text-gray-400">{p.platform}</p>
                  {p.publish_date && (
                    <p className="text-xs text-gray-400 mt-1">
                      Published on{" "}
                      {new Date(p.publish_date).toLocaleDateString()}
                    </p>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 text-sm mt-2 block hover:underline"
                    >
                      View Post
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* ===== Floating Edit Button ===== */}
      <Button
        onClick={() => setEditing(true)}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-14 h-14 shadow-lg z-40"
      >
        <Pencil className="h-5 w-5" />
      </Button>

      {/* ===== Edit Modal ===== */}
      <EditClientModal
        open={editing}
        client={client}
        onClose={() => setEditing(false)}
        onUpdated={(updated) => {
          setClient(updated);
          setEditing(false);
        }}
      />
    </div>
  );
}
