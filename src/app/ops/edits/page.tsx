"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Edit, Client, User } from "@/types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Film, ExternalLink } from "lucide-react";

export default function EditsPage() {
    const [edits, setEdits] = useState<Edit[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [editsRes, clientsRes, usersRes] = await Promise.all([
                apiFetch<{ success: boolean; data: Edit[] }>("/api/ops/edits"),
                apiFetch<{ success: boolean; data: Client[] }>("/api/ops/clients"),
                apiFetch<{ success: boolean; data: User[] }>("/api/ops/users"),
            ]);

            if (editsRes.success) setEdits(editsRes.data);
            if (clientsRes.success) setClients(clientsRes.data);
            if (usersRes.success) setUsers(usersRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(id: number, status: string) {
        try {
            await apiFetch("/api/ops/edits", {
                method: "PUT",
                body: JSON.stringify({ id, status }),
            });
            fetchData();
        } catch (error) {
            console.error("Error updating edit:", error);
        }
    }

    const getClientName = (id: number) =>
        clients.find((c) => c.id === id)?.name || "Unknown";
    const getEditorName = (id: number) =>
        users.find((u) => u.id === id)?.name || "Unknown";

    const filteredEdits =
        filter === "all" ? edits : edits.filter((e) => e.status === filter);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-300">
                Loading edits...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Edits</h1>
                    <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        New Edit
                    </Button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-4 mb-6">
                    {["all", "In Progress", "Review", "Revision Needed", "Completed"].map(
                        (status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-lg transition ${filter === status
                                        ? "bg-purple-600 text-white"
                                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                                    }`}
                            >
                                {status === "all" ? "All" : status}
                            </button>
                        )
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEdits.map((edit) => (
                        <motion.div
                            key={edit.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span className="truncate">{edit.video_title}</span>
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${edit.status === "Completed"
                                                    ? "bg-green-500/20 text-green-300"
                                                    : edit.status === "Revision Needed"
                                                        ? "bg-red-500/20 text-red-300"
                                                        : edit.status === "Review"
                                                            ? "bg-yellow-500/20 text-yellow-300"
                                                            : "bg-blue-500/20 text-blue-300"
                                                }`}
                                        >
                                            {edit.status}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p>
                                            <strong>Client:</strong> {getClientName(edit.client_id)}
                                        </p>
                                        <p>
                                            <strong>Editor:</strong> {getEditorName(edit.editor_id)}
                                        </p>
                                        {edit.delivered_at && (
                                            <p className="text-xs text-gray-400">
                                                Delivered: {new Date(edit.delivered_at).toLocaleDateString()}
                                            </p>
                                        )}
                                        {edit.render_link && (
                                            <a
                                                href={edit.render_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 text-purple-400 hover:underline text-xs"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                                View Render
                                            </a>
                                        )}
                                    </div>

                                    {edit.status !== "Completed" && (
                                        <div className="flex gap-2 mt-4">
                                            {edit.status === "In Progress" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusChange(edit.id, "Review")}
                                                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                                                >
                                                    Send to Review
                                                </Button>
                                            )}
                                            {edit.status === "Review" && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleStatusChange(edit.id, "Completed")}
                                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleStatusChange(edit.id, "Revision Needed")
                                                        }
                                                        className="flex-1 bg-red-600 hover:bg-red-700"
                                                    >
                                                        Revise
                                                    </Button>
                                                </>
                                            )}
                                            {edit.status === "Revision Needed" && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleStatusChange(edit.id, "In Progress")}
                                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Back to Progress
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredEdits.length === 0 && (
                    <div className="text-center text-gray-400 mt-12">
                        <Film className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>No edits found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
