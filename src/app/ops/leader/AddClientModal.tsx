"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface AddClientModalProps {
  onClose: () => void;
  onClientAdded: () => void;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export default function AddClientModal({ onClose, onClientAdded }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    start_date: "",
    notes: "",
    status: "Active",
    videos_in_contract: 0,
    posts_in_contract: 0,
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/clients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = (await res.json()) as ApiResponse;
      if (!json.success) throw new Error(json.error || "Failed to add client");

      onClientAdded();
      onClose();
    } catch (err) {
      console.error("Error adding client:", err);
      alert("Failed to add client. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "videos_in_contract" || name === "posts_in_contract"
          ? Number(value)
          : value,
    }));
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-[8px] transition-all animate-fadeIn">
      <div
        className={`${cairo.className} bg-white/10 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-full max-w-lg text-white border border-white/20`}
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Add New Client</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm text-gray-300">
              Brand Name <span className="text-red-400">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="e.g. Nour Cosmetics"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="industry" className="block mb-1 text-sm text-gray-300">
              Industry
            </label>
            <input
              id="industry"
              name="industry"
              type="text"
              placeholder="e.g. Skincare, Food & Beverage"
              value={formData.industry}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="start_date" className="block mb-1 text-sm text-gray-300">
              Start Date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block mb-1 text-sm text-gray-300">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Any special requirements or comments..."
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="videos_in_contract" className="block mb-1 text-sm text-gray-300">
                Videos in Contract
              </label>
              <input
                id="videos_in_contract"
                name="videos_in_contract"
                type="number"
                min={0}
                value={formData.videos_in_contract}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="posts_in_contract" className="block mb-1 text-sm text-gray-300">
                Posts in Contract
              </label>
              <input
                id="posts_in_contract"
                name="posts_in_contract"
                type="number"
                min={0}
                value={formData.posts_in_contract}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-white/10 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-600/80 hover:bg-gray-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}
