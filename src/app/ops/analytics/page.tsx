"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { DailyAnalytics, Client } from "@/types";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart3,
    TrendingUp,
    FileText,
    Video,
    Film,
    Share2,
} from "lucide-react";

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<DailyAnalytics[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [analyticsRes, clientsRes] = await Promise.all([
                apiFetch<{ success: boolean; data: DailyAnalytics[] }>(
                    "/api/ops/analytics"
                ),
                apiFetch<{ success: boolean; data: Client[] }>("/api/ops/clients"),
            ]);

            if (analyticsRes.success) setAnalytics(analyticsRes.data);
            if (clientsRes.success) setClients(clientsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    const getClientName = (id: number) =>
        clients.find((c) => c.id === id)?.name || "Unknown";

    // Calculate totals
    const totalScripts = analytics.reduce((sum, a) => sum + a.scripts_created, 0);
    const totalShoots = analytics.reduce((sum, a) => sum + a.shoots_completed, 0);
    const totalEdits = analytics.reduce((sum, a) => sum + a.edits_completed, 0);
    const totalPosts = analytics.reduce((sum, a) => sum + a.posts_published, 0);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-300">
                Loading analytics...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-300">Scripts Created</p>
                                        <p className="text-3xl font-bold text-blue-400">
                                            {totalScripts}
                                        </p>
                                    </div>
                                    <FileText className="h-12 w-12 text-blue-400 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-300">Shoots Completed</p>
                                        <p className="text-3xl font-bold text-purple-400">
                                            {totalShoots}
                                        </p>
                                    </div>
                                    <Video className="h-12 w-12 text-purple-400 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-300">Edits Completed</p>
                                        <p className="text-3xl font-bold text-pink-400">
                                            {totalEdits}
                                        </p>
                                    </div>
                                    <Film className="h-12 w-12 text-pink-400 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-300">Posts Published</p>
                                        <p className="text-3xl font-bold text-green-400">
                                            {totalPosts}
                                        </p>
                                    </div>
                                    <Share2 className="h-12 w-12 text-green-400 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Recent Activity by Client */}
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-6 w-6" />
                            Recent Activity by Client
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.slice(0, 10).map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
                                >
                                    <div>
                                        <p className="font-semibold">{getClientName(item.client_id)}</p>
                                        <p className="text-xs text-gray-400">{item.date}</p>
                                    </div>
                                    <div className="flex gap-6 text-sm">
                                        <div className="text-center">
                                            <p className="text-blue-400 font-bold">
                                                {item.scripts_created}
                                            </p>
                                            <p className="text-xs text-gray-400">Scripts</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-purple-400 font-bold">
                                                {item.shoots_completed}
                                            </p>
                                            <p className="text-xs text-gray-400">Shoots</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-pink-400 font-bold">
                                                {item.edits_completed}
                                            </p>
                                            <p className="text-xs text-gray-400">Edits</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-green-400 font-bold">
                                                {item.posts_published}
                                            </p>
                                            <p className="text-xs text-gray-400">Posts</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {analytics.length === 0 && (
                            <div className="text-center text-gray-400 py-12">
                                <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <p>No analytics data available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
