"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { User } from "@/types";
import { motion } from "framer-motion";
import { Plus, Pencil, UserX, Mail, DollarSign } from "lucide-react";
import UserFormModal from "./UserFormModal";

export default function UsersTab() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            const res = await apiFetch<{ success: boolean; data: User[] }>(
                "/api/ops/users"
            );
            if (res.success) {
                setUsers(res.data);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeactivate(id: number) {
        if (!confirm("Are you sure you want to deactivate this user?")) return;

        try {
            await apiFetch(`/api/ops/users?id=${id}`, { method: "DELETE" });
            fetchUsers();
        } catch (error) {
            console.error("Error deactivating user:", error);
            alert("Failed to deactivate user");
        }
    }

    function handleEdit(user: User) {
        setEditingUser(user);
        setModalOpen(true);
    }

    function handleAdd() {
        setEditingUser(null);
        setModalOpen(true);
    }

    function handleModalClose() {
        setModalOpen(false);
        setEditingUser(null);
    }

    function handleSaved() {
        fetchUsers();
        handleModalClose();
    }

    const getRoleBadgeColor = (role: string) => {
        const colors: Record<string, string> = {
            Admin: "bg-red-500/20 text-red-300 border-red-500/30",
            Manager: "bg-purple-500/20 text-purple-300 border-purple-500/30",
            "Content Creator": "bg-blue-500/20 text-blue-300 border-blue-500/30",
            "Reel Maker": "bg-pink-500/20 text-pink-300 border-pink-500/30",
            Editor: "bg-green-500/20 text-green-300 border-green-500/30",
            Specialist: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        };
        return colors[role] || "bg-gray-500/20 text-gray-300 border-gray-500/30";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-gray-400">Loading users...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Team Members</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage your team and their roles
                    </p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
                >
                    <Plus className="h-5 w-5" />
                    Add User
                </button>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-5 hover:bg-white/15 transition"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    {user.name}
                                    {user.active === 0 && (
                                        <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                                            Inactive
                                        </span>
                                    )}
                                </h3>
                                <span
                                    className={`inline-block text-xs px-2 py-1 rounded border mt-2 ${getRoleBadgeColor(
                                        user.role
                                    )}`}
                                >
                                    {user.role}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <button
                                    onClick={() => handleEdit(user)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition"
                                    title="Edit user"
                                >
                                    <Pencil className="h-4 w-4 text-gray-400 hover:text-white" />
                                </button>
                                {user.active === 1 && (
                                    <button
                                        onClick={() => handleDeactivate(user.id)}
                                        className="p-2 hover:bg-red-500/20 rounded-lg transition"
                                        title="Deactivate user"
                                    >
                                        <UserX className="h-4 w-4 text-red-400 hover:text-red-300" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            {user.email && (
                                <div className="flex items-center gap-2 text-gray-300">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                            )}
                            {user.rate_per_month && (
                                <div className="flex items-center gap-2 text-gray-300">
                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                    <span>${user.rate_per_month}/month</span>
                                </div>
                            )}
                            {user.created_at && (
                                <div className="text-xs text-gray-500 mt-2">
                                    Joined: {new Date(user.created_at).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {users.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <p>No users found. Add your first team member!</p>
                </div>
            )}

            {/* Modal */}
            <UserFormModal
                open={modalOpen}
                user={editingUser}
                onClose={handleModalClose}
                onSaved={handleSaved}
            />
        </div>
    );
}
