"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Script, Client, User } from "@/types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, CheckCircle, XCircle, FileText } from "lucide-react";

export default function ScriptsPage() {
    const [scripts, setScripts] = useState<Script[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [scriptsRes, clientsRes, usersRes] = await Promise.all([
                apiFetch<{ success: boolean; data: Script[] }>("/api/ops/scripts"),
                apiFetch<{ success: boolean; data: Client[] }>("/api/ops/clients"),
                apiFetch<{ success: boolean; data: User[] }>("/api/ops/users"),
            ]);

            if (scriptsRes.success) setScripts(scriptsRes.data);
            if (clientsRes.success) setClients(clientsRes.data);
            if (usersRes.success) setUsers(usersRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(id: number) {
        try {
            await apiFetch("/api/ops/scripts", {
                method: "PUT",
                body: JSON.stringify({ id, status: "Approved" }),
            });
            fetchData();
        } catch (error) {
            console.error("Error approving script:", error);
        }
    }

    async function handleReject(id: number) {
        try {
            await apiFetch("/api/ops/scripts", {
                method: "PUT",
                body: JSON.stringify({ id, status: "Rejected" }),
            });
            fetchData();
        } catch (error) {
            console.error("Error rejecting script:", error);
        }
    }

    const getClientName = (id: number) =>
        clients.find((c) => c.id === id)?.name || "Unknown";
    const getCreatorName = (id: number) =>
        users.find((u) => u.id === id)?.name || "Unknown";

    const filteredScripts =
        filter === "all" ? scripts : scripts.filter((s) => s.status === filter);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-300">
                Loading scripts...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Scripts</h1>
                    <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        New Script
                    </Button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-4 mb-6">
                    {["all", "Draft", "Approved", "Rejected", "Used"].map((status) => (
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
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredScripts.map((script) => (
                        <motion.div
                            key={script.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span className="truncate">{script.title}</span>
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${script.status === "Approved"
                                                    ? "bg-green-500/20 text-green-300"
                                                    : script.status === "Rejected"
                                                        ? "bg-red-500/20 text-red-300"
                                                        : "bg-yellow-500/20 text-yellow-300"
                                                }`}
                                        >
                                            {script.status}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p>
                                            <strong>Client:</strong> {getClientName(script.client_id)}
                                        </p>
                                        <p>
                                            <strong>Creator:</strong> {getCreatorName(script.creator_id)}
                                        </p>
                                        <p>
                                            <strong>Type:</strong> {script.type}
                                        </p>
                                        {script.script_text && (
                                            <p className="text-xs text-gray-400 line-clamp-3">
                                                {script.script_text}
                                            </p>
                                        )}
                                    </div>

                                    {script.status === "Draft" && (
                                        <div className="flex gap-2 mt-4">
                                            <Button
                                                size="sm"
                                                onClick={() => handleApprove(script.id)}
                                                className="flex-1 bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Approve
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleReject(script.id)}
                                                className="flex-1 bg-red-600 hover:bg-red-700"
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredScripts.length === 0 && (
                    <div className="text-center text-gray-400 mt-12">
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>No scripts found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
