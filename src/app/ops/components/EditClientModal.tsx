"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { Client } from "@/types/client";

interface ApiResponse {
  success: boolean;
  message?: string;
  client?: Client;
}

interface EditClientModalProps {
  open: boolean;
  client: Client | null;
  onClose: () => void;
  onUpdated: (updated: Client) => void;
}

export default function EditClientModal({
  open,
  client,
  onClose,
  onUpdated,
}: EditClientModalProps) {
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Client & { leave_reason?: string }>({
    id: 0,
    name: "",
    industry: "",
    start_date: "",
    notes: "",
    status: "Active",
    videos_in_contract: 0,
    posts_in_contract: 0,
    leave_reason: "",
  });

  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
        leave_reason: client.leave_reason ?? "",
      });
    }
  }, [client]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  async function handleSave() {
    if (!formData || formData.id === 0) return;
    setSaving(true);
    try {
      const res = await apiFetch<ApiResponse>(`/api/clients`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      if (res.success) {
        onUpdated({ ...formData });
        setTimeout(onClose, 300);
      } else {
        console.error("Failed to update client:", res.message);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  }

  if (typeof window === "undefined" || !open) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="edit-client-root"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] flex items-center justify-center"
      >
        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl mx-4 bg-gray-900 text-white border border-white/20 rounded-2xl shadow-xl p-6 z-[100000]"
          style={{ fontFamily: "Cairo, sans-serif" }}
        >
          <header className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Edit Client</h2>
            <button
              onClick={onClose}
              className="text-gray-300 hover:text-white transition"
            >
              ✕
            </button>
          </header>

          <div className="space-y-3">
            {/* Brand name */}
            <div>
              <label className="block text-sm mb-1 text-gray-300">
                Brand Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md p-2 bg-white/10 border border-white/20"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm mb-1 text-gray-300">Industry</label>
              <input
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full rounded-md p-2 bg-white/10 border border-white/20"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm mb-1 text-gray-300">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full rounded-md p-2 bg-white/10 border border-white/20"
                rows={4}
              />
            </div>

            {/* Contract numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Videos in Contract
                </label>
                <input
                  name="videos_in_contract"
                  type="number"
                  value={formData.videos_in_contract}
                  onChange={handleChange}
                  className="w-full rounded-md p-2 bg-white/10 border border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Posts in Contract
                </label>
                <input
                  name="posts_in_contract"
                  type="number"
                  value={formData.posts_in_contract}
                  onChange={handleChange}
                  className="w-full rounded-md p-2 bg-white/10 border border-white/20"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm mb-1 text-gray-300">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-md p-2 bg-white/10 border border-white/20"
              >
                <option>Active</option>
                <option>On Hold</option>
                <option>Paused</option>
                <option>Completed</option>
                <option>Lost</option>
              </select>
            </div>

            {/* Leave reason (only if Lost) */}
            {formData.status === "Lost" && (
              <div>
                <label className="block text-sm mb-1 text-gray-300">
                  Leave Reason
                </label>
                <textarea
                  name="leave_reason"
                  value={formData.leave_reason ?? ""}
                  onChange={handleChange}
                  placeholder="Why was this client lost?"
                  className="w-full rounded-md p-2 bg-white/10 border border-white/20"
                  rows={3}
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
