// app/ops/dashboard/team/page.tsx
"use client";

import Header from "../../components/header";
import StatsCard from "./components/StatsCard";
import TeamTable from "./components/TeamTable";

import { useState, useEffect } from "react";

interface TeamMember {
  id: number;
  name: string;
  role: "content_creator" | "reel_maker" | "video_editor" | "social_media_specialist" | "team_leader";
  tasksAssigned: number;
  tasksCompleted: number;
}

export default function TeamLeaderDashboard() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));

    // Dummy team data
    setTeam([
      { id: 1, name: "Mariam", role: "content_creator", tasksAssigned: 5, tasksCompleted: 4 },
      { id: 2, name: "Ibrahim", role: "reel_maker", tasksAssigned: 3, tasksCompleted: 3 },
      { id: 3, name: "Judy", role: "reel_maker", tasksAssigned: 4, tasksCompleted: 2 },
      { id: 4, name: "Mohamed", role: "video_editor", tasksAssigned: 6, tasksCompleted: 5 },
      { id: 5, name: "Mirna", role: "social_media_specialist", tasksAssigned: 7, tasksCompleted: 7 },
      { id: 6, name: "Bassant", role: "team_leader", tasksAssigned: 0, tasksCompleted: 0 },
    ]);
  }, []);

  // Compute summary stats
  const stats = team.map((member) => ({
    role: member.role,
    totalAssigned: member.tasksAssigned,
    totalCompleted: member.tasksCompleted,
  }));

  return (
    <div className="min-h-screen">
      <Header user={user || undefined} />

      <main className="pt-32 px-6 md:px-12 text-white">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((s, i) => (
            <StatsCard
              key={i}
              title={s.role.replaceAll("_", " ").toUpperCase()}
              assigned={s.totalAssigned}
              completed={s.totalCompleted}
            />
          ))}
        </div>

        {/* Team table */}
        <div className="rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Team Members</h2>
          <TeamTable members={team}/>
        </div>
      </main>
    </div>
  );
}
