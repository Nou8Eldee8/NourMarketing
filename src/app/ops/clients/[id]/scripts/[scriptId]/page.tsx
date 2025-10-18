"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Header from "../../../../components/header";

interface Script {
  id: number;
  client_id: number;
  creator_id: number;
  title: string;
  script_text: string;
  status: "Draft" | "Approved" | "Rejected" | "Used";
  date_created: string;
  date_approved?: string;
}

interface ScriptApiResponse {
  success: boolean;
  script?: Script;
  id?: number; // returned after creating new script
  error?: string;
}

interface ScriptPayload {
  client_id: number;
  creator_id: number;
  title: string;
  script_text: string;
  status?: "Draft" | "Approved" | "Rejected" | "Used";
  id?: number;
}

export default function ScriptPage() {
  const router = useRouter();
  const pathname = usePathname();
  const clientId = Number(pathname.split("/")[3]);
  const scriptIdParam = pathname.split("/")[5];
  const scriptIdFromUrl = scriptIdParam ? Number(scriptIdParam) : undefined;

  const [script, setScript] = useState<ScriptPayload>({
    client_id: clientId,
    creator_id: 5, // Replace with logged-in creator ID
    title: "",
    script_text: "",
    status: "Draft",
  });
  const [scriptId, setScriptId] = useState<number | undefined>(scriptIdFromUrl);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch existing script if editing
  useEffect(() => {
    async function fetchScript() {
      if (!scriptId) return setLoading(false);

      try {
        const res: ScriptApiResponse = await apiFetch(`/api/scripts?id=${scriptId}`);
        if (res.success && res.script) {
          const { client_id, creator_id, title, script_text, status, id } = res.script;
          setScript({ client_id, creator_id, title, script_text, status });
          setScriptId(id);
        } else {
          console.error("Failed to fetch script:", res.error);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchScript();
  }, [scriptId]);

  // Save button handler
  const handleSave = async () => {
    if (!script.title && !script.script_text) return; // skip empty

    setSaving(true);
    try {
      const method = scriptId ? "PUT" : "POST";
      const body = scriptId ? { ...script, id: scriptId } : script;

      const res: ScriptApiResponse = await apiFetch("/api/scripts", {
        method,
        body: JSON.stringify(body),
      });

      if (res.success) {
        if (!scriptId && res.id) {
          setScriptId(res.id);
          router.replace(`/ops/clients/${clientId}/scripts/${res.id}`);
        }
        alert("Script saved successfully!");
      } else {
        console.error("Failed to save script:", res.error);
        alert("Failed to save script.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="p-6 max-w-4xl mx-auto mt-20">
        <h1 className="text-3xl font-bold mb-4">
          {scriptId ? "Edit Script" : "New Script"}
        </h1>

        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={script.title}
            onChange={(e) =>
              setScript((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Script Text</label>
          <textarea
            rows={10}
            className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
            value={script.script_text}
            onChange={(e) =>
              setScript((prev) => ({ ...prev, script_text: e.target.value }))
            }
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Script"}
          </button>
        </div>
      </main>
    </div>
  );
}
