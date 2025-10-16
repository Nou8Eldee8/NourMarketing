"use client";


import Header from "../components/header";
import StatsCard from "../dashboard/team/components/StatsCard";
import { useRouter } from "next/navigation";
import ClientsTable from "./ClientsTable";

export default function LeaderDashboard() {
  const router = useRouter();

  // Example summary stats
  const teamStats = {
    assigned: 25,
    completed: 21,
  };

  return (
    <div className="flex flex-col min-h-screen text-white">
      <Header />

      <main className="pt-32 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Team Overview Card */}
          <StatsCard
            title="Team Overview"
            assigned={teamStats.assigned}
            completed={teamStats.completed}
            onClick={() => router.push("/ops/dashboard/team")}
          />

          {/* Other placeholder StatsCards */}
          <StatsCard title="Pending Tasks" assigned={10} completed={7} onClick={() => {}} />
          <StatsCard title="Completed This Week" assigned={15} completed={15} onClick={() => {}} />
        </div>
        
      </main>
      <ClientsTable />
    </div>
  );
}
