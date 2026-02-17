"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { User } from "@/types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, UserX } from "lucide-react";

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isCreating, setIsCreating] = useState(false);

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
        }
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-300">
                Loading users...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Team Members</h1>
                    <Button
                        onClick={() => setIsCreating(true)}
                        className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Add User
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {users.map((user) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{user.name}</span>
                                        {user.active === 0 && (
                                            <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                                                Inactive
                                            </span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p>
                                            <strong>Role:</strong> {user.role}
                                        </p>
                                        {user.email && (
                                            <p>
                                                <strong>Email:</strong> {user.email}
                                            </p>
                                        )}
                                        {user.rate_per_item && (
                                            <p>
                                                <strong>Rate:</strong> ${user.rate_per_item}/item
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setEditingUser(user)}
                                            className="flex-1"
                                        >
                                            <Pencil className="h-4 w-4 mr-1" />
                                            Edit
                                        </Button>
                                        {user.active === 1 && (
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeactivate(user.id)}
                                            >
                                                <UserX className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* TODO: Add UserFormModal component for create/edit */}
        </div>
    );
}
