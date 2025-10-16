interface TeamMember {
  id: number;
  name: string;
  role: string;
  tasksAssigned: number;
  tasksCompleted: number;
}

interface TeamTableProps {
  members: TeamMember[];
  textColor?: string;
}

export default function TeamTable({ members, textColor }: TeamTableProps) {
  const colorClass = textColor || "text-white";
  return (
    <div className="overflow-x-auto rounded-xl shadow p-4 backdrop-blur-md border border-white/20">
      <table className={`w-full table-auto border-collapse text-left ${colorClass}`}>
        <thead>
          <tr className="backdrop-blur-sm bg-white/10">
            <th className="px-4 py-2 text-left font-medium">Name</th>
            <th className="px-4 py-2 text-left font-medium">Role</th>
            <th className="px-4 py-2 text-left font-medium">Tasks Assigned</th>
            <th className="px-4 py-2 text-left font-medium">Tasks Completed</th>
            <th className="px-4 py-2 text-left font-medium">Pending</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-b border-white/20">
              <td className="px-4 py-2">{m.name}</td>
              <td className="px-4 py-2">{m.role.replaceAll("_", " ")}</td>
              <td className="px-4 py-2">{m.tasksAssigned}</td>
              <td className="px-4 py-2">{m.tasksCompleted}</td>
              <td className="px-4 py-2">{m.tasksAssigned - m.tasksCompleted}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
