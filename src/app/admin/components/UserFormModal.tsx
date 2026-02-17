"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { User } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Pencil, UserX, Check } from "lucide-react";

interface UserFormModalProps {
    open: boolean;
    user: User | null;
    onClose: () => void;
    onSaved: () => void;
}

export default function UserFormModal({
    open,
    user,
    onClose,
    onSaved,
}: UserFormModalProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({
        name: "",
        role: "Content Creator",
        email: "",
        username: "",
        password: "",
        rate_per_month: undefined,
        active: 1,
    });

    useEffect(() => {
        if (user) {
            setFormData(user);
        } else {
            setFormData({
                name: "",
                role: "Content Creator",
                email: "",
                username: "",
                password: "",
                rate_per_month: undefined,
                active: 1,
            });
        }
    }, [user, open]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value ? Number(value) : undefined) : value,
        }));
    };

    async function handleSave() {
        if (!formData.name || !formData.role) {
            alert("Name and role are required");
            return;
        }

        if (!user && (!formData.username || !formData.password)) {
            alert("Username and password are required for new users");
            return;
        }

        setSaving(true);
        try {
            const method = user ? "PUT" : "POST";
            const res = await apiFetch<{ success: boolean }>("/api/ops/users", {
                method,
                body: JSON.stringify(formData),
            });

            if (res.success) {
                onSaved();
                onClose();
            } else {
                alert("Failed to save user");
            }
        } catch (err) {
            console.error("Save error:", err);
            alert("Error saving user");
        } finally {
            setSaving(false);
        }
    }

    if (!open) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-md mx-4 text-white"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">
                            {user ? "Edit User" : "Add New User"}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Name <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Role <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="Content Creator">Content Creator</option>
                                <option value="Reel Maker">Reel Maker</option>
                                <option value="Editor">Editor</option>
                                <option value="Manager">Manager</option>
                                <option value="Specialist">Specialist</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                placeholder="user@example.com"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Username {!user && <span className="text-red-400">*</span>}
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={formData.username || ""}
                                onChange={handleChange}
                                placeholder="username"
                                disabled={!!user}
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            {user && <p className="text-xs text-gray-400 mt-1">Username cannot be changed after creation</p>}
                        </div>

                        {/* Password */}
                        {!user && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Password <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password || ""}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        )}

                        {/* Rate per Month */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Rate per Month ($)
                            </label>
                            <input
                                type="number"
                                name="rate_per_month"
                                value={formData.rate_per_month || ""}
                                onChange={handleChange}
                                placeholder="0.00"
                                step="0.01"
                                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>

                        {/* Active Status (only for edit) */}
                        {user && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select
                                    name="active"
                                    value={formData.active}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value={1}>Active</option>
                                    <option value={0}>Inactive</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {saving ? (
                                "Saving..."
                            ) : (
                                <>
                                    <Check className="h-4 w-4" />
                                    {user ? "Update" : "Create"}
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
