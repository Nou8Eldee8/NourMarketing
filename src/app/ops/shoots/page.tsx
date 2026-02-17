"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Shoot, Client, User } from "@/types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, MapPin, Video } from "lucide-react";

export default function ShootsPage() {
    const [shoots, setShoots] = useState<Shoot[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [shootsRes, clientsRes, usersRes] = await Promise.all([
                apiFetch<{ success: boolean; data: Shoot[] }>("/api/ops/shoots"),
                apiFetch<{ success: boolean; data: Client[] }>("/api/ops/clients"),
                apiFetch<{ success: boolean; data: User[] }>("/api/ops/users"),
            ]);

            if (shootsRes.success) setShoots(shootsRes.data);
            if (clientsRes.success) setClients(clientsRes.data);
            if (usersRes.success) setUsers(usersRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleComplete(id: number) {
        try {
            await apiFetch("/api/ops/shoots", {
                method: "PUT",
                body: JSON.stringify({ id, status: "Completed" }),
            });
            fetchData();
        } catch (error) {
            console.error("Error completing shoot:", error);
        }
    }

    const getClientName = (id: number) =>
        clients.find((c) => c.id === id)?.name || "Unknown";
    const getReelMakerName = (id: number) =>
        users.find((u) => u.id === id)?.name || "Unknown";

    const filteredShoots =
        filter === "all" ? shoots : shoots.filter((s) => s.status === filter);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-300">
                Loading shoots...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Shoots</h1>
                    <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Schedule Shoot
                    </Button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-4 mb-6">
                    {["all", "Scheduled", "Completed", "Canceled"].map((status) => (
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
                    {filteredShoots.map((shoot) => (
                        <motion.div
                            key={shoot.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{getClientName(shoot.client_id)}</span>
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${shoot.status === "Completed"
                                                    ? "bg-green-500/20 text-green-300"
                                                    : shoot.status === "Canceled"
                                                        ? "bg-red-500/20 text-red-300"
                                                        : "bg-blue-500/20 text-blue-300"
                                                }`}
                                        >
                                            {shoot.status}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(shoot.shoot_date).toLocaleDateString()}
                                        </p>
                                        {shoot.location && (
                                            <p className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />
                                                {shoot.location}
                                            </p>
                                        )}
                                        <p>
                                            <strong>Reel Maker:</strong> {getReelMakerName(shoot.reel_maker_id)}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Video className="h-4 w-4" />
                                            {shoot.num_videos_filmed} videos filmed
                                        </p>
                                        {shoot.raw_footage_link && (
                                            <a
                                                href={shoot.raw_footage_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-400 hover:underline text-xs"
                                            >
                                                View Footage
                                            </a>
                                        )}
                                    </div>

                                    {shoot.status === "Scheduled" && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleComplete(shoot.id)}
                                            className="w-full mt-4 bg-green-600 hover:bg-green-700"
                                        >
                                            Mark as Completed
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredShoots.length === 0 && (
                    <div className="text-center text-gray-400 mt-12">
                        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>No shoots found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
