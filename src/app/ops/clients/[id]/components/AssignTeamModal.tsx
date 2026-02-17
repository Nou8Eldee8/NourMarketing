"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Users } from "lucide-react";

interface User {
    id: number;
    name: string;
    role: string;
    email?: string;
}

interface AssignTeamModalProps {
    clientId: number;
    open: boolean;
    onClose: () => void;
    onSaved: () => void;
}

export default function AssignTeamModal({
    clientId,
    open,
    onClose,
    onSaved,
}: AssignTeamModalProps) {
    const [saving, setSaving] = useState(false);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [selectedCreators, setSelectedCreators] = useState<number[]>([]);
    const [selectedSpecialists, setSelectedSpecialists] = useState<number[]>([]);
    const [selectedEditors, setSelectedEditors] = useState<number[]>([]);

    // Fetch all users and current assignments
    useEffect(() => {
        if (!open) return;

        async function loadData() {
            try {
                // Fetch all users
                const usersRes = await apiFetch<{ success: boolean; data: User[] }>(
                    "/api/ops/users"
                );
                if (usersRes.success) {
                    setAllUsers(usersRes.data.filter((u: any) => u.active !== 0));
                }

                // Fetch current team assignments
                const teamRes = await apiFetch<{
                    success: boolean;
                    data: {
                        creators: User[];
                        specialists: User[];
                        editors: User[];
                    };
                }>(`/api/ops/clients/${clientId}/team`);

                if (teamRes.success) {
                    setSelectedCreators(teamRes.data.creators.map((u) => u.id));
                    setSelectedSpecialists(teamRes.data.specialists.map((u) => u.id));
                    setSelectedEditors(teamRes.data.editors.map((u) => u.id));
                }
            } catch (error) {
                console.error("Error loading data:", error);
            }
        }

        loadData();
    }, [open, clientId]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await apiFetch<{ success: boolean }>(
                `/api/ops/clients/${clientId}/team`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        creator_ids: selectedCreators,
                        specialist_ids: selectedSpecialists,
                        editor_ids: selectedEditors,
                    }),
                }
            );

            if (res.success) {
                onSaved();
                onClose();
            } else {
                alert("Failed to save team assignments");
            }
        } catch (error) {
            console.error("Error saving team:", error);
            alert("Error saving team assignments");
        } finally {
            setSaving(false);
        }
    };

    const toggleSelection = (
        userId: number,
        selected: number[],
        setSelected: (ids: number[]) => void
    ) => {
        if (selected.includes(userId)) {
            setSelected(selected.filter((id) => id !== userId));
        } else {
            setSelected([...selected, userId]);
        }
    };

    const getUsersByRole = (role: string) =>
        allUsers.filter((u) => u.role === role);

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
                    className="bg-gray-900 border border-white/20 rounded-2xl p-6 w-full max-w-2xl mx-4 text-white max-h-[90vh] overflow-y-auto"
                >
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <Users className="h-6 w-6 text-purple-400" />
                            <h2 className="text-2xl font-bold">Assign Team</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-white transition"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Content Creators */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-purple-300">
                                Content Creators
                            </h3>
                            <div className="space-y-2">
                                {getUsersByRole("Content Creator").map((user) => (
                                    <label
                                        key={user.id}
                                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedCreators.includes(user.id)}
                                            onChange={() =>
                                                toggleSelection(
                                                    user.id,
                                                    selectedCreators,
                                                    setSelectedCreators
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                                        />
                                        <span className="flex-1">{user.name}</span>
                                        {user.email && (
                                            <span className="text-sm text-gray-400">{user.email}</span>
                                        )}
                                    </label>
                                ))}
                                {getUsersByRole("Content Creator").length === 0 && (
                                    <p className="text-gray-500 text-sm">No content creators available</p>
                                )}
                            </div>
                        </div>

                        {/* Specialists */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-blue-300">
                                Specialists
                            </h3>
                            <div className="space-y-2">
                                {getUsersByRole("Specialist").map((user) => (
                                    <label
                                        key={user.id}
                                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedSpecialists.includes(user.id)}
                                            onChange={() =>
                                                toggleSelection(
                                                    user.id,
                                                    selectedSpecialists,
                                                    setSelectedSpecialists
                                                )
                                            }
                                            className="w-4 h-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="flex-1">{user.name}</span>
                                        {user.email && (
                                            <span className="text-sm text-gray-400">{user.email}</span>
                                        )}
                                    </label>
                                ))}
                                {getUsersByRole("Specialist").length === 0 && (
                                    <p className="text-gray-500 text-sm">No specialists available</p>
                                )}
                            </div>
                        </div>

                        {/* Editors */}
                        <div>
                            <h3 className="text-lg font-semibold mb-3 text-green-300">
                                Editors
                            </h3>
                            <div className="space-y-2">
                                {getUsersByRole("Editor").map((user) => (
                                    <label
                                        key={user.id}
                                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedEditors.includes(user.id)}
                                            onChange={() =>
                                                toggleSelection(user.id, selectedEditors, setSelectedEditors)
                                            }
                                            className="w-4 h-4 rounded border-gray-600 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="flex-1">{user.name}</span>
                                        {user.email && (
                                            <span className="text-sm text-gray-400">{user.email}</span>
                                        )}
                                    </label>
                                ))}
                                {getUsersByRole("Editor").length === 0 && (
                                    <p className="text-gray-500 text-sm">No editors available</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
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
                                    Save Team
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
