interface StatsCardProps {
  title: string;
  assigned: number; // number of tasks assigned
  completed: number; // number of tasks completed
    onClick?: () => void; // <- add this

}

export default function StatsCard({ title, assigned, completed, onClick }: StatsCardProps) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300
                 bg-white/20 backdrop-blur-md border border-white/30
                 hover:shadow-2xl hover:bg-white/25 hover:scale-105"
      style={{ WebkitBackdropFilter: "blur(12px)", backdropFilter: "blur(12px)" }}
    >
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white/90">Assigned: {assigned}</p>
      <p className="text-white/90">Completed: {completed}</p>
    </div>
  );
}
