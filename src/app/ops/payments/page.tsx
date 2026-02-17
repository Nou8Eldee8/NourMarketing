"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Payment, Client } from "@/types";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, DollarSign, AlertCircle, CheckCircle } from "lucide-react";

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [paymentsRes, clientsRes] = await Promise.all([
                apiFetch<{ success: boolean; data: Payment[] }>("/api/ops/payments"),
                apiFetch<{ success: boolean; data: Client[] }>("/api/ops/clients"),
            ]);

            if (paymentsRes.success) setPayments(paymentsRes.data);
            if (clientsRes.success) setClients(clientsRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleMarkPaid(id: number) {
        try {
            await apiFetch("/api/ops/payments", {
                method: "PUT",
                body: JSON.stringify({
                    id,
                    status: "Paid",
                    paid_date: new Date().toISOString(),
                }),
            });
            fetchData();
        } catch (error) {
            console.error("Error marking payment as paid:", error);
        }
    }

    const getClientName = (id: number) =>
        clients.find((c) => c.id === id)?.name || "Unknown";

    const filteredPayments =
        filter === "all" ? payments : payments.filter((p) => p.status === filter);

    const totalPending = payments
        .filter((p) => p.status === "Pending")
        .reduce((sum, p) => sum + p.amount, 0);

    const totalPaid = payments
        .filter((p) => p.status === "Paid")
        .reduce((sum, p) => sum + p.amount, 0);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-gray-300">
                Loading payments...
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Payments</h1>
                    <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        New Payment
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-300">Total Paid</p>
                                    <p className="text-3xl font-bold text-green-400">
                                        ${totalPaid.toLocaleString()}
                                    </p>
                                </div>
                                <CheckCircle className="h-12 w-12 text-green-400 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-300">Pending</p>
                                    <p className="text-3xl font-bold text-yellow-400">
                                        ${totalPending.toLocaleString()}
                                    </p>
                                </div>
                                <DollarSign className="h-12 w-12 text-yellow-400 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-300">Overdue</p>
                                    <p className="text-3xl font-bold text-red-400">
                                        {payments.filter((p) => p.status === "Overdue").length}
                                    </p>
                                </div>
                                <AlertCircle className="h-12 w-12 text-red-400 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-4 mb-6">
                    {["all", "Pending", "Paid", "Overdue", "Cancelled"].map((status) => (
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
                    {filteredPayments.map((payment) => (
                        <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>{getClientName(payment.client_id)}</span>
                                        <span
                                            className={`text-xs px-2 py-1 rounded ${payment.status === "Paid"
                                                    ? "bg-green-500/20 text-green-300"
                                                    : payment.status === "Overdue"
                                                        ? "bg-red-500/20 text-red-300"
                                                        : payment.status === "Cancelled"
                                                            ? "bg-gray-500/20 text-gray-300"
                                                            : "bg-yellow-500/20 text-yellow-300"
                                                }`}
                                        >
                                            {payment.status}
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-gray-300">
                                        <p className="text-2xl font-bold text-white">
                                            {payment.amount.toLocaleString()} {payment.currency}
                                        </p>
                                        {payment.due_date && (
                                            <p>
                                                <strong>Due:</strong>{" "}
                                                {new Date(payment.due_date).toLocaleDateString()}
                                            </p>
                                        )}
                                        {payment.paid_date && (
                                            <p className="text-green-400">
                                                <strong>Paid:</strong>{" "}
                                                {new Date(payment.paid_date).toLocaleDateString()}
                                            </p>
                                        )}
                                        {payment.invoice_url && (
                                            <a
                                                href={payment.invoice_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-purple-400 hover:underline text-xs"
                                            >
                                                View Invoice
                                            </a>
                                        )}
                                    </div>

                                    {payment.status === "Pending" && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleMarkPaid(payment.id)}
                                            className="w-full mt-4 bg-green-600 hover:bg-green-700"
                                        >
                                            Mark as Paid
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredPayments.length === 0 && (
                    <div className="text-center text-gray-400 mt-12">
                        <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p>No payments found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
