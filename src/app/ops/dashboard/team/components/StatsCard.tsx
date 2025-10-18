// app/ops/dashboard/team/components/StatsCard.tsx
interface StatsCardProps {
  title: string;
  assigned: number;
  completed: number;
  onClick?: () => void;
  textColor?: string;       // optional text color
  bgTransparent?: boolean;  // optional transparent background
}

export default function StatsCard({
  title,
  assigned,
  completed,
  onClick,
  textColor = "white",
  bgTransparent = false,
}: StatsCardProps) {
  return (
    <div
      className={`rounded-xl shadow p-6 cursor-pointer hover:shadow-xl transition ${
        bgTransparent ? "bg-transparent" : "bg-white/10"
      }`}
      style={{ color: textColor, backdropFilter: bgTransparent ? "none" : "blur(8px)" }}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>Assigned: {assigned}</p>
      <p>Completed: {completed}</p>
    </div>
  );
}
