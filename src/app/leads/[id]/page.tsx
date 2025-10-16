"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface Lead {
  id: string;
  business_name: string;
  name?: string;
  phone?: string;
  email?: string;
  budget?: number;
  has_website?: boolean;
  message?: string;
  assigned_to?: string;
  created_at?: string;
}

interface Note {
  id: number;
  lead_id: string;
  user_id: number;
  note: string;
  created_at: string;
  updated_at: string;
}

interface User {
  id: number;
  username: string;
  role: "admin" | "sales";
}

const API_BASE = "https://lead-capture.hazelsbrand211.workers.dev";

export default function LeadDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params?.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* --------------------------------------------------------------------
     🔐 Load user + token from localStorage
  -------------------------------------------------------------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedToken) {
      router.push("/login");
      return;
    }

    try {
      const parsed = JSON.parse(storedUser) as User;
      setUser(parsed);
      setToken(storedToken);
    } catch {
      console.error("Invalid user object in localStorage");
      setError("Failed to load user");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  /* --------------------------------------------------------------------
     📡 Fetch lead + notes (authorized)
  -------------------------------------------------------------------- */
  useEffect(() => {
    if (!leadId || !user || !token) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [leadRes, notesRes] = await Promise.all([
          fetch(
            `${API_BASE}/api/lead?lead_id=${leadId}&role=${user.role}&user_id=${user.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(`${API_BASE}/api/notes?lead_id=${leadId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const leadJson = (await leadRes.json()) as {
          data?: Lead | Lead[];
          success?: boolean;
          error?: string;
        };
        const notesJson = (await notesRes.json()) as { data?: Note[]; success?: boolean };

        if (!leadJson.success || !leadJson.data) {
          setError(leadJson.error || "Lead not found");
          setLead(null);
        } else {
          const leadData = Array.isArray(leadJson.data)
            ? leadJson.data.find((l) => l.id === leadId)
            : leadJson.data;
          setLead(leadData ?? null);
          if (!leadData) setError("Lead not found");
        }

        setNotes(notesJson?.data ?? []);
      } catch (err) {
        console.error("Error fetching lead/notes:", err);
        setError("Failed to fetch lead and notes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leadId, user, token]);

  /* --------------------------------------------------------------------
     ➕ Add a new note
  -------------------------------------------------------------------- */
  const handleAddNote = async () => {
    if (!newNote.trim() || !user || !token) return;

    try {
      const res = await fetch(`${API_BASE}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lead_id: leadId,
          user_id: user.id,
          note: newNote.trim(),
        }),
      });

      const json = (await res.json()) as { success?: boolean; error?: string };
      if (json.success) {
        setNewNote("");
        setNotes((prev) => [
          ...prev,
          {
            id: Date.now(),
            lead_id: leadId,
            user_id: user.id,
            note: newNote.trim(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);
      } else {
        console.error("Failed to add note:", json.error || json);
      }
    } catch (err) {
      console.error("Error adding note:", err);
    }
  };

  /* --------------------------------------------------------------------
     🗑 Delete a note
  -------------------------------------------------------------------- */
  const handleDeleteNote = async (id: number) => {
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/api/notes?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (json.success) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  /* --------------------------------------------------------------------
     🖼 UI
  -------------------------------------------------------------------- */
  if (loading) return <p className="text-center mt-8 text-gray-400">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-400">{error}</p>;
  if (!lead) return <p className="text-center mt-8 text-gray-400">Lead not found.</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Header with logo + greeting */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-5xl font-bold text-[#fee3d8]"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            N
          </Link>
          {user && (
            <span className="text-xl font-medium text-white">
              Kill it, {user.username}
            </span>
          )}
        </div>
      </div>

      {/* Motivational Quote */}
      <p className="mb-6 text-lg font-medium text-[#f8f8f2]">
        "Good sales happen after good preparation — get your notes ready, boss."
      </p>

      {/* Lead Info */}
      <h1 className="text-3xl font-bold mb-4">{lead.business_name}</h1>
      <p><strong>Name:</strong> {lead.name || "-"}</p>
      <p><strong>Phone:</strong> {lead.phone || "-"}</p>
      <p><strong>Email:</strong> {lead.email || "-"}</p>
      <p><strong>Budget:</strong> {lead.budget || "-"}</p>
      <p><strong>Has Website:</strong> {lead.has_website ? "Yes" : "No"}</p>
      <p><strong>Message:</strong> {lead.message || "-"}</p>

      <hr className="my-6 border-purple-600" />

      {/* Notes */}
      <h2 className="text-2xl font-semibold mb-3">Notes</h2>
      <div className="space-y-3 mb-6">
        {notes.length === 0 ? (
          <p className="text-gray-400">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-purple-700 p-4 rounded-lg flex justify-between items-start"
            >
              <div>
                <p>{note.note}</p>
                <span className="text-xs text-gray-300">
                  {new Date(note.created_at).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="text-red-400 text-sm hover:text-red-500 ml-4"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Note */}
      <div className="flex flex-col gap-2">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note..."
          className="p-3 rounded-lg bg-purple-700 border border-purple-500 text-white resize-none"
          rows={3}
        />
        <button
          onClick={handleAddNote}
          disabled={!user || !newNote.trim()}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold py-2 rounded-lg disabled:opacity-50"
        >
          Add Note
        </button>
      </div>

      <button
        onClick={() => router.back()}
        className="mt-8 text-gray-300 hover:text-white"
      >
        ← Back
      </button>

      {/* Fonts */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&family=Dancing+Script&display=swap');`}
      </style>
    </div>
  );
}
