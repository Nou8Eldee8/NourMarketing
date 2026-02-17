"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Publish, Client } from "@/types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, TrendingUp, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

export default function PublishesPage() {
    const [publishes, setPublishes] = useState<Publish[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterPlatform, setFilterPlatform] = useState<string>("all");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [publishesRes, clientsRes] = await Promise.all([
                apiFetch<{ success: boolean; data: Publish[] }>("/api/ops/publishes"),
                apiFetch<{ success: boolean; data: Client[] }>("/api/ops/clients"),
            ]);

            if (publishesRes.success) setPublishes(publishesRes.data);
            if (clientsRes.success) setClients(clientsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    const getClientName = (id: number) =>
        clients.find((c) => c.id === id)?.name || "Unknown";

    const filteredPublishes =
        filterPlatform === "all"
            ? publishes
            : publishes.filter((p) => p.platform === filterPlatform);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-300">
                Loading publishes...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Published Content</h1>
                    <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Add Publish
                    </Button>
                </div>

                {/* Platform Filter */}
                <div className="flex gap-4 mb-6 overflow-x-auto">
                    {["all", "Instagram", "Facebook", "TikTok", "YouTube", "LinkedIn", "Other"].map(
                        (platform) => (
                            <button
                                key={platform}
                                onClick={() => setFilterPlatform(platform)}
                                className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${filterPlatform === platform
                                        ? "bg-purple-600 text-white"
                                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                                    }`}
                            >
                                {platform === "all" ? "All Platforms" : platform}
                            </button>
                        )
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPublishes.map((publish) => (
                        <motion.div
                            key={publish.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{getClientName(publish.client_id)}</span>
                                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                            {publish.platform}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-300">
                                            <strong>Type:</strong> {publish.content_type}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Published: {new Date(publish.published_at).toLocaleDateString()}
                                        </p>

                                        {/* Metrics */}
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Eye className="h-4 w-4 text-blue-400" />
                                                <span>{publish.views.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Heart className="h-4 w-4 text-red-400" />
                                                <span>{publish.likes.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MessageCircle className="h-4 w-4 text-green-400" />
                                                <span>{publish.comments.toLocaleString()}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Share2 className="h-4 w-4 text-purple-400" />
                                                <span>{publish.shares.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        {publish.post_link && (
                                            <a
                                                href={publish.post_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block mt-4 text-center text-purple-400 hover:underline text-sm"
                                            >
                                                View Post →
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredPublishes.length === 0 && (
                    <div className="text-center text-gray-400 mt-12">
                        <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>No published content found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
